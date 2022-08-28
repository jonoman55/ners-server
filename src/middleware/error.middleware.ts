import { Request, Response, NextFunction } from "express";

import logger from "../utils/logger";

/**
 * Express Async Error Handler
 */
const asyncErrorHandler = (err: Error | null, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        const statusCode: number = res.statusCode ? res.statusCode : 500;
        res.status(statusCode).json({
            success: false,
            message: err?.message
        });
        logger.error(err?.message);
    } else {
        next();
    }
};

export { asyncErrorHandler };