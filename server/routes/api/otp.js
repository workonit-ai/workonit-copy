let router = require("express").Router();
const config = require("../../config");
const jwt = require("jsonwebtoken");
let User = require("../../models/User");
let Otp = require("../../models/Otp");
let {
	OkResponse,
	BadRequestResponse,
	InternalServerErrorResponse,
} = require("express-http-response");
// let otpMiddleware = require("../../utilities/nodemailer");
let otpMiddleware = require("../../utilities/sendgrid");

router.post("/resend", async (req, res, next) => {
	const email = req.body.email;
	const user = User.findOne({ email: email });
	req.mailText = `Hi ${user.name},\n\nYour new otp is\n\n`;
	const otp = await Otp.findOne({ email: email });

	if (!otp) {
		await otpMiddleware.sendOTP(email, next);
	} else {
		await otp.deleteOne();
		await otpMiddleware.sendOTP(email, next);
	}

	return next(new OkResponse("Otp sent!"));
});

router.post("/verify", async (req, res, next) => {
	const type = req.query.type;
	console.log(req.params);

	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new BadRequestResponse("No such user exists"));
	}

	if (type == "resetpassword") {
		const token = jwt.sign(
			{
				userId: user._id.toString(),
				email: user.email,
			},
			config.jwt.secret,
			{
				expiresIn: "1h",
			}
		);

		await otpMiddleware.verifyOtp(req.body.otp, req.body.email, next);
		return next(
			new OkResponse({
				message: "Otp Verified! Enter new Password",
				token: token,
			})
		);
	} else {
		try {
			const user = await User.findOne({ email: req.body.email });
			if (!user) {
				return next(new BadRequestResponse("Invalid email"));
			}
			await otpMiddleware.verifyOtp(req.body.otp, req.body.email, next);
			user.otpVerified = true;
			await user.save();

			return next(new OkResponse("Otp verified. You can now signin"));
		} catch (error) {
			return next(new InternalServerErrorResponse(error));
		}
	}
});

module.exports = router;
