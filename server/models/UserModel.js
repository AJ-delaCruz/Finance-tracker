import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  currentGoal: { type: mongoose.Schema.Types.ObjectId, ref: 'goal' },

});

const UserModel = mongoose.model('user', userSchema);
export default UserModel;
