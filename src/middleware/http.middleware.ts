import { RequestHandler, Request, Response, NextFunction } from "express";

import logger from "../utils/logger";

const httpLogger: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const method: string = req.method;
    const url: string = req.url;
    const ip: string | undefined = req.socket.remoteAddress;
    const statusCode: number | undefined = req.statusCode;

    logger.http(`METHOD [${method}] - URL: [${url}] - IP: [${ip}]`);

    res.on('finish', () => {
        logger.http(`METHOD [${method}] - URL: [${url}] - STATUS: [${statusCode}] - IP: [${ip}]`);
    });

    next();
};

const httpHeaderOptions: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        res.status(200).json({});
    }

    next();
};

export {
    httpLogger,
    httpHeaderOptions
};