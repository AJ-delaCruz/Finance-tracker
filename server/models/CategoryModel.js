import mongoose from 'mongoose';

// category model for transaction types
const categorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },

    // todo create transaction type here also for less db query?
    // just put category array in user schema for simplicitty?
    // type: { type: String, enum: ['income', 'expense'] },

  },
  {
    timestamps: true,
  },
);

// same unique category names specific for different users
categorySchema.index({ userId: 1, name: 1 }, { unique: true });
const CategoryModel = mongoose.model('category', categorySchema);

export default CategoryModel;
