import express from 'express';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate
} from '../controllers/templateController.js';

const router = express.Router();

router.get('/', auth, getTemplates);
router.post('/', adminAuth, createTemplate);
router.get('/:id', auth, getTemplate);
router.put('/:id', adminAuth, updateTemplate);
router.delete('/:id', adminAuth, deleteTemplate);

export default router;
