require('dotenv').config(); // Load environment variables from .env file
const { MongoClient , ObjectId} = require('mongodb');
const { db_read } = require('./assistant/assistantFunctions/db_read');
const { sendEmail } = require('./utilities/sendgrid');
const { extractDbNameFromUri } = require('./assistant/utils/extractDbName');
const Log = require('./utilities/Log');

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

const dbName = extractDbNameFromUri(uri);
let client;
let isShuttingDown = false;

async function watchWeeklySchedule() {
  while (!isShuttingDown) {
    try {
      const client = await connectToMongoDB();
      const database = client.db(dbName);
      const weeklyScheduleCollection = database.collection("weeklyschedules");

      Log.info('Watching weekly schedule collection for new schedules');

      const changeStream = weeklyScheduleCollection.watch([{ $match: { operationType: 'insert' } }]);

      changeStream.on('change', async (change) => {
        Log.info(`New weekly schedule added: ${JSON.stringify(change.fullDocument)}`);
        await handleNewSchedule(change.fullDocument, client);
      });

      changeStream.on('error', (error) => {
        Log.error(`Error in change stream: ${error}`);
        throw error; // This will cause the function to retry
      });

      // Wait for the change stream to close
      await new Promise((resolve) => changeStream.on('close', resolve));
    } catch (error) {
      Log.error(`Error in watchWeeklySchedule: ${error.stack}`);
      console.error('Error in watchWeeklySchedule:', error);
      
      // Close the client on error to ensure a fresh connection on retry
      if (client) {
        await client.close();
        client = null;
      }

      // Wait for 5 seconds before trying to reconnect
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function insertRandomDocument(collection) {
  const randomDocument = {
    companyId: new ObjectId(),
    employeeId: new ObjectId(),
    weekStartDate: new Date(),
    status: 'Pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await collection.insertOne(randomDocument);
  Log.info(`Inserted random document: ${JSON.stringify(randomDocument, null, 2)}`);
  Log.info(`Insert result: ${JSON.stringify(result, null, 2)}`);
}

async function handleNewSchedule(schedule) {
  try {
    const employeeResult = await db_read({
      collection_name: 'employees',
      query: { _id: schedule.employeeId }
    });

    Log.info(`Employee result: ${JSON.stringify(employeeResult, null, 2)}`);

    if (employeeResult.status === 'success' && employeeResult.data.length > 0) {
      const employeeEmail = employeeResult.data[0].email;

      const email = {
        subject: 'New Weekly Schedule',
        text: `Your manager has initiated weekly schedule for the week starting from ${schedule.weekStartDate}. Make sure to set your availability before the date.`,
        to: employeeEmail,
        html: `<p>Your manager has initiated weekly schedule for the week starting from <strong>${schedule.weekStartDate}</strong>. Make sure to set your availability before the date.</p>`
      }
      await sendEmail(email.subject, email.text, email.html, email.to);

      Log.info(`Email sent to ${employeeEmail} for new schedule`);
    }
  } catch (error) {
    Log.error(`Error in handleNewSchedule: ${error}`);
  }
}

watchWeeklySchedule().catch(error => {
  Log.error(`Unhandled error in watchWeeklySchedule: ${error}`);
  process.exit(1);
});