import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    isPaid: { type: Boolean, default: false },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'account' },

  },
  {
    timestamps: true,
  },
);

const BillModel = mongoose.model('bill', billSchema);
export default BillModel;
