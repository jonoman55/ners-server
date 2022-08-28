// DOCS : https://github.com/expressjs/morgan
import morgan, { StreamOptions } from "morgan";

import { isDev, isProd } from "../utils";
import logger from "../utils/logger";

/**
 * Morgan HTTP Logger Stream Options
 */
const streamOptions: StreamOptions = {
    write: (message: string) => {
        logger.http(message.replace(/\n$/, ''));
    }
};

/**
 * Morgan HTTP Logging Middleware
 */
const morganMiddleware = morgan(
    isDev ? 'tiny' : 'combine', {
    stream: streamOptions,
    skip: (): boolean => isProd
});

export default morganMiddleware;