import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'Group reference is required']
  },
  title: {
    type: String,
    required: [true, 'Expense title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be at least 0.01']
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payer information is required']
  },
  splitBetween: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'At least one participant is required']
  }],
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Automatically include payer in splitBetween if missing
expenseSchema.pre('save', function(next) {
  const paidById = this.paidBy.toString();
  const splitIds = this.splitBetween.map(id => id.toString());
  
  if (!splitIds.includes(paidById)) {
    this.splitBetween.push(this.paidBy);
  }
  
  // Remove duplicates
  this.splitBetween = [...new Set(this.splitBetween)];
  next();
});

// Virtual for per-person share calculation
expenseSchema.virtual('sharePerPerson').get(function() {
  return this.amount / this.splitBetween.length;
});

// Validation for at least one participant
expenseSchema.path('splitBetween').validate(function(value) {
  return value.length > 0;
}, 'At least one participant is required');

export default mongoose.model('Expense', expenseSchema);