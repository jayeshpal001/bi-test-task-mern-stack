// models/Group.js
import mongoose from 'mongoose';
import generateShortId from '../utils/generateShortId.js';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [50, 'Group name cannot exceed 50 characters'],
    minlength: [3, 'Group name must be at least 3 characters']
  },
  shortId: {
    type: String,
    unique: true,
    default: generateShortId,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate short ID before saving
groupSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  // Ensure unique shortId
  while (true) {
    const tempId = generateShortId();
    const exists = await mongoose.model('Group').exists({ shortId: tempId });
    if (!exists) {
      this.shortId = tempId;
      break;
    }
  }
  next();
});

// Virtual populate members count
groupSchema.virtual('membersCount').get(function() {
  return this.members.length;
});

// Virtual populate total expenses
groupSchema.virtual('totalExpenses').get(function() {
  return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
});

export default mongoose.model('Group', groupSchema);