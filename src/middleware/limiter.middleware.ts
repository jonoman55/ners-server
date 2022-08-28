// DOCS : https://github.com/nfriedly/express-rate-limit
import { Request, Response } from "express";
import { Options, rateLimit, RateLimitExceededEventHandler, RateLimitRequestHandler } from "express-rate-limit";

/**
 * Rate Limit Exceeded Handler
 */
const limitHandler: RateLimitExceededEventHandler = (req: Request, res: Response) => {
    return res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again after 5 minutes'
    });
};

/**
 * Rate Limit Options
 */
const limitOptions: Partial<Options> = {
    windowMs: 5 * 60 * 1000, // 5 min
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,  // return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: limitHandler // rate limit exceeded handler
};

/**
 * Rate Limit Middleware
 */
const limiter: RateLimitRequestHandler = rateLimit(limitOptions);

export { limiter };