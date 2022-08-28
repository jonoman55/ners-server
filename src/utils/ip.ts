import { Request } from "express";
import { getClientIp } from "request-ip";
import ipaddr from "ipaddr.js";
import net from "net";

/**
 * Get The First X-Forwarded-For IP or Client IP Address
 * @param {Request} req Express Request
 * @returns {string} IPv4 Address
 */
const xForwardedForIp = (req: Request): string => {
    const headerName: string = 'X-Forwarded-For';
    const headerNameLowerCase: string = headerName.toLowerCase();
    if (req.headers[headerName]?.toString().includes(',')) {
        return req.headers[headerName]?.toString().split(',')[0] as string;
    } else if (req.headers[headerNameLowerCase]?.toString().includes(',')) {
        return req.headers[headerNameLowerCase]?.toString().split(',')[0] as string;
    } else {
        return clientIpV4(req);
    }
};

/**
 * Convert a Client IP Address to IPv4
 * @param {Request} req Express Request
 * @returns {string} IPv4 Address
 */
const clientIpV4 = (req: Request): string => {
    const ip: string = getClientIp(req) as string;
    return ipaddr.isValid(ip) ? ipaddr.process(ip).toString() : ip;
};

/**
 * Convert a IP Address to IPv4
 * @param {string} ip IP Address
 * @returns {string} IPv4 Address
 */
const toIpV4 = (ip: string): string => {
    return ipaddr.isValid(ip) ? ipaddr.process(ip).toString() : ip;
};

/**
 * Check if a IP Address is a valid IP
 * @param {string} ip IP Address
 * @returns {boolean} true or false
 */
const isValidIp = (ip: string): boolean => {
    return ipaddr.isValid(ip);
};

/**
 * Check if a IP Address is a IPv4 Address
 * @param {string} ip IP Address
 * @returns {boolean} true or false
 */
const isValidIpV4 = (ip: string): boolean => {
    return net.isIPv4(ip);
};

export {
    clientIpV4,
    isValidIp,
    isValidIpV4,
    toIpV4,
    xForwardedForIp,
};