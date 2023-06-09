import {
  createGoalService,
  getAllGoalsService,
  updateGoalService,
  removeGoalService,
} from '../services/goalService.js';

const createGoal = async (req, res) => {
  const userId = req.user._id;
  const goalData = req.body;
  try {
    // create new GoalModel
    const newGoal = await createGoalService(userId, goalData);

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
    const goals = await getAllGoalsService(userId);

    // console.log(`goals: ${goals}`);
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const goalId = req.params.id;
    const updateData = req.body;
    // console.log(goalId);
    const updatedGoal = await updateGoalService(goalId, userId, updateData);

    // console.log(updatedGoal);
    res.status(200).json(updatedGoal);
  } catch (error) {
    switch (error.name) {
      case 'UnauthorizedError':
        res.status(403).json({ message: error.message });
        break;
      case 'NotFoundError':
        res.status(404).json({ message: error.message });
        break;
      default:
        res.status(500).json({ message: error.message });
    }
  }
};

const removeGoal = async (req, res) => {
  const { goalId } = req.params;
  const userId = req.user._id;
  // console.log(goalId);
  // console.log(userId);
  try {
    const goal = await removeGoalService(goalId, userId);

    res.status(200).json(goal);
  } catch (error) {
    // console.error('Error deleting goal:', error);
    switch (error.name) {
      case 'UnauthorizedError':
        res.status(403).json({ message: error.message });
        break;
      case 'NotFoundError':
        res.status(404).json({ message: error.message });
        break;
      default:
        res.status(500).json({ message: error.message });
    }
  }
};

export {
  createGoal, getAllGoals, updateGoal, removeGoal,
};
