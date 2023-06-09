import express from 'express';

import {
  createAccount, getAllAccounts, updateAccount, removeAccount,
} from '../controllers/accountController.js';
import { checkAuth } from '../Utils/passport.js'; // authenticate and get userID

const router = express.Router();
router.post('/create', checkAuth, createAccount);
router.get('/all', checkAuth, getAllAccounts);
router.put('/update/:accountId', checkAuth, updateAccount);
router.delete('/:accountId', checkAuth, removeAccount);

export default router;
