import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Always set role to 'user' for regular signup
    user = new User({ name, email, password, role: 'user' });
    await user.save();

    // Include email in the JWT payload
    const payload = { id: user._id, role: user.role, email: user.email };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// This function should only be called by database administrators
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Set role to 'admin' for admin creation
    user = new User({ name, email, password, role: 'admin' });
    await user.save();

    // Include email in the JWT payload
    const payload = { id: user._id, role: user.role, email: user.email };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    // console.log('Received password (should not be logged in production!): ', password);

    const user = await User.findOne({ email });
    console.log('User found:', !!user);

    if (!user) {
      console.log('Login failed: User not found.');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing password...');
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Login failed: Password mismatch.');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Include email in the JWT payload
    const payload = { id: user._id, role: user.role, email: user.email };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });

    console.log('Login successful. Sending token and user info.');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Error in login controller:', err);
    res.status(500).json({ message: err.message });
  }
};