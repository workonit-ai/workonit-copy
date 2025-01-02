'use strict'

const config = require('config')

if (!config.has('env')) {
    throw new Error('Config is not set!');
}

module.exports = {
    env: config.get('env'),

    app: {
        name: config.get('app.name'),
        version: config.get('app.version')
    },
    server: {
        port: config.get('server.port'),
        host: config.get('server.host'),
        corsOrigins: config.get('server.corsOrigins'),
        timeout: config.get('server.timeout')
    },
    db: {
        uri: config.get('db.uri')
    },

    jwt: {
        secret: config.get('jwt.secret'),
        expiresIn: config.get('jwt.expiresIn'),
        cookie: config.get('jwt.cookie')
    },

    openAI: {
        key: config.get('openAI.key')
    },

    email: {
        service: config.get('email.service'),
        user: config.get('email.user'),
        pass: config.get('email.pass')
    },

    crypto: {
        key: config.get('crypto.key'),
        iv: config.get('crypto.iv')
    },

    environmentUrls: {
        frontend_url: config.get('environmentUrls.frontend_url')
    },
  
    sendgrid: {
        key: config.get('sendgrid.key'),
        email: config.get('sendgrid.email')
    },

    sima: {
        assistant_id: config.get('sima.assistant_id')
    },
    twitter:{
        callback: process.env.TWITTER_CALLBACK_URL,
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        Social_post_time: 1000*5
        
        

    },
    aws:{
        accessKeyId: config.get('aws.accessKeyId'),
        secretAccessKey: config.get('aws.secretAccessKey'),
        s3Bucket: config.get('aws.s3Bucket')
    },
    application_check_time:1000*5,
    optional_recruiter_check_time:1000*5
}   
