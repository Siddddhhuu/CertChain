import express from 'express';
import auth from '../middleware/auth.js';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser
} from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Get all users (admin only, you can add role check in middleware)
router.get('/', auth, adminAuth, getUsers);

// Get a single user by ID
router.get('/:id', auth, getUser);

// Update a user by ID
router.put('/:id', auth, updateUser);

// Delete a user by ID
router.delete('/:id', auth, deleteUser);

// Add route for creating a user
router.post('/', auth, adminAuth, createUser);

export default router;
