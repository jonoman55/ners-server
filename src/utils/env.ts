/**
 * Node Environment Enum
 */
export enum ENV {
    PROD = 'production',
    DEV = 'development'
};

/**
 * Node Environment
 */
export const ENVIRONMENT: ENV =
    process.env.NODE_ENV === 'production'
        ? ENV.PROD
        : ENV.DEV; // Anything else is treated as development

/**
 * Is Server Running In Production
 */
export const isProd: boolean = ENVIRONMENT === ENV.PROD;

/**
 * Is Server Running In Development
 */
export const isDev: boolean = ENVIRONMENT === ENV.DEV;

/**
 * Get Environment Variable
 * @param {string} name Name of environment variable
 * @returns {string | undefined} The process.env value
 */
export const getEnv = (name: string): string | undefined => process.env[name];

/**
 * Get Environment Config File Path
 * @returns {string} .env file path
 */
export const getEnvFilePath = (): string => {
    if (process.env.NERS_SERVER_CFG_FILE) {
        return process.env.NERS_SERVER_CFG_FILE;
    }
    return '.env';
};