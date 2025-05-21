import express from 'express';
import auth from '../middleware/auth.js';
import {
  createRecipient,
  getRecipients,
  getRecipient,
  updateRecipient,
  deleteRecipient
} from '../controllers/recipientController.js';

const router = express.Router();

router.get('/', auth, getRecipients);
router.post('/', auth, createRecipient);
router.get('/:id', auth, getRecipient);
router.put('/:id', auth, updateRecipient);
router.delete('/:id', auth, deleteRecipient);

export default router;