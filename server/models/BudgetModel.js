import mongoose from 'mongoose';

// budget model to track spending limits
const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  name: { type: String, required: true },
  amount: { type: Number, default: 0, required: true },
  limit: { type: Number, required: true },
  period: { type: String, enum: ['weekly', 'monthly', 'yearly'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  // todo limit spending by category
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' }, // optional

}, {
  timestamp: true,

});

// budgetSchema.index({ userId: 1, startDate: 1, endDate: 1 });
const BudgetModel = mongoose.model('budget', budgetSchema);
export default BudgetModel;
