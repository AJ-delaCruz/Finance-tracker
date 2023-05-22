import express from 'express';

import { createCategory, getAllCategories, getCategoryByType } from '../controllers/categoryController.js';
import { checkAuth } from '../Utils/passport.js'; // to get userId

const router = express.Router();
router.post('/create', createCategory);
router.get('/all', checkAuth, getAllCategories);
router.get('/:type', checkAuth, getCategoryByType);

export default router;
