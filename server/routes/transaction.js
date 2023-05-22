import express from 'express';
import { addTransaction, getAllTransactions, getTransactionByType } from '../controllers/transactionController.js';

import { checkAuth } from '../Utils/passport.js'; // to get userId
import { io } from '../index.js';

const router = express.Router();
router.post('/create', checkAuth, (req, res) => addTransaction(req, res, io));
router.get('/byCategory', checkAuth, getTransactionByType);
router.get('/all', checkAuth, getAllTransactions);
export default router;
