import express from 'express';
import auth from '../middleware/auth.js';
import {
  createCertificate,
  getCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate
} from '../controllers/certificateController.js';

const router = express.Router();

router.get('/', auth, getCertificates);
router.post('/', auth, createCertificate);
router.get('/:id', auth, getCertificate);
router.put('/:id', auth, updateCertificate);
router.delete('/:id', auth, deleteCertificate);

export default router;
