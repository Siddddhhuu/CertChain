import express from 'express';
import auth from '../middleware/auth.js';
import {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate
} from '../controllers/templateController.js';

const router = express.Router();

router.get('/', auth, getTemplates);
router.post('/', auth, createTemplate);
router.get('/:id', auth, getTemplate);
router.put('/:id', auth, updateTemplate);
router.delete('/:id', auth, deleteTemplate);

export default router;
