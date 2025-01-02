const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');
const { email: config } = require('../config');

let {
    UnauthorizedResponse,
    InternalServerErrorResponse
} = require('express-http-response');

exports.sendOTP = async (email, next) => {
    const otp = Math.floor(1000 + Math.random() * 9000);

    await Otp.findOneAndDelete({ email: email });

    const transporter = nodemailer.createTransport({
        service: config.service,
        auth: {
            user: config.user,
            pass: config.pass
        }
    });

    const mailText = `Your OTP is ${otp}\n\n`;

    const mailOptions = {
        from: config.user,
        to: email,
        subject: 'WorkOnIt OTP',
        text: mailText
    };

    transporter.sendMail(mailOptions, async (error) => {
        if (error) {
            return next(new InternalServerErrorResponse(error));
        }

        const otpObj = new Otp({
            email: email,
            otp: otp
        });

        try {
            await otpObj.save();
        } catch (error) {
            return next(new InternalServerErrorResponse(error));
        }
    });
};

exports.verifyOtp = async (otp, email, next) => {
    const otpObj = await Otp.findOne({ email: email, otp: otp });

    if (!otpObj) {
        return next(new UnauthorizedResponse('Invalid Otp', 401));
    }

    // next();
};
