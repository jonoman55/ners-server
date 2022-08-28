import * as dotenv from 'dotenv';

import { getEnvFilePath, isDev } from '../utils';

/**
 * Env Config File Location
 */
export const configFile: string = getEnvFilePath();

/**
 * Dotenv Config Options
 */
export const envOptions: dotenv.DotenvConfigOptions = {
    path: configFile,
    debug: isDev,
    override: false
};

/**
 * Loads .env file contents into process.env
 * @returns {dotenv.DotenvConfigOutput} A parsed key if successful or error key if an error occurred
 */
export const loadConfig = (): dotenv.DotenvConfigOutput => dotenv.config(envOptions);