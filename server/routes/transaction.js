import express from 'express';
import {
  addTransaction, getAllTransactions, getTransactionByType, removeTransaction,
} from '../controllers/transactionController.js';

import { checkAuth } from '../Utils/passport.js'; // to get userId

const router = express.Router();
router.post('/create', checkAuth, addTransaction);
router.get('/byCategory', checkAuth, getTransactionByType);
router.get('/all', checkAuth, getAllTransactions);
router.delete('/:transactionId', checkAuth, removeTransaction);
export default router;
