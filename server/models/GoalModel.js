import mongoose from 'mongoose';

// goal model to track financial goals
const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  name: { type: String, required: true },
  description: { type: String },
  currentAmount: { type: Number, required: true },
  targetAmount: { type: Number, required: true },
  targetDate: { type: Date },
  completed: { type: Boolean },
}, {
  timestamps: true,
});

const GoalModel = mongoose.model('goal', goalSchema);

export default GoalModel;
