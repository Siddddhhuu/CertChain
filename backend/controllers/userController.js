import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profile-pictures';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').lean(); // Use .lean() for plain JavaScript objects

    // For each user, count the number of certificates they have received
    const usersWithCertCount = await Promise.all(users.map(async (user) => {
      const certificatesCount = await Certificate.countDocuments({ 'recipient.email': user.email });
      console.log(`User: ${user.email}, Certificates Count: ${certificatesCount}`); // Added log for count
      return { ...user, certificatesCount };
    }));

    console.log('Sending users with certificate count:', usersWithCertCount); // Added log for final data
    res.json(usersWithCertCount);
  } catch (err) {
    console.error('Error in getUsers:', err); // Added logging
    res.status(500).json({ message: err.message });
  }
};

// Get a single user by ID
export const getUser = async (req, res) => {
  try {
    console.log('Getting user with ID:', req.params.id); // Debug log
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      console.log('User not found with ID:', req.params.id); // Debug log
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Found user:', user); // Debug log
    // Transform the data to include id field as a string and full profilePictureUrl
    const userData = user.toObject();
    userData.id = userData._id.toString(); // Convert ObjectId to string
    delete userData._id; // Optionally remove _id if only 'id' is needed on frontend
    // Construct the full URL for the profile picture
    if (userData.profilePictureUrl) {
      userData.profilePictureUrl = `http://localhost:5000${userData.profilePictureUrl}`; // Assuming backend runs on port 5000
    }
    console.log('Transformed user data:', userData); // Debug log
    res.json(userData);
  } catch (err) {
    console.error('Error in getUser:', err); // Debug log
    res.status(500).json({ message: err.message });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  try {
    console.log('Updating user with ID:', req.params.id);
    console.log('Update data:', req.body);
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');
    
    if (!user) {
      console.log('User not found with ID:', req.params.id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Transform the data to include id field as a string and full profilePictureUrl
    const userData = user.toObject();
    userData.id = userData._id.toString(); // Convert ObjectId to string
    delete userData._id; // Optionally remove _id if only 'id' is needed on frontend
     // Construct the full URL for the profile picture
    if (userData.profilePictureUrl) {
      userData.profilePictureUrl = `http://localhost:5000${userData.profilePictureUrl}`; // Assuming backend runs on port 5000
    }
    console.log('Updated user data:', userData);
    res.json(userData);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, walletAddress, password, role } = req.body; // Assuming these fields are sent
    
    // Basic validation (add more as needed)
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email already exists' });
    }

    const user = new User({
      name: name || email, // Use name if provided, otherwise email
      email,
      walletAddress,
      password, // Remember to hash the password in a real application!
      role: role || 'user', // Default role to user if not provided
    });

    await user.save();
    // Return user data without the password
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).json({ message: err.message });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.params.id;
    const filePath = req.file.path.replace(/\\/g, '/'); // Convert Windows path to URL format
    const profilePictureUrl = `/${filePath}`; // Make it relative to server root

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePictureUrl },
      { new: true }
    ).select('-password');

    if (!user) {
      // Delete the uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'User not found' });
    }

    // Transform the data to include id field as a string and full profilePictureUrl
    const userData = user.toObject();
    userData.id = userData._id.toString(); // Convert ObjectId to string
    delete userData._id; // Optionally remove _id if only 'id' is needed on frontend
     // Construct the full URL for the profile picture
    if (userData.profilePictureUrl) {
      userData.profilePictureUrl = `http://localhost:5000${userData.profilePictureUrl}`; // Assuming backend runs on port 5000
    }
    console.log('Updated user data after profile picture upload:', userData);
    res.json(userData);
  } catch (err) {
    console.error('Error uploading profile picture:', err);
    // Delete the uploaded file if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: err.message });
  }
};
