import express, { Router } from 'express';
import { RequestHandler, Request, Response } from "express";

import logger from '../utils/logger';

/**
 * @description Base Route
 * @route /
 * @method GET
 */
const baseRoute: RequestHandler = (req: Request, res: Response) => {
    try {
        res.status(200).json({  
            success: true,
            message: 'Node Express Redis Socket (NERS) Server'
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({  
            success: false,
            message: 'NERS Server Error'
        });
    }
};

const router: Router = express.Router();

router.get('/', baseRoute);

export default router;