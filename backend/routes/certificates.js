import express from 'express';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import {
  createCertificate,
  getCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate
} from '../controllers/certificateController.js';

const router = express.Router();

router.get('/', auth, getCertificates);
router.post('/', adminAuth, createCertificate);
router.get('/:id', auth, getCertificate);
router.put('/:id', adminAuth, updateCertificate);
router.delete('/:id', adminAuth, deleteCertificate);

export default router;
