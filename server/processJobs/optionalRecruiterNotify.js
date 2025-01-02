const { MongoClient, ObjectId } = require('mongodb');
const Log = require('../utilities/Log');
const Notification = require('../models/Notification');
const Assistant = require('../models/Assistant');
const { sendHTMLEmail } = require('./emailFunctions');
const { queryFunction } = require('../OauthConnections/TwitterJob');
var start = new Date();
config = require('../config');
uri = `${config.db.uri}`;
client = new MongoClient(uri);
const database = client.db(config.db.database);
const optional_recruiter = database.collection("optional_recruiter")
const jobs= database.collection("jobs")
const users= database.collection("users")
const getOptional_recruiter =  async () => { 
    const query = {
        created_at: {
            $gte: start
        }
    };
    const results = await optional_recruiter.find(query).toArray();
    Log.server(`Running cron job for optionalRecruiters notify $ ${results.length}`);
    start = new Date()
    
    return results;
}
const fullaplictiondata = async (optionalRecruiter)=>{
  
  try{
    const job = await jobs.findOne({_id: new ObjectId(optionalRecruiter.job_id), status:"Open"});
    if(!job){
        console.log(`Job ${optionalRecruiter.job_id} not found`);
        return null;
    }

    const user = await users.findOne({_id: new ObjectId(job.created_on_behalf_of_user)});
    var optionalRecruiterUser = await users.findOne({_id: new ObjectId(optionalRecruiter.usersCV_id)});
    if(!optionalRecruiterUser){
        const CV = await database.collection("cvs").findOne({_id: new ObjectId(optionalRecruiter.usersCV_id)});
        optionalRecruiterUser = await users.findOne({_id: new ObjectId(CV.created_on_behalf_of_user)});
    }
    if(!user){
        console.log(`User ${job.created_on_behalf_of_user} not found`);
        return null;
    }
    if(!optionalRecruiterUser){
        console.log(`optionalRecruiterUser ${optionalRecruiter.usersCV_id} not found`);
        return null;
    }
    return {job, jobOwner:user, optionalRecruiterUser}
    }catch(e){
        Log.error(e);
        return null;
    }
}
const eventsNotifyHandler = async (optionalRecruiter)=>{
    Log.server("Running cron job for optional Recruiters notify", optionalRecruiter);
    try{
        const data = await fullaplictiondata(optionalRecruiter);
        if(!data){
            return;
        }
        const {job, jobOwner, optionalRecruiterUser} = data;
    const Hari = await Assistant.findOne({name:"CARMIT"})
    const Notifi =  await new Notification({
        userId: optionalRecruiterUser._id,
        body: `${jobOwner.name} intrested to hire you for ${job.title} in ${job.location},
         \n${job.description}
         \n eduction:${job.education} 
         \n experience:${job.experience}        
        \n you can contact him on ${jobOwner.email}
        \n would you like me to help you apply or get the full Job description?`,
        title: `New optional recruiter for job ${job.title} in ${job.location} `,
        date: new Date(),
        assistantId:Hari?.assistant_id?Hari.assistant_id:"asst_VWyEupMWStD2v1YhjMHql5RS",
        seen:false
    })
    await Notifi.save();
    
      await sendHTMLEmail({
        sendTo:optionalRecruiterUser,
         headerText:`New Opportunity for ${job.title} `,
          sections:[{content:`<p style="font-size: 16px; color: #555; line-height: 1.5;">
        Great news! Someone is interested in you for the <strong>${job.title}</strong> position
      </p>`}],
      assistantName: "CARMIT"
    })
}catch(e){
   Log.error(e);
}
}
const checkOptional_recruiter= async ()=>{
    const events = await getOptional_recruiter();
    events.forEach(
        (event) => {
            eventsNotifyHandler(event)
        }
    )
}
module.exports = {
    queryFunction:getOptional_recruiter,
    handlerFunction:eventsNotifyHandler,
    name:'optional recruiter notifies'
}
