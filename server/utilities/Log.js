const winston = require('winston');
const moment = require('moment-timezone');
const chalk = require('chalk');


const logger = winston.createLogger({
    level: 'debug',  // Include debug level logs
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => moment().tz('Asia/Jerusalem').format('YYYY-MM-DD HH:mm:ss')
        }),
        winston.format.printf(({ timestamp, level, message, metadata }) => {
            const metaString = metadata ? JSON.stringify(metadata) : '';
            switch (level) {
                case 'info':
                    return `${timestamp} ${level}: ${chalk.blue(message)} ${metaString}`;
                case 'warn':
                    return `${timestamp} ${level}: ${chalk.hex('#FFA500')(message)} ${metaString}`; // Orange
                case 'debug':
                    return `${timestamp} ${level}: ${chalk.black(message)} ${metaString}`;
                case 'error':
                    return `${timestamp} ${level}: ${chalk.bold.red(message)} ${metaString}`;
                default:
                    return `${timestamp} ${level}: ${message} ${metaString}`;
            }
        })
    ),
    transports: [
        new winston.transports.Console()  // Only console transport for stdout
    ]
});

class Log {
    static server(message) {
        logger.info(`[SERVER] ${message}`);
    }

    static info(message) {
        logger.info(`[INFO] ${message}`);
    }

    static warn(message, error) {
        const log = `[WARN] ${message}${error ? `:\n${error}` : ''}`;
        logger.warn(log);
    }

    static error(message, error) {
        const log = `[ERROR] ${message}`;
        const errorDetails = error 
            ? `\nMessage: ${error.message}\nStack: ${error.stack}` 
            : '';
        logger.error(`${log} ${errorDetails}`);
    }

    static debug(message) {
        logger.debug(`[DEBUG] ${message}`);
    }

    static async measure(fn, message) {
        const log = `[INFO] ${message}`;
        console.time(log);
        const res = await fn();
        console.timeEnd(log);
        return res;
    }

    static measureSync(fn, message) {
        const log = `[INFO] ${message}`;
        console.time(log);
        const res = fn();
        console.timeEnd(log);
        return res;
    }
}

module.exports = Log;
