import nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend directory
dotenvConfig({ path: path.join(__dirname, '..', '.env') });

// Detailed SMTP configuration logging
console.log('=== SMTP Configuration Check ===');
console.log('Environment file path:', path.join(__dirname, '..', '.env'));
console.log('SMTP Configuration:', {
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS ? 'configured' : 'not configured',
  from: process.env.SMTP_FROM,
});

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('=== SMTP Configuration Error ===');
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    console.error('=============================');
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

export const sendEmail = async ({ email, subject, message }) => {
  try {
    // Double-check environment variables
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;

    if (!smtpUser || !smtpPass) {
      console.error('=== Missing SMTP Configuration ===');
      console.error('Configuration status:', {
        user: smtpUser ? 'configured' : 'missing',
        pass: smtpPass ? 'configured' : 'missing',
        from: smtpFrom ? 'configured' : 'missing'
      });
      console.error('===============================');
      throw new Error('SMTP configuration is incomplete. Please check your environment variables.');
    }

    const mailOptions = {
      from: smtpFrom || smtpUser,
      to: email,
      subject,
      text: message,
    };

    console.log('Attempting to send email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('=== Email Sending Error ===');
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    console.error('=========================');
    throw new Error(`Failed to send email: ${error.message}`);
  }
}; 