import { RequestHandler, Request, Response } from "express";

import logger from "../utils/logger";
import { ENV, ENVIRONMENT, xForwardedForIp } from "../utils";
import { formatUptime } from "../helpers";

/**
 * @description Base API Route
 * @route /api
 * @method GET
 */
 const baseApiRoute: RequestHandler = (req: Request, res: Response) => {
    try {
        res.status(200).json({  
            success: true,
            message: 'NERS Server API'
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({  
            success: false,
            message: 'NERS Server API Error'
        });
    }
};

/**
 * @description API Routes
 * @route /api/routes
 * @method GET
 */
const routes: RequestHandler = (req: Request, res: Response) => {
    try {
        res.status(200).json({  
            success: true,
            message: 'NERS Server API Routes',
            routes: {
                baseURL: '/',
                api: {
                    env: '/api/env',
                    status: '/api/status',
                    ip: '/api/ip'
                },
                socket: {
                    ping: '/socket/ping',
                    status: '/socket/status'
                }
            }
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({  
            success: false,
            message: 'NERS Server Error'
        });
    }
};

/**
 * @description Running Environment
 * @route /api/env
 * @method GET
 */
const env: RequestHandler = (req: Request, res: Response) => {
    try {
        const env: ENV = ENVIRONMENT;
        res.status(200).json({  
            success: true,
            message: `Server is running in ${env}`,
            env: env
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: 'Environment Unavailable',
            env: 'N/A'
        });
    }
};

/**
 * @description API Status
 * @route /api/status
 * @method GET
 */
const status: RequestHandler = (req: Request, res: Response) => {
    try {
        const uptime: string = formatUptime(process.uptime());
        res.status(200).json({  
            success: true,
            message: 'NERS Server Status',
            status: 'UP',
            uptime: uptime,
            updated: `${new Date().toLocaleString('en-US', {
                timeZone: 'UTC',
                hour12: false,
                timeStyle: 'long',
                dateStyle: 'full'
            })}`
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({  
            success: true,
            message: 'NERS Server Status',
            status: 'DOWN',
            updated: `${new Date().toLocaleString('en-US', {
                timeZone: 'UTC',
                hour12: false,
                timeStyle: 'long',
                dateStyle: 'full'
            })}`
        });
    }
};

/**
 * @description Return Incoming Remote IP Address
 * @route /api/ip
 * @method GET
 */
const remoteIp: RequestHandler = (req: Request, res: Response) => {
    try {
        const ip: string = xForwardedForIp(req);
        res.status(200).json({
            success: true,
            message: 'Client IPv4 Address',
            ip: ip
        })
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to get client IP Address'
        });
    }
};

export {
    baseApiRoute,
    env,
    routes,
    remoteIp,
    status
};