const { MongoClient, ObjectId } = require('mongodb');
const Log = require('../utilities/Log');
const Notification = require('../models/Notification');
const Assistant = require('../models/Assistant');
const { sendHTMLEmail } = require('./emailFunctions');
const { queryFunction, handlerFunction } = require('./optionalRecruiterNotify');
var start = new Date();
config = require('../config');
uri = `${config.db.uri}`;
client = new MongoClient(uri);
const database = client.db(config.db.database);
const applications = database.collection("applications")
const jobs= database.collection("jobs")
const users= database.collection("users")
const getApplications =  async () => { 
    const query = {
        seen:false
    };
    const results = await applications.find(query).toArray();
    return results;
}
const fullaplictiondata = async (application)=>{
  console.log("checking application data for ", application)
  try{
    const job = await jobs.findOne({_id: new ObjectId(application.job_id), status:"Open"});
    if(!job){
        console.log(`Job ${application.job_id} not found`);
        return null;
    }

    const user = await users.findOne({_id: new ObjectId(job.created_on_behalf_of_user)});
    var applicationUser = await users.findOne({_id:application.created_on_behalf_of_user});
    if(!applicationUser){
      applicationUser = await users.findOne({_id:new ObjectId(application.created_on_behalf_of_user)});
    }
    if(!user){
        console.log(`User ${job.created_on_behalf_of_user} not found`);
        return null;
    }
    if(!applicationUser){
        console.log(`User ${application.created_on_behalf_of_user} not found`);
        return null;
    }
    return {job, jobOwner:user, applicationUser}
    }catch(e){
        Log.error(e);
        return null;
    }
}
const applicationsNotifyHandler = async (application)=>{
    Log.server("Running cron job for applications notify", application);
    try{
        const data = await fullaplictiondata(application);
        if(!data){
            return;
        }
        const {job, jobOwner, applicationUser} = data;
    const Hari = await Assistant.findOne({name:"Hari"})
    const Notifi =  await new Notification({
        userId: jobOwner._id,

        body: `New application for job ${job.title} in ${job.location} was assigned by ${applicationUser.name}, you can contact him on ${applicationUser.email}`,
        title: `New application for job ${job.title} in ${job.location} `,
        date: new Date(),
        assistantId:Hari?.assistant_id?Hari.assistant_id:"asst_ZTrRqLSJhkMyaksdB1ZS2MqI",
        seen:false
    })
    await Notifi.save();
    await applications.updateOne({_id:application._id}, {$set:{seen:true}}, {upsert:true})
    await sendHTMLEmail({
        sendTo:jobOwner,
        headerText:`New application for job ${job.title} in ${job.location}`,
        sections:[
            {content:`<p style="font-size: 16px; color: #555; line-height: 1.5;">
             Great news! Someone has expressed interest in the job you posted:
            <strong>${job.title}</strong>
            </p>`}
        ],
        assistantName: 'hari'
    })
}catch(e){
   Log.error(e);
}
}
const checkApplications = async ()=>{
    const applications = await getApplications();
    applications.forEach(
        (application) => {
            applicationsNotifyHandler(application)
        }
    )
}
module.exports = {
    queryFunction:getApplications,
    handlerFunction:applicationsNotifyHandler,
    name: 'Applications notify'
}
