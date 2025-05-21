import express from 'express';
import auth from '../middleware/auth.js';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Get all users (admin only, you can add role check in middleware)
router.get('/', auth, getUsers);

// Get a single user by ID
router.get('/:id', auth, getUser);

// Update a user by ID
router.put('/:id', auth, updateUser);

// Delete a user by ID
router.delete('/:id', auth, deleteUser);

export default router;
