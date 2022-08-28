import { RequestHandler, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { ServerSocket } from "../clients/socket";
import type { Users } from "../types";

/**
 * @description Ping Socket
 * @route /socket/ping
 * @method GET
 */
 const ping: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const isOnline = ServerSocket.instance.isOnline;
    res.status(200).json({
        success: true,
        message: `Socket ${isOnline ? 'is online' : 'is disconnected'}`
    });
});

/**
 * @description Socket Status
 * @route /socket/status
 * @method GET
 */
const status: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const users: Users = ServerSocket.instance.users;
    if (Object.values(users).length > 0) {
        res.status(200).json({
            success: true,
            message: 'Successfully Fetched Users List',
            users: users
        });
    } else {
        res.status(200).json({
            success: true,
            message: 'No Active Users',
        });
    }
});

export {
    ping,
    status,
};