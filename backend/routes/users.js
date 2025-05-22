import express from 'express';
import { getUsers, getUser, updateUser, deleteUser, createUser, uploadProfilePicture } from '../controllers/userController.js';
import { upload } from '../middleware/upload.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all users
router.get('/', getUsers);

// Get a single user
router.get('/:id', getUser);

// Update a user
router.put('/:id', updateUser);

// Delete a user
router.delete('/:id', deleteUser);

// Create a new user
router.post('/', createUser);

// Upload profile picture
router.post('/:id/profile-picture', upload.single('profilePicture'), uploadProfilePicture);

export default router; 