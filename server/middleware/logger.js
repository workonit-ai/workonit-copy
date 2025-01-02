const ExpressWinston = require('express-winston')
const logger = require('../utilities/logger');

const loggerMiddleware = ExpressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
})

module.exports = loggerMiddleware
