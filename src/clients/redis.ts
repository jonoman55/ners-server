// DOCS : https://github.com/luin/ioredis
import Redis, { RedisOptions } from "ioredis";

import logger from "../utils/logger";
import { redisConfig } from "../config/redis.config";

/**
 * Redis Client
 */
const redisClient: Redis = new Redis(redisConfig);

/**
 * Redis SetEx Interval (24 Hours)
 */
export const SETEX_INTERVAL: number = 86400; // 24 hours

/**
 * Redis Database Number
 */
export const REDIS_DB_NUM: number = parseInt(process.env.REDIS_DB_NUM as string, 10);

/**
 * Redis Channels
 */
export enum CHANNELS {
    MAIN = 'etfmm',
    REPLY = 'etfmm:reply',
    REQUEST = 'etfmm:request'
};

/* <--------------- Start of Redis Event Emitters ---------------> */
redisClient.on('wait', () => {
    logger.info('Redis is waiting...');
});

redisClient.on('reconnecting', () => {
    logger.info('Redis is reconnecting...');
});

redisClient.on('connecting', () => {
    logger.info('Redis is connecting...');
});

redisClient.on('connect', () => {
    logger.info('Redis is attempting to connect');
});

redisClient.on('ready', () => {
    if (redisClient.status === 'ready') {
        logger.info(
            `Redis is now connected on ${redisClient.options.host}:${redisClient.options.port}`
        );
    }
});

redisClient.on('close', () => {
    logger.info('Redis connection is closed');
});

redisClient.on('end', () => {
    logger.info('Redis connection has ended');
});

redisClient.on('error', (error: Error | null | undefined) => {
    if (error) {
        logger.error(error?.message);
    }
});
/* <--------------- End of Redis Event Emitters ---------------> */

/**
 * Connect Redis
 */
export const connectRedis = async (): Promise<void> => {
    try {
        if (
            redisClient.status !== 'connecting' &&
            redisClient.status !== 'connect' &&
            redisClient.status !== 'ready'
        ) {
           await redisClient.connect();
        }
    } catch (error: any) {
        logger.error(error);
    }
};

/**
 * Redis Subscriber Client with Options
 * @param {RedisOptions} options Redis Options
 * @returns Duplicated Redis Client
 */
export const subscriber = (options: RedisOptions): Redis => redisClient.duplicate(options);

/**
 * Create Redis Publisher Client with Options
 * @param {RedisOptions} options Redis Options
 * @returns Duplicated Redis Client
 */
export const publisher = (options: RedisOptions): Redis => redisClient.duplicate(options);

export default redisClient;