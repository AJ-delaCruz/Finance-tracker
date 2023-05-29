import express from 'express';

import {
  createGoal, getAllGoals, updateGoal, removeGoal,
} from '../controllers/goalController.js';
import { checkAuth } from '../Utils/passport.js';

const router = express.Router();
router.post('/create', checkAuth, createGoal);
router.get('/all', checkAuth, getAllGoals);
router.put('/update/:id', checkAuth, updateGoal);
router.delete('/:goalId', checkAuth, removeGoal);

export default router;
