import GoalModel from '../models/GoalModel.js';

const createGoal = async (req, res) => {
  const userId = req.user._id;
  try {
    // create new GoalModel
    const newGoal = new GoalModel({ user: userId, ...req.body });
    // store goal in db
    await newGoal.save();
    // console.log(newGoal);

    // return response to client
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllGoals = async (req, res) => {
  try {
    const userId = req.user._id;
    const goals = await GoalModel.find({ user: userId });
    // console.log(`goals: ${goals}`);
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGoal = async (req, res) => {

  // todo
};

const updateGoal = async (req, res) => {
  try {
    // const userId = req.user._id;
    const goalId = req.params.id;
    // console.log(goalId);
    const goal = await GoalModel.findById(goalId);

    // no goal
    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });

      //   // check if the user Id matches the user Id in goal database
      // } else if (goal.user.toString() !== userId.toString()) {
      //   res.status(403).json({
      //     message: 'Forbidden: You do not have permission to update this goal',
      //   });
    } else {
      // update goal
      const updatedGoal = await GoalModel.findByIdAndUpdate(goalId, req.body, { new: true });
      // console.log(updatedGoal);
      res.status(200).json(updatedGoal);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeGoal = async (req, res) => {
  const { goalId } = req.params;
  const userId = req.user._id;
  // console.log(goalId);
  // console.log(userId);
  try {
    const goal = await GoalModel.findById(goalId);
    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }
    // check for authentication
    if (goal.user.toString() !== userId.toString()) {
      res.status(403).json({ message: 'You do not have permission to remove this goal.' });
      return;
    }
    // Model.prototype.deleteOne()
    await goal.deleteOne();

    res.status(200).json(goal);
  } catch (error) {
    // console.error('Error deleting goal:', error);
    res.status(500).json({ message: error.message });
  }
};

export {
  createGoal, getAllGoals, getGoal, updateGoal, removeGoal,
};
