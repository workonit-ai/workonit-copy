const { WeeklySchedule, EmployeeAvailability,getPendingEmployeesAvailibilities } = require('../../models/WeeklySchedule');
const { Employee } = require('../../models/Business');
const { Shift } = require('../../models/Business');
const { Business } = require('../../models/Business');
const Log = require('../../utilities/Log');
const mongoose = require('mongoose');
const { getUserInbox } = require('../utils/getUserInbox');
const Assistant = require('../Assistant');
const { sendEmail } = require('../../utilities/sendgrid');
const config = require('../../config');
const cron = require('node-cron');
const openai = require('../utils/openaiInstance');
const { User } = require('../../models/User'); 
const {getNextCheckDate} = require('../../utilities/formatDate');
// const OpenAI = require('openai');
// const openai = new OpenAI({
//     apiKey: config.openAI.key
// }).beta;
exports.initiate_weekly_scheduling = async (args) => {
    const {
        companyId,
        weekStartDate,
        checkInterval,
        availabilitySubmissionDeadline,
        nextScheduleStartDate,
        nextScheduleInitiationDate,
    } = args;

    // ... input validation ...

    try {
        const businessObjectId = new mongoose.Types.ObjectId(companyId);
        const employees = await Employee.find({ companyId: businessObjectId });

        if (employees.length === 0) {
            Log.info(`No employees found for business ${companyId}`);
            return {
                status: 'success',
                message: 'No employees found for this business',
            };
        }
        const nextScheduleStart = nextScheduleStartDate || new Date(weekStartDate);
        nextScheduleStart.setDate(
            nextScheduleStart.getDate() + 7
        );

        const nextScheduleInitiationDate = new Date(
            nextScheduleStart
        );
        nextScheduleInitiationDate.setDate(
            nextScheduleInitiationDate.getDate() - 2
        );

        

        const weeklySchedule = await WeeklySchedule.create({
            companyId: companyId,
            startDate: new Date(weekStartDate),
            endDate: new Date(
                new Date(weekStartDate).setDate(
                    new Date(weekStartDate).getDate() + 7
                )
            ),
            nextScheduleStart: nextScheduleStart,
            nextScheduleInitiationDate: nextScheduleInitiationDate,
            availabilitySubmissionDeadline: new Date(
                availabilitySubmissionDeadline ? availabilitySubmissionDeadline : weekStartDate.setDate(weekStartDate.getDate() - 1)            // If there is no submission deadline by default assume that the submission is one day before
            ),
            checkInterval: checkInterval,
            nextCheck: getNextCheckDate(checkInterval),
        });

        Log.info(
            `Created weekly schedule for business ${companyId}`
        );

        await this.createEmployeeAvailabilityDocuments(
            weeklySchedule._id,
            employees
        );

        // Trigger the post-scheduling tasks asynchronously
        // ... code for scheduling automated checkins ...
        setImmediate(() =>
            this.processPostSchedulingTasks(
                weeklySchedule,
                employees
            )
        );

        return {
            status: 'success',
            message: `Initiated scheduling for ${employees.length} employees.`,
            data: {
                weekStartDate,
                employeesScheduled: employees.length,
            },
        };
    } catch (error) {
        // ... error handling ...
    }
};

exports.createEmployeeAvailabilityDocuments = async (
    weeklyScheduleId,
    employees
) => {
    console.log('employees', employees);
    console.log('weeklyScheduleId', weeklyScheduleId);
    try {
        await Promise.all(
            employees.map(async (employee) => {
                
                const availability =
                    await EmployeeAvailability.create({
                        employeeId: new mongoose.Types.ObjectId(employee._id),
                        weeklyScheduleId: weeklyScheduleId,
                    });
                Log.info(
                    `Created availability document for ${employee._id}`
                );
                return availability;
            })
        );
    } catch (error) {
        Log.error(
            'Error in createEmployeeAvailabilityDocuments:',
            error
        );
    }
};

exports.processPostSchedulingTasks = async (weeklySchedules, employees) => {
    try {
        for (let i = 0; i < employees.length; i++) {
            const employee = employees[i];
            const schedule = weeklySchedules;

            await sendEmail(
                'Weekly Schedule Initiated',
                `Your weekly schedule for the week starting ${schedule.startDate} has been initiated. Please submit your availability.`,
                `<p>Your weekly schedule for the week starting ${schedule.endDate} has been initiated. Please submit your availability.</p>`,
                employee.email
            );
            if (employee.userId) {
                const inbox = await getUserInbox(employee.userId);
                if (inbox) {
                    Log.info(
                        `Adding message to inbox for employee ${employee._id}`
                    );
                    await openai.threads.messages.create(inbox.threadId, {
                        role: 'assistant',
                        content: `Your weekly schedule for the week starting ${schedule.weekStartDate} has been initiated. Please submit your availability.`
                    });
                } else {
                    Log.warn(`No inbox found for employee ${employee._id}`);
                }
            } else {
                Log.warn(`No userId found for employee ${employee._id}`);
            }
        }
        Log.info('Completed post-scheduling tasks');
    } catch (error) {
        Log.error('Error in processPostSchedulingTasks:', error);
    }
};

// exports.submit_employee_availability = async (args) => {
//     const { employeeId, weekStartDate, shifts } = args;

//     if (!employeeId || !weekStartDate || !shifts || !Array.isArray(shifts)) {
//         throw new Error(
//             'employeeId, weekStartDate, and shifts array are required'
//         );
//     }

//     console.log('Week startDate is', weekStartDate);
//     console.log('Date(weekStartDate)', new Date(weekStartDate));

//     try {
//         // Find the weekly schedule for the employee
//         const weeklySchedule = await WeeklySchedule.findOne({
//             employeeId,
//             weekStartDate: new Date(weekStartDate)
//         });

//         if (!weeklySchedule) {
//             return {
//                 status: 'error',
//                 message: 'Weekly schedule not found for the employee and week'
//             };
//         }

//         // Create shift documents and add them to the weekly schedule
//         const createdShifts = await Promise.all(
//             shifts.map(async (shiftData) => {
//                 const newShift = new Shift({
//                     weeklyScheduleId: weeklySchedule._id,
//                     companyId: weeklySchedule.companyId,
//                     employeeId,
//                     startTime: new Date(shiftData.startTime),
//                     endTime: new Date(shiftData.endTime),
//                     notes: shiftData.notes || ''
//                 });
//                 await newShift.save();
//                 return newShift;
//             })
//         );

//         // Update the weekly schedule with the new shifts
//         weeklySchedule.shifts = createdShifts.map((shift) => shift._id);
//         weeklySchedule.status = 'Submitted';
//         await weeklySchedule.save();

//         Log.info(
//             `Submitted ${createdShifts.length} shifts for employee ${employeeId} for week starting ${weekStartDate}`
//         );

//         return {
//             status: 'success',
//             message: `Submitted ${createdShifts.length} shifts for the week.`,
//             data: {
//                 weekStartDate,
//                 shiftsSubmitted: createdShifts.length
//             }
//         };
//     } catch (error) {
//         Log.error('Error in submit_employee_availability:', error);
//         return {
//             status: 'error',
//             message: 'Failed to submit employee shifts',
//             error: error.message
//         };
//     }
// };

exports.submit_employee_availability = async (args) => {
    const { employeeId, weekStartDate, availabilities, companyId } = args; // Include companyId in the arguments

    if (!employeeId || !weekStartDate || !availabilities || !Array.isArray(availabilities) || !companyId) {
        throw new Error('employeeId, companyId, weekStartDate, and availabilities array are required');
    }

    try {
        // 1. Find the WeeklySchedule document using companyId and weekStartDate
        const weeklySchedule = await WeeklySchedule.findOne({
            companyId, 
            // startDate: { $lte: new Date(weekStartDate) }, // Assuming weekStartDate could be any day within the week 
            // endDate: { $gt: new Date(weekStartDate) }   
            // status : {$eq : "Initiated"}
        });




        if (!weeklySchedule) {
            return {
                status: 'error',
                message: 'Weekly schedule not found for the business and week'
            };
        }

        // 2. Find and update the EmployeeAvailability document
        const availabilityDoc = await EmployeeAvailability.findOneAndUpdate(
            {
                employeeId: employeeId,
                weeklyScheduleId: weeklySchedule._id.toString() 
            },
            {
                $set: {
                    availabilities: availabilities, 
                    submissionStatus: 'Submitted'  
                }
            },
            { new: true } 
        );

        if (!availabilityDoc) {
            return { status: 'error', message: 'Could not find availability document for this employee and week.' };
        }

        return { status: 'success', message: 'Availability submitted successfully!' };

    } catch (error) {
        Log.error('Error in submit_employee_availability:', error);
        return {
            status: 'error',
            message: 'Failed to submit employee availability',
            error: error.message
        };
    }
};