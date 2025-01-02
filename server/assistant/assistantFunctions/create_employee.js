const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../../models/User');
const { Employee, Business } = require('../../models/Business');
const Inbox = require('../../models/Inbox');
const AssistantModel = require('../../models/Assistant');
const { BadRequestResponse, OkResponse } = require('express-http-response');
const config = require('../../config');
const { MongoClient, ObjectId } = require('mongodb');
const Log = require('../../utilities/Log');
const { extractDbNameFromUri } = require('../utils/extractDbName');
const { sendEmail } = require('../../utilities/sendgrid');
const simaAssistantId = config.sima.assistant_id;
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: config.openAI.key
}).beta;

const uri = `${config.db.uri}`;
const dbName = extractDbNameFromUri(uri);
const client = new MongoClient(uri);

function generateRandomPassword(length = 12) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

async function createThread() {
    try {
        const thread = await openai.threads.create();
        return thread.id;
    } catch (error) {
        Log.error('Error creating thread:', error);
        throw error;
    }
}

async function runAssistant(assistantId, threadId, instructions) {
    try {
        const run = await openai.threads.runs.create(threadId, {
            assistant_id: assistantId,
            instructions: instructions
        });

        // Wait for the run to complete
        let runStatus = await openai.threads.runs.retrieve(threadId, run.id);
        while (runStatus.status !== 'completed') {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
            runStatus = await openai.threads.runs.retrieve(threadId, run.id);
        }

        // Retrieve the assistant's response
        const messages = await openai.threads.messages.list(threadId);
        return messages.data[0].content[0].text.value;
    } catch (error) {
        Log.error('Error running assistant:', error);
        throw error;
    }
}

async function create_employee(inputJson) {

    Log.info('Creating employee:', inputJson);
    if (!inputJson || typeof inputJson !== 'object') {
        throw new Error('Invalid input: JSON object is required.');
    }
    try {
    let userId;
    let employeeRole;
    const { name, email, role, companyName, companyId} = inputJson;
    var password = null;
    console.log(inputJson)

    if (inputJson.manualCall != true) {

        

        if (!name || !email || !role || !companyName) {
            throw new BadRequestResponse('All fields are required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestResponse('Invalid email format');
        }

        password = generateRandomPassword();

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throw new BadRequestResponse('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
  

        console.log('User created', user);
        const result = await user.save();
        console.log('User saved', result);

        userId = user._id;
        employeeRole = role;
    }


        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('companies');

        let business;
        if (inputJson.manualCall != true) {
            business = await collection.findOne({ name: companyName });
        } else {
            business = await collection.findOne({ _id:  new ObjectId(inputJson.companyId) });
            userId = inputJson.userId;
            employeeRole = inputJson.role;
        }

        console.log('Business found', business);
        if (!business) {
            throw new Error(`Business with name ${companyName} not found`);
        }
        
        const employee = new Employee({
            name: name,
            email: email,
            companyId: business._id,
            userId: new ObjectId(userId), // Convert userId to ObjectId
            shiftsScheduled: false,
            role: employeeRole
        });

        const savedEmployee = await employee.save();
        console.log('Employee created', savedEmployee);

        // Fetch SIMA's assistant ID dynamically
        console.log('SIMA Assistant ID fetched:', simaAssistantId);

        // Create a new thread
        const threadId = await createThread();
        console.log('Thread created:', threadId);

        // Create an inbox for the new employee with SIMA
        const inbox = await Inbox.create({
            userId: userId,
            assistantId: simaAssistantId,
            threadId: threadId,
            metadata: {
                employeeRole: role,
                companyName: companyName,
                companyId: business._id.toString(),
                userId: userId,
                employeeId: employee._id
            }
        });
        Log.info('Inbox created', inbox);

        // Create initial SIMA message
        const initialInstructions = `
      You are SIMA, the AI assistant for WorkOnIt. A new employee has just been added to the system. 
      Here's their information:
      - Name: ${name}
      - Role: ${role}
      - Company: ${companyName}
      - UserId: ${userId}
    ${   /*- EmployeeId: ${employee._id} */ ''}
      
      Please create a welcoming message for the employee. Confirm that you have their information and are ready to assist them with any questions about their role, the company, or scheduling shifts. Encourage them to ask you anything they need help with.
      ****NOTE: Do not include any information in the welcome message except the Name, role and company name****
    `;

        const simaResponse = await runAssistant(
            simaAssistantId,
            threadId,
            initialInstructions
        );
        console.log("SIMA's initial message created", simaResponse);

        const subject = 'Welcome to Our Platform';
        var text;
        var html;
        if(password){
            text = `Hello ${name},\n\nYou have been added to the organization ${companyName} as an ${role}. ${password ? ` Your temporary password is ${password}.` : ''} Please sign in and schedule your shifts. Our AI assistant SIMA is ready to help you get started.\n\nBest regards,\nThe WorkOnIt team`;
            html = `
          <p>Hello ${name},</p>
          <p>You have been added to the organization <strong>${companyName}</strong> as an <strong>${role}</strong>.</p>
          ${password ? `<p>Your temporary password is <strong>${password}</strong>.` : ''} Please sign in and schedule your shifts.</p>
          <p>Our AI assistant SIMA is ready to help you get started. You'll see a welcome message from SIMA when you log in.</p>
          <p>Best regards,<br>The WorkOnIt team</p>
        `;
        }
        else{
            text = `Hello ${name},\n\nYou have been succesfully added to the organization ${companyName} as an ${role}. Please sign in and schedule your shifts. Our AI assistant SIMA is ready to help you get started.\n\nBest regards,\nThe WorkOnIt team`;
            html = `
          <p>Hello ${name},</p>
          <p>You have been added to the organization <strong>${companyName}</strong> as an <strong>${role}</strong>.</p>
          <p>Please sign in and schedule your shifts.</p>
          <p>Our AI assistant SIMA is ready to help you get started. You'll see a welcome message from SIMA when you log in.</p>
          <p>Best regards,<br>The WorkOnIt team</p>
        `;
        }
        

        await sendEmail(subject, text, html, email);

        return {
            userId: userId,
            inboxId: inbox._id,
            message:
                'Employee created successfully with an inbox for SIMA communication. SIMA has prepared a welcome message.'
        };
    } catch (error) {
        throw new BadRequestResponse(error.message);
    } finally {
        await client.close();
    }
}

exports.create_employee = create_employee;

exports.create_employee_manual_call = async (req, res, next) => {
    const { companyId, companyName, userId, role, name , email } = req.body;

    try {
        // Check if inbox already exists between userId and assistantId

        const responseMessage = await create_employee({
            manualCall: true,
            companyId: companyId,
            userId: userId,
            companyName: companyName,
            role: req.body.role,
            name: req.body.name,
            email: req.body.email
        });

        return next(
            new OkResponse({
                message: responseMessage
            })
        );
    } catch (error) {
        Log.error('Error creating message:', error);
        return next(
            new BadRequestResponse(
                'There was an error processing your request. Please contact admin.'
            )
        );
    }
};
