// DOCS : https://github.com/winstonjs/winston
import { createLogger, format, Logger, LoggerOptions, transports } from 'winston';
import { ConsoleTransportInstance, ConsoleTransportOptions, FileTransportInstance, FileTransportOptions } from 'winston/lib/winston/transports';
import DailyRotateFile, { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import { Format } from 'logForm';

import { isDev } from './env';

/**
 * Formatting Functions
 */
const { combine, colorize, label, printf, timestamp } = format;

/**
 * Logger Transports
 */
const { Console, File } = transports;

/**
 * Logs Directory
 */
const LOG_DIR: string = process.env.LOG_DIR || 'logs';

/**
 * Log Label
 */
const LOG_LABEL: string = 'ners-server';

/**
 * Log Level
 */
const LOG_LEVEL: string = 'debug';

/**
 * Log Timestamp Format
 */
const TIMESTAMP_FORMAT: string = 'YYYY-MM-DD HH:mm:ss:ms';

/**
 * Max Log File Size
 */
const MAXSIZE: number = 10485760; // 10MB

/**
 * Format Logger Output
 */
const logFormat: Format = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

/**
 * Format Logger Timestamp
 * @param {boolean} withTimestamp Include Custom Timestamp
 * @returns {Format} Timestamp Format
 */
const formatTimestamp = (withTimestamp: boolean): Format => {
    return timestamp({
        format: withTimestamp
            ? TIMESTAMP_FORMAT
            : undefined
    });
};

/**
 * Create Logger Format
 * @param {boolean} isDev Is Development
 * @param {boolean} withTimestamp Include Custom Timestamp
 * @returns {Format} Log Format
 */
const createFormat = (
    isDev: boolean = false,
    withTimestamp: boolean = false
): Format => {
    return isDev
        ? combine(
            label({ label: LOG_LABEL }),
            formatTimestamp(withTimestamp),
            colorize(),
            logFormat
        )
        : combine(
            label({ label: LOG_LABEL }),
            formatTimestamp(withTimestamp),
            logFormat
        );
};

/**
 * Daily Rotation Log File Options
 */
const rotationOptions: DailyRotateFileTransportOptions = {
    filename: `${LOG_DIR}/${LOG_LABEL}-%DATE%.log`,
    frequency: '24h',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '7d',
    handleExceptions: true,
    level: LOG_LEVEL
};

/**
 * Daily Rotation Log File
 */
const rotationTransport: DailyRotateFile = new DailyRotateFile(rotationOptions);

/**
 * Logger Types
 */
type LoggerTypes = {
    debug: FileTransportOptions;
    console: ConsoleTransportOptions;
};

/**
 * Logger Transport Types
 */
const loggerTypes: LoggerTypes = {
    debug: {
        level: LOG_LEVEL,
        filename: `${LOG_DIR}/debug.log`,
        handleExceptions: true,
        maxsize: MAXSIZE,
        maxFiles: 1
    },
    console: {
        level: LOG_LEVEL,
        handleExceptions: true,
        format: createFormat(isDev, true)
    }
};

/**
 * Console Logger
 */
const consoleLogger: ConsoleTransportInstance = new Console(loggerTypes.console);

/**
 * Logger Options
 */
const options: LoggerOptions = {
    level: LOG_LEVEL,
    format: createFormat(),
    defaultMeta: { service: LOG_LABEL },
    transports: [
        rotationTransport,
        consoleLogger,
    ],
    exitOnError: false, // do not exit on unhandled exceptions
};

/**
 * Logger
 */
const logger: Logger = createLogger(options);

// Initialize Logging
if (isDev) {
    /**
     * Debug File Logger - for dev
     */
    const debugLogger: FileTransportInstance = new File(loggerTypes.debug);
    logger.add(debugLogger);
    logger.info('Logging initialized at debug level');
} else {
    logger.info('Logging initialized successfully');
}

/* <--------------- Start of Logger Event Emitters ---------------> */
rotationTransport.on('new', (newFileName: string) => {
    logger.info('Attempting to create new daily log file');
    try {
        logger.info(`Successfully created new daily log file ${newFileName}`);
    } catch (error: any) {
        logger.error('Failed to create new daily log file');
        logger.error(error);
    }
});

rotationTransport.on('rotate', (oldFileName: string, newFileName: string) => {
    logger.info('Attempting to rotate daily log file');
    try {
        logger.info(`Successfully rotated ${oldFileName} to ${newFileName}`);
    } catch (error: any) {
        logger.error('Failed to rotate new daily log file');
        logger.error(error);
    }
});

rotationTransport.on('archive', (zipFilename: string) => {
    logger.info('Attempting to archive daily log files');
    try {
        logger.info(`Successfully archived daily log files to ${zipFilename}`);
    } catch (error: any) {
        logger.error(`Failed to archived daily log files: ${error}`);
    }
});

rotationTransport.on('logRemoved', (removedFilename: string) => {
    logger.info('Attempting to remove daily log file');
    try {
        logger.info(`Successfully removed daily log file ${removedFilename}`);
    } catch (error: any) {
        logger.error('Failed to remove daily log file');
        logger.error(error);
    }
});
/* <--------------- End of Logger Event Emitters ---------------> */

/**
 * stdout Logger
 */
export const stdoutLogger = console.log = (d: string): void => {
    process.stdout.write(d + '\n');
};

export default logger;
