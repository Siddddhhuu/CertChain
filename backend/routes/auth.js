import express from 'express';
import { signup, login, createAdmin } from '../controllers/authController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/create-admin', adminAuth, createAdmin);

export default router;
