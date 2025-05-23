import express from 'express';
import { createContactMessage, getContactMessages, softDeleteContactMessage } from '../controllers/contactController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', createContactMessage);
router.get('/', adminAuth, getContactMessages);
router.put('/:id/soft-delete', adminAuth, softDeleteContactMessage);

export default router; 