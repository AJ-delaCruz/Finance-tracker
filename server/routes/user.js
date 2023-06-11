import express from 'express';

import { register, login, deleteUser } from '../controllers/userController.js';
import { checkAuth } from '../Utils/passport.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/:id', checkAuth, deleteUser);

export default router;
