let router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let User = require('../../models/User');
let auth = require('../auth');
let {
    OkResponse,
    BadRequestResponse,
    UnauthorizedResponse
} = require('express-http-response');
// let otpMiddleware = require('../../utilities/nodemailer');
let otpMiddleware = require("../../utilities/sendgrid");
const { catchAsync } = require('../../utilities/catchAsync');
const config = require("../../config");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/signup', async (req, res, next) => {
    let { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return next(new BadRequestResponse('All fields are required'));
    }
    if (!role) {
        role = 'user';
    }

    if (!emailRegex.test(email)) {
        return next(new BadRequestResponse('Invalid email format'));
    }
    if (password.length < 5) {
        return next(new BadRequestResponse('Password should be greater than 5 characters'));
    }

    const usr = await User.findOne({ email: email });
    if (usr) {
        return next(new BadRequestResponse('User already exists'), 401);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        role: role
    });
    try {
        const result = await user.save();
        console.log(result);

        return next(new OkResponse({ user: user.toAuthJSON() }));
    } catch (error) {
        return next(new BadRequestResponse(error), 501);
    }
});

router.post('/login', catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (
        !user ||
        !password ||
        !await bcrypt.compare(password, user.password)
    ) {
        return next(new BadRequestResponse('Invalid username or password', 401));
    }

    if (user.status === 'inactive') {
        return next(new BadRequestResponse('Your account is inactive, please contact admin', 401));
    }

    // TODO add password expiration check

    return next(new OkResponse({ user: user.toAuthJSON() }));
}));

router.post('/change-status', auth.appendUser, async (req, res, next) => {
    const user = await User.findById(req.body.id);
    if (!user) {
        return next(new BadRequestResponse('User not found'));
    }
    user.status = req.body.status;
    await user.save();
    return next(new OkResponse('Status changed successfully'));
});

router.post('/forgot', async (req, res, next) => {
    const email = req.body.email;

    const user = await User.findOne({ email: email });
    if (!user) {
        return next(new BadRequestResponse('User not found'));
    }

    await otpMiddleware.sendOTP(email, next);
    return next(new OkResponse('Enter the otp sent to your email'));
});

router.post('/change-password', async (req, res, next) => {
    try {
        const user = jwt.verify(req.body.token, config.jwt.secret);
        const newPassword = req.body.password;

        const usr = await User.findOne({ email: user.email });

        usr.password = await bcrypt.hash(newPassword, 10);
        await usr.save();

        return next(new OkResponse('Password changed!'));
    } catch (error) {
        return next(error);
    }
});

router.get('/all', auth.appendUser, async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new UnauthorizedResponse('Not authorized'));
    }

    const users = await User.find({ role: 'user' });
    return next(new OkResponse({ users: users }));
});

router.get('/get', auth.appendUser, async (req, res, next) => {
    const usr = await User.findOne({ _id: req.user.id });
    if (!usr) {
        return next(new UnauthorizedResponse('Please Login'));
    }
    return next(
        new OkResponse({
            user: {
                name: usr.name,
                email: usr.email,
                role: usr.role.toLowerCase()
            }
        })
    );
});

router.delete('/delete/:id', auth.appendUser, async (req, res, next) => {
    console.log(req.body);
    const user = await User.findById(req.params.id);
    console.log(user);
    if (!user) {
        return next(new BadRequestResponse('User not found'));
    }
    await user.remove();
    return next(new OkResponse('User deleted successfully'));
});

module.exports = router;
