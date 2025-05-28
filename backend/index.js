import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import groupRoutes from './routes/groups.js';
import expenseRoutes from './routes/expenses.js'; // ✅ Add this

import errorHandler from './middleware/error.js';
import sendEmail from './utils/email.js';

dotenv.config();

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/groups', expenseRoutes); // ✅ Add this

// Test email route
app.get('/test-email', async (req, res) => {
  try {
    await sendEmail({
      email: 'test@example.com',
      subject: 'Test Email',
      html: '<h1>Email Service Working!</h1>'
    });
    res.send('Email sent successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
