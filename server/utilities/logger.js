const winston = require('winston')
const moment = require('moment-timezone');

const loggerOption = {
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new winston.transports.File({
            filename: 'logs/warn.log',
            level: 'warn',
        }),
        new winston.transports.File({
            filename: 'logs/http.log',
            level: 'http',
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => moment().tz('Asia/Jerusalem').format('YYYY-MM-DD HH:mm:ss')
        }),
        winston.format.metadata(),
        winston.format.prettyPrint(),
    ),
}

const logger = winston.createLogger(loggerOption)

module.exports = logger
