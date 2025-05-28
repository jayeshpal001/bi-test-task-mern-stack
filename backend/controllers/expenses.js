// controllers/expenses.js
import Expense from '../models/Expense.js';
import Group from '../models/Group.js';

// @desc    Create expense
// @route   POST /api/groups/:groupId/expenses
// @access  Group members
export const createExpense = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { title, amount, paidBy, splitBetween } = req.body;

    // Verify group existence and membership
    const group = await Group.findOne({
      _id: groupId,
      'members.user': req.user.id
    });

    if (!group) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add expenses to this group'
      });
    }

    // Create expense
    const expense = await Expense.create({
      group: groupId,
      title,
      amount,
      paidBy,
      splitBetween
    });

    // Add expense to group
    group.expenses.push(expense._id);
    await group.save();

    res.status(201).json({
      success: true,
      data: expense
    });

  } catch (err) {
    next(err);
  }
};

// @desc    Get group expenses
// @route   GET /api/groups/:groupId/expenses
// @access  Group members
export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name email')
      .populate('splitBetween', 'name email');

    res.json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Calculate settlements
// @route   GET /api/groups/:groupId/settlements
// @access  Group members
export const calculateSettlements = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy splitBetween');

    // Calculate balances
    const balances = new Map();
    
    expenses.forEach(expense => {
      const share = expense.amount / expense.splitBetween.length;
      
      // Update payer's balance
      balances.set(expense.paidBy._id, 
        (balances.get(expense.paidBy._id) || 0) + expense.amount
      );
      
      // Update participants' balances
      expense.splitBetween.forEach(user => {
        balances.set(user._id, 
          (balances.get(user._id) || 0) - share
        );
      });
    });

    // Generate settlements
    const settlements = [];
    const debtors = Array.from(balances.entries())
      .filter(([_, balance]) => balance < 0);
      
    const creditors = Array.from(balances.entries())
      .filter(([_, balance]) => balance > 0);

    debtors.forEach(([debtorId, debt]) => {
      let remaining = Math.abs(debt);
      
      creditors.forEach(([creditorId, credit]) => {
        if (remaining <= 0) return;
        
        const settleAmount = Math.min(remaining, credit);
        if (settleAmount > 0) {
          settlements.push({
            from: debtorId,
            to: creditorId,
            amount: parseFloat(settleAmount.toFixed(2))
          });
          remaining -= settleAmount;
          balances.set(creditorId, credit - settleAmount);
        }
      });
    });

    res.json({
      success: true,
      data: settlements
    });

  } catch (err) {
    next(err);
  }
};