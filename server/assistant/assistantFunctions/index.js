const { create_job } = require('./job');
const { create_post } = require('./post');
const { db_read } = require('./db_read');
const { db_write } = require('./db_write');
const { db_update } = require('./db_update');
const { get_company_link } = require('./get_company_link');
const { get_system_context } = require('./get_system_context');
const {create_employee} = require('./create_employee');
const { send_email } = require('./send_email');
const scheduling  = require('./scheduling');
const { create_organization } = require('./create_company');
const {create_twitter_auth} = require('./create_twitter_auth')
const {tweet} =require('./tweet')
const {SAMI_get_context} = require('./SAMI_get_context');
const { SAMI_get_tweets } = require('./SAMI_get_tweets');
module.exports = {
    create_job: {
        function: create_job,
        required: [
            'role',
            'company',
            'location',
            'experience',
            'description'
        ]
    },
    create_post: {
        function: create_post,
        required: [
            'platform',
            'group',
            'jobID',
            'price'
        ]
    },
    db_read: {
        function: db_read,
        required: [
            'collection_name'
        ]
    },
    db_write: {
        function: db_write,
        required: [
            'collection_name',
            'document'
        ]
    },
    db_update: {
        function: db_update,
        required: [
            'collection_name',
            'documentId',
            'document'
        ]
    },
    get_company_link: {
        function: get_company_link,
        required: [
            'companyName',
            'userId',

        ]
    },
    get_system_context: {
        function: get_system_context,
        required: [
            'userID'
        ]
    },
    create_employee: {
        function: create_employee,
        required: [
            'name',
            'email',
            'role',
            'companyName'
        ]
    },
    send_email: {
        function: send_email,
        required: [
            'toAddress',
            'subject',
            'text',
            'html'
        ]
    },
    initiate_weekly_scheduling: {
        function: scheduling.initiate_weekly_scheduling,
        required: [
            'businessId',
            'weekStartDate'
        ]
    },
    submit_employee_availability: {
        function: scheduling.submit_employee_availability,
        required: [
            'employeeId',
            'weekStartDate',
        ]
    },

    get_system_context: {
        function: get_system_context,
        required: [
            'userID'
        ]
    },
    create_organization: {
        function: create_organization,
        required: [
            'name',
            'email'
        ]
    },
    create_twitter_auth:{
        function:create_twitter_auth,
        required:['user']
    },
    tweet:{
        function:tweet,
        required:[
            "userId",
            "text",
            "time_to_post"
          ]
    }, 
    SAMI_get_context:{
        function:SAMI_get_context,
        required:[
            
        ]
    }, 
    SAMI_get_tweets:{
        function:SAMI_get_tweets,
        required:[
            
        ]
    },
   

};
