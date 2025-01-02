const TwitterJob = require('../OauthConnections/TwitterJob')
const Log = require('../utilities/Log')
const config = require('../config')
const ApplicationsNotify = require('./ApplicationsNotify')
const optionalRecruiter= require('./optionalRecruiterNotify')
// each job is exported as an Object with 3 parameters
// module.exports = {
//     queryFunction: the function to query the relevant "event" objects,
//     handlerFunction: that run on each "event" object,
//     name: the job name
// }
// the interval time is imported from the config
const jobRunner =  (Job, interval) =>{
    try{
        Log.server(`${Job.name} is Running`)
    setInterval(async ()=>{
        const result = await Job.queryFunction()
        result.forEach(element => {
            Job.handlerFunction(element)
         });
        },interval)
    }catch(err){
        Log.error(`${Job.name} had an error:`, err)
    }
    
}


const runTwitter = () => {
    Log.server('Twitter job is running')
    try{
        setInterval(() => {
            handlecomingtweets()
        }, );
    }catch(err){
        Log.error('Twitter job error', err)
    }
    
}
const runApplicationNotifire = () => {
    Log.server('Application notification job is running')
    try{
        setInterval(()=>{
            checkApplications()
        }, config.application_check_time)

    }
    catch(err){
        Log.error('Application notification job error', err)
    }
}
const runOptionalRecruiter = () => {
    Log.server('Optional recruiter job is running')
    try{
        setInterval(()=>{
            checkOptional_recruiter()
        }, config.optional_recruiter_check_time)
    }
    catch(err){
        Log.error('Optional recruiter job error', err)
    }
}
const runindexerJob = () => {
    Log.server('Indexer job is running')
    try{
        setInterval(()=>{
            IndexerJob()
                }, 10000)
    }
    catch(err){
        Log.error('Indexer job error', err)
    }
}
const runJobs = async () => {
    try{
        jobRunner(TwitterJob, config.application_check_time)
    jobRunner(ApplicationsNotify, config.application_check_time)
    jobRunner(optionalRecruiter,config.optional_recruiter_check_time )

    }catch(err){
        Log.error('Error running jobs', err)
    }
    
}
module.exports = {runJobs}