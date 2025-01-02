const { env } = require('../config');

function errorHandler(err, req, res, next) {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: env === 'development' ? err : undefined
        }
    });
}

module.exports = errorHandler
