import express from 'express';

import {
  createBudget,
  getAllBudgets,
  //   getBudget,
  updateBudget,
  removeBudget,
} from '../controllers/budgetController.js';
import { checkAuth } from '../Utils/passport.js'; // authenticate and get userID

const router = express.Router();
router.post('/create', checkAuth, createBudget);
router.get('/all', checkAuth, getAllBudgets);
router.put('/update/:id', checkAuth, updateBudget);
router.delete('/:budgetId', checkAuth, removeBudget);

export default router;
