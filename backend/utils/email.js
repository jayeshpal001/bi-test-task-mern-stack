// backend/utils/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
const validateConfig = () => {
  const required = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0 && process.env.EMAIL_ENABLED === 'true') {
    throw new Error(`Missing email configuration: ${missing.join(', ')}`);
  }
};
validateConfig();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for others
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production' // Strict in prod
  }
});

// Connection verification
transporter.verify((error) => {
  if (error && process.env.EMAIL_ENABLED === 'true') {
    console.error('❌ Email connection failed:', error.message);
  } else if (process.env.EMAIL_ENABLED === 'true') {
    console.log('📧 Email server ready');
  }
});

/**
 * Send email with error handling and fallbacks
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} [text] - Plain text alternative
 * @returns {Promise<boolean>} - True if sent successfully
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  if (process.env.EMAIL_ENABLED !== 'true') {
    console.log('📧 Email service disabled');
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Expense Manager" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]+>/g, ''),
      html
    });

    console.log(`📧 Email sent to ${to}:`, info.messageId);
    return true;

  } catch (error) {
    console.error('❌ Email failed:', {
      to,
      error: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    // Don't throw error to prevent blocking main operations
    return false;
  }
};

// Add test route in development
if (process.env.NODE_ENV === 'development') {
  import('express').then(expressModule => {
    const express = expressModule.default;
    const testApp = express();
    
    testApp.get('/test-email', async (_, res) => {
      const success = await sendEmail({
        to: process.env.EMAIL_USER,
        subject: 'Test Email',
        html: '<h1>Email Service Working!</h1>'
      });
      res.json({ success });
    });
    
    testApp.listen(5001, () => 
      console.log('🧪 Email tester available at http://localhost:5001/test-email')
    );
  }).catch(err => {
    console.error('Failed to start email test server:', err);
  });
}

export default sendEmail;