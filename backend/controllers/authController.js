import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/emailUtils.js';

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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    console.log('Processing forgot password request for email:', email);
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found with email:', email);
      // For security reasons, don't reveal if the email exists or not
      return res.json({ 
        success: true, 
        message: 'If your email is registered, you will receive a password reset link.' 
      });
    }

    console.log('User found, generating reset token');
    
    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash the token and save it to the user document
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set token expiry (1 hour from now)
    user.resetPasswordExpires = Date.now() + 3600000;
    
    await user.save();
    console.log('Reset token saved to user document');

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('Reset URL generated:', resetUrl);

    // Send email with reset link
    const message = `
      You are receiving this email because you (or someone else) has requested to reset your password.
      Please click on the following link to reset your password:
      ${resetUrl}
      
      If you did not request this, please ignore this email and your password will remain unchanged.
    `;

    try {
      console.log('Attempting to send reset email');
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });
      console.log('Reset email sent successfully');

      res.json({ 
        success: true, 
        message: 'If your email is registered, you will receive a password reset link.' 
      });
    } catch (err) {
      console.error('Error sending reset email:', err);
      
      // Clear the reset token if email sending fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.log('Reset token cleared due to email sending failure');

      return res.status(500).json({ 
        success: false, 
        message: 'Email could not be sent. Please try again later.' 
      });
    }
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your request. Please try again later.' 
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching token and non-expired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password and clear reset token fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (err) {
    console.error('Error in resetPassword:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting your password'
    });
  }
};