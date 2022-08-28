import express, { Router } from 'express';

import { baseApiRoute, routes, env, status, remoteIp } from '../controllers/api.controller';

const router: Router = express.Router();

router.get('/', baseApiRoute);
router.get('/routes', routes);
router.get('/env', env);
router.get('/status', status);
router.get('/ip', remoteIp);

export default router;