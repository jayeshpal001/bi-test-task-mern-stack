import express from 'express';
import auth from '../middleware/auth.js';
import {
  createExpense,
  getExpenses,
  calculateSettlements
} from '../controllers/expenses.js';

const router = express.Router();

router.post('/:groupId/expenses', auth, createExpense);
router.get('/:groupId/expenses', auth, getExpenses);
router.get('/:groupId/settlements', auth, calculateSettlements);

export default router;