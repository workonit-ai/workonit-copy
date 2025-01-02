const {checkSchedules} = require('./scheduleChecks')
const {availabilitiesCheck} = require('./scheduleChecks')

const cron = require('node-cron');



cron.schedule('*/1 * * * *', async () => { 
    console.log('Checking schedules...');
    await checkSchedules();
  });

  cron.schedule('*/1 * * * *', async () => { 
    console.log('Checking availabilities...');
    await availabilitiesCheck();
});