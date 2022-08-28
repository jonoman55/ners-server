import { RedisOptions } from "ioredis";

/**
 * Redis Config Options
 */
export const redisConfig: RedisOptions = {
    port: parseInt(process.env.REDIS_PORT as string, 10),
    host: process.env.REDIS_HOST as string,
};