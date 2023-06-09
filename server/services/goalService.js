import GoalModel from '../models/GoalModel.js';
import UnauthorizedError from '../config/UnauthorizedError.js';
import NotFoundError from '../config/NotFoundError.js';

const createGoalService = async (userId, goalData) => {
  const newGoal = new GoalModel({ userId, ...goalData });
  //   console.log(newGoal);

  // store goal in db
  await newGoal.save();
  return newGoal;
};

const getAllGoalsService = async (userId) => {
  const goals = await GoalModel.find({ userId });
  //   if (goals.length === 0) {
  //     console.log('No goals found');
  //   }

  return goals;
};

const updateGoalService = async (goalId, userId, updateData) => {
  const updatedGoal = await GoalModel.findByIdAndUpdate(goalId, updateData, { new: true });
  // no goal
  if (!updatedGoal) {
    throw new NotFoundError('Goal not found');
  }
  if (updatedGoal.userId.toString() !== userId.toString()) {
    throw new UnauthorizedError('You do not have permission to update this goal.');
  }
  // update goal
  return updatedGoal;
};

const removeGoalService = async (goalId, userId) => {
  const goal = await GoalModel.findByIdAndDelete(goalId);
  if (!goal) {
    throw new NotFoundError('Goal not found');
  }
  if (goal.userId.toString() !== userId.toString()) {
    throw new UnauthorizedError('You do not have permission to remove this goal.');
  }
  // Model.prototype.deleteOne()
  //   await goal.deleteOne();
  return goal;
};

export {
  createGoalService,
  getAllGoalsService,
  updateGoalService,
  removeGoalService,
};
