import express from 'express';
import {
  createBill, getAllBills, updateBillPayment, deleteBill,
} from '../controllers/billController.js';
import { checkAuth } from '../Utils/passport.js';

const router = express.Router();

router.post('/create', checkAuth, createBill);
router.get('/all', checkAuth, getAllBills);
router.put('/:billId/pay', checkAuth, updateBillPayment);
router.delete('/:billId', checkAuth, deleteBill);

export default router;
