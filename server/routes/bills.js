import express from 'express';
import {
  createBill, getAllBills, updateBillPayment, deleteBill, updateBill,
} from '../controllers/billController.js';
import { checkAuth } from '../Utils/passport.js';

const router = express.Router();

router.post('/create', checkAuth, createBill);
router.get('/all', checkAuth, getAllBills);
router.put('/:billId/pay', checkAuth, updateBillPayment);
router.put('/update/:billId', checkAuth, updateBill);
router.delete('/:billId', checkAuth, deleteBill);

export default router;
