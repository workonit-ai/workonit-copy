const cron = require('node-cron');
const {
    WeeklySchedule,
    getPendingEmployeesAvailibilities,
    getAllEmployeesAvailabilities
} = require('../models/WeeklySchedule');
const { Employee, Business } = require('../models/Business');
const { EmployeeAvailability } = require('../models/WeeklySchedule');
const { sendEmail } = require('./sendgrid');
const { getNextCheckDate } = require('./formatDate');
const Log = require('./Log');
const mongoose = require('mongoose');
const c = require('config');
const Assistant = require('../assistant/Assistant');
const OpenAI = require('openai');
const config = require('../config');
const { getUserInbox } = require('../assistant/utils/getUserInbox');
const { MongoClient , ObjectId} = require('mongodb');


const openai = new OpenAI({
    apiKey: config.openAI.key
});

const checkSchedules = async () => {
    Log.info('Checking schedules...');
    try {
        const currentTime = new Date();
        const weeklySchedules = await WeeklySchedule.find({
            nextCheck: { $lt: currentTime },
            status: 'Initiated'
        })
            .populate('companyId')
            .exec();

        Log.info(`Found ${weeklySchedules.length} schedules to check`);

        for (const schedule of weeklySchedules) {
            if (schedule.availabilitySubmissionDeadline <= currentTime) {
                await arrangeShifts(schedule);
            } else {
                await checkAvailabilities(schedule);
            }
        }
    } catch (error) {
        console.error('Error checking schedules:', error);
        Log.error('Error checking schedules:', error);
    }
};

const checkAvailabilities = async (weeklySchedule) => {
    Log.info(
        `Checking availabilities for week starting ${weeklySchedule.startDate}, ${weeklySchedule._id}`
    );
    try {
        const pendingAvailabilities = await getPendingEmployeesAvailibilities(
            weeklySchedule._id
        );

        Log.info(
            `Found ${pendingAvailabilities.length} pending availabilities`
        );

        //Arrange the shifts if everyone has submitted their availabilities
        if (pendingAvailabilities.length == 0) {
            await arrangeShifts(weeklySchedule);
            return;
        }

        for (const availability of pendingAvailabilities) {
            let employeeEmail = availability.employeeId.email;
            if (!employeeEmail) {
                const employee = await Employee.findById(
                    availability.employeeId
                ).exec();
                employeeEmail = employee.email;
            }

            const message = `This is a friendly reminder to submit your availability for the week starting ${weeklySchedule.startDate.toDateString()}.`;
            await sendEmail(
                'Availability Reminder',
                message,
                `<p>${message}</p>`,
                employeeEmail
            );
            console.log(`Reminder sent to ${employeeEmail}`);
        }

        // Update nextCheck for the weeklySchedule
        const nextCheck = getNextCheckDate(weeklySchedule.checkInterval);
        await WeeklySchedule.findByIdAndUpdate(weeklySchedule._id, {
            nextCheck
        });
    } catch (error) {
        console.error('Error checking availabilities:', error);
    }
};

const arrangeShifts = async (weeklySchedule) => {
    Log.info(
        `Arranging shifts for week starting ${weeklySchedule.startDate}, ${weeklySchedule._id}`
    );

    const availabilities = await getAllEmployeesAvailabilities(
        weeklySchedule._id
    );
    const pendingAvailabilities = availabilities.filter(
        (availability) => availability.submissionStatus === 'Pending'
    );
    const companyDetails = weeklySchedule.companyId;

    const prompt = `
  You are Sima, a smart scheduling assistant. Your task is to help arrange shifts for employees based on their availability and the company's typical shift schedule. 

  Here's the information you need:

  **Weekly Schedule:**
  * Start Date: ${weeklySchedule.startDate.toISOString()}
  * End Date: ${weeklySchedule.endDate.toISOString()}

  **Company Shifts:**
  ${JSON.stringify(companyDetails, null, 2)}

  **Employee Availabilities:** 
  ${JSON.stringify(availabilities, null, 2)}

  **Pending Availabilities:**
  ${JSON.stringify(pendingAvailabilities, null, 2)}

  **Instructions:**

  1. **Identify Undersubscribed Shifts:** Analyze the employee availabilities and compare them to the company shifts. Determine which shifts and days have fewer employees available than the typical schedule requires. 
  2. **Prioritize Pending Availabilities:**  Focus on assigning shifts to employees with "submissionStatus": "Pending" to ensure everyone has a fair opportunity. 
  3. **Generate Shift Assignments:** For each employee with "submissionStatus": "Pending", suggest suitable shifts based on their availability, prioritizing the undersubscribed shifts identified in step 1.
  4. **Format Output:** Provide the suggested shift assignments in the following JSON format:

  \`\`\`json
  {
    "assignments": [
      {
        "_id": "[employeeAvailabilityId]",
        "employeeId": "[employeeId]",
        "shifts": [
          {
            "name": "[Shift Name]",
            "dayOfTheWeek": "[Day]", 
            "startTime": "[Start Time]",
            "endTime": "[End Time]"
          },
          // ... more shifts as needed
        ]
      },
      // ... more assignment objects as needed
    ]
  }
  \`\`\` 
  `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'system', content: prompt }],
            temperature: 1,
            max_tokens: 4096,
            response_format: {
                type: 'json_object'
            }
        });

        const suggestions = JSON.parse(response.choices[0].message.content);

        for (const assignment of suggestions.assignments) {
            await EmployeeAvailability.findOneAndUpdate(
                {
                    employeeId: assignment.employeeId,
                    weeklyScheduleId: weeklySchedule._id
                },
                {
                    $set: {
                        availabilities: assignment.shifts,
                        submissionStatus: 'Submitted' // Mark as submitted
                    }
                },
                { upsert: true } // Create a new document if it doesn't exist
            );

            Log.info(
                `Updated availability for employeeId: ${assignment.employeeId}`
            );
        }
    } catch (error) {
        console.error('Error using OpenAI API:', error);
        Log.error('Error using OpenAI API:', error);
    }

    const shifts = await getAllEmployeesAvailabilities(weeklySchedule._id);

    const company = await Business.findById(weeklySchedule.companyId).exec();

    const employees = await Employee.find({ companyId: company._id }).exec();

    const employeeDictionary = employees.reduce((acc, employee) => {
        acc[employee._id] = employee.name;
        return acc;
      }, {});
      
    console.log(employeeDictionary);

    const formattedShifts = shifts.map(shift => ({
        employeeName: employeeDictionary[shift.employeeId],
        availabilities: shift.availabilities
      }));


    

    const inbox = await getUserInbox(company.userId);
    if (inbox) {
        Log.info(
            `Adding message to inbox for Owner ${company.userId} of company ${company.name}`
        );

        const pendingEmployeesNames = await Promise.all(pendingAvailabilities.map(
            async (pendingAvailability) => {
                const employee = await Employee.findById(pendingAvailability.employeeId).exec();
                return employee.name;
            }
        ));

        if(pendingEmployeesNames.length>   0){
            const messageContent = `Following users have not submitted their availabilities and have been assigned the least subscribed shifts automatically:
            ${pendingEmployeesNames.join('\n')}
        `;

        await openai.beta.threads.messages.create(inbox.threadId, {
            role: 'assistant',
            content: messageContent
        });}

        await openai.beta.threads.messages.create(inbox.threadId, {
            role: 'assistant',
            content: `Here are the suggestions for the shifts starting on week ${weeklySchedule.startDate.toDateString()}:
                ${JSON.stringify(formattedShifts, null, 2)}
                `
        });

        weeklySchedule.status = 'Suggested';
        await weeklySchedule.save();       
    } else {
        Log.warn(`No inbox found for user ${company.userId}`);
    }
};

const availabilitiesCheck = async () => {
    try {
        Log.info("Checking availabilities for updates");
        
        // Using aggregation to compare 'lastChecked' with 'updated_at' field
        const availabilities = await EmployeeAvailability.aggregate([
            {
                $match: {
                    submissionStatus: 'Submitted',
                    $expr: { $lt: ["$lastChecked", "$updated_at"] }  // Compare fields within the document
                }
            }
        ]);

        const timeNow = new Date();
        for (const availability of availabilities) {
            const employee = await Employee.findById(availability.employeeId);

            if (!employee) {
                console.log(`Employee not found for availability ${availability._id}`);
                continue;
            }

            const weeklySchedule = await WeeklySchedule.findById(availability.weeklyScheduleId);

            if (!weeklySchedule) {
                console.log(`WeeklySchedule not found for availability ${availability._id}`);
                continue;
            }

            const userId = employee.userId.toString();
            const updatedOnBehalfOfUserId = availability.updated_on_behalf_of_user;

            if (userId.toString() !== updatedOnBehalfOfUserId.toString()) {
                // The availability was updated by someone else
                const inbox = await getUserInbox(userId);
                if (inbox) {
                    const message = `Your availability for the week starting ${weeklySchedule.startDate.toDateString()} has been updated. The shifts are:

                    ${JSON.stringify(availability.availabilities, null, 2)}`;

                    await openai.beta.threads.messages.create(inbox.threadId, {
                        role: 'assistant',
                        content: message
                    });

                    Log.info(`Message added to thread for user ${userId}`);
                } else {
                    Log.info(`No inbox found for user ${userId}`);
                }
            }
            const availabilityDoc = await EmployeeAvailability.findById(availability._id);

            if (!availabilityDoc) {
                console.log(`availabilityDoc not found: ${availability._id}`);
                continue;
            }

            availabilityDoc.lastChecked = timeNow;

            await availabilityDoc.save();
        }

        return availabilities;
    } catch (err) {
        console.error('Error in availabilitiesCheck:', err);
        throw err;
    }
};



module.exports = {
    checkSchedules,
    checkAvailabilities,
    arrangeShifts,
    availabilitiesCheck
};
