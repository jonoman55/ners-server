// DOCS : https://github.com/expressjs/cors
import cors, { CorsOptions, CorsRequest } from "cors";

/**
 * CORS Options
 */
const corsOptions: CorsOptions = {
    origin: '*',
};

/**
 * CORS Middleware
 */
const corsMiddleware = cors<CorsRequest>(corsOptions);

export default corsMiddleware;