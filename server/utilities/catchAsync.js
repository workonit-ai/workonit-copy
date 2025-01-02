const { InternalServerErrorResponse } = require('express-http-response');
const config = require('../config');
const Log = require('./Log');

exports.catchAsync = fn =>
    async (req, res, next) => {
        try {
            return await fn(req, res, next);
        } catch (error) {
            Log.error(`Error in ${req.originalUrl} --- `, error);
            return next(
                new InternalServerErrorResponse(
                    config.env === 'production' ? 'Something went wrong' : error
                )
            );
        }
    };
