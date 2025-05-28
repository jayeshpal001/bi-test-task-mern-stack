import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // For self-signed certificates (development only)
  }
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.error('Email server connection error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      ...mailOptions
    });
  } catch (err) {
    console.error('Email send error:', err);
    throw new Error('Failed to send email');
  }
};