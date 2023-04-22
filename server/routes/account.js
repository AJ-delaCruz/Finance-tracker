import express from 'express';

import { createAccount } from '../controllers/accountController.js';

const router = express.Router();
router.post('/create', createAccount);

export default router;
