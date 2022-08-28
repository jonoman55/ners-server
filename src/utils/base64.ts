/**
 * Decode a string from base64
 * @param {string} s Input string
 * @returns {string} Decoded string
 */
export const decode = (s: string): string => Buffer.from(s, 'base64').toString();

/**
 * Encode a string to base64
 * @param {string} b Input string
 * @returns {string} Decoded string
 */
 export const encode = (b: string): string => Buffer.from(b).toString('base64');