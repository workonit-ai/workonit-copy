
const config = {
    env: process.env.NODE_ENV || 'production',

    app: {
        name: 'workonit-ai',
        version: '1.2.0-beta'
    },
    server: {
        port: 8000,
        host: '',
        corsOrigins: [''],
        timeout: 60000
    },
    db: {
        uri: process.env.MONGODB_URI
    },
    aws:{
        s3Bucket:process.env.AWS_S3_BUCKET,
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
        
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true
        }
    },

    openAI: {
        key: process.env.OPENAI_KEY
    },

    email: {
        service: 'gmail',
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },

    crypto: {
        key: process.env.CRYPTO_KEY,
        iv: process.env.CRYPTO_IV
    },

    environmentUrls: {
        frontend_url: process.env.FRONTEND_URL
    },
    sendgrid: {
        key: process.env.SENDGRID_KEY,
        email: process.env.SENDGRID_EMAIL
    },

    sima: {
        assistant_id: process.env.SIMA_ASSISTANT_ID
    },
    twitter:{
        callback: process.env.TWITTER_CALLBACK,
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        Social_post_time: 1000*30
    }
}

module.exports = config
