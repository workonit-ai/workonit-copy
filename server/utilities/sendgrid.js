const Otp = require('../models/Otp');
const sgMail = require('@sendgrid/mail');
const { sendgrid: config } = require('../config');
const Log = require('./Log');

let {
    UnauthorizedResponse,
    InternalServerErrorResponse
} = require('express-http-response');


sgMail.setApiKey(config.key);

exports.sendOTP = async (email, next) => {
    const otp = Math.floor(1000 + Math.random() * 9000);

    await Otp.findOneAndDelete({ email: email });

    // Log.info(`Sending OTP to : ${email} from: ${config?.email}`);
    const msg = {
        to: email,
        from: config.email, 
        subject: 'WorkOnIt OTP',
        text: `Your OTP is ${otp}\n\n`,
        html: `<strong>Your OTP is ${otp}</strong>`,
    };

    try {
        await sgMail.send(msg);
        
        const otpObj = new Otp({
            email: email,
            otp: otp
        });

        await otpObj.save();
    } catch (error) {
        console.error(error);
        
        if (error.response) {
            console.error(error.response.body);
        }
        
        return next(new InternalServerErrorResponse('Failed to send OTP'));
    }
};

exports.sendEmail = async (subject , text, html, to) => {
    const msg = {
        to: to,
        from: config.email,
        subject: subject,
        text: text,
        html: html,
    };

    Log.info(`Sending Email to : ${to} from: ${config?.email} with subject: ${subject}`);
    try {
        await sgMail.send(msg);
        Log.info(`Email sent `);
    } catch (error) {
        // console.error(error);
        Log.error(`Error Sending email ${error}`)
        if (error.response) {
            console.error(error.response.body);
        }
        
        throw new InternalServerErrorResponse('Failed to send email');
    }
};

exports.verifyOtp = async (otp, email, next) => {
    const otpObj = await Otp.findOne({ email: email, otp: otp });

    if (!otpObj) {
        return next(new UnauthorizedResponse('Invalid OTP', 401));
    }

    await Otp.findOneAndDelete({ email: email, otp: otp });

    // next();
};