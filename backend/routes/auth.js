import express from 'express';
import { signup, login, createAdmin, forgotPassword, resetPassword } from '../controllers/authController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/signup', (req, res) => {
    res.json({ message: 'Signup route hit' });
  });
router.post('/login', login);

router.post('/create-admin', adminAuth, createAdmin);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
