import express, { Application } from 'express';
import http, { createServer } from 'http';
import { mw } from 'request-ip';

import { loadConfig } from './config/env.config';

loadConfig();

import logger from './utils/logger';
import { ENVIRONMENT } from './utils/env';
import { connectRedis } from './clients/redis';
import { ServerSocket } from './clients/socket';

import corsMiddleware from './middleware/cors.middleware';
import morganMiddleware from './middleware/morgan.middleware';
import { asyncErrorHandler } from './middleware/error.middleware';

import baseRoute from './routes';
import apiRoutes from './routes/api';
import socketRoutes from './routes/socket';

logger.info('Initializing Express Server');

async function bootstrap(): Promise<Application> {
    const app: Application = express();

    const server: http.Server = createServer(app);

    new ServerSocket(server);

    connectRedis();

    app.set('trust proxy', true);
    app.use(morganMiddleware);
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(corsMiddleware);
    app.use(mw());

    app.use('/', baseRoute);
    app.use('/api', apiRoutes);
    app.use('/socket', socketRoutes);

    app.use(asyncErrorHandler);

    const HOST: string = process.env.HOST as string;
    const PORT: number = parseInt(process.env.PORT as string, 10);

    server.listen(PORT, () => {
        logger.info(`Server is now running on ${HOST}:${PORT}`);
        logger.info(`Server is running in ${ENVIRONMENT}`);
    });

    return app;
};

bootstrap().then(() => {
    logger.info(`Express Server started successfully`);
}).catch((error: any) => {
    logger.error(error);
});