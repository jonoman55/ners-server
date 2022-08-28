import express, { Router } from 'express';

import { status, ping } from '../controllers/socket.controller';

const router: Router = express.Router();

router.get('/ping', ping);
router.get('/status', status);

export default router;