const jwt = require('jsonwebtoken');
const config = require('../config');

let {
    UnauthorizedResponse
} = require('express-http-response');
const { catchAsync } = require('../utilities/catchAsync');

exports.appendUser = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token)
        return next(new UnauthorizedResponse('Please login'));

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
            return next(new UnauthorizedResponse('Token Expired! Please login.'));
        }

        req.user = decoded;
    });

    next();
});
