import {
  createBudgetService,
  getAllBudgetsService,
  updateBudgetService,
  removeBudgetService,
} from '../services/budgetService.js';

// add a budget to track spending
const createBudget = async (req, res) => {
  // console.log('req.body:', req.body);
  // console.log('req.user:', req.user);

  const budgetData = req.body;
  const userId = req.user._id;
  try {
    const newBudget = await createBudgetService(budgetData, userId);

    // return budget to client
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all budgets
const getAllBudgets = async (req, res) => {
  const userId = req.user._id;
  try {
    // retrieve all the budgets using userId
    const budgets = await getAllBudgetsService(userId);

    // console.log(budgets);
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBudget = async (req, res) => {
  const { id } = req.params;
  const budgetData = req.body;
  const userId = req.user._id;
  try {
    // Update the budget in the database
    const updatedBudget = await updateBudgetService(userId, id, budgetData);

    // Return the updated budge
    res.status(200).json(updatedBudget);
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

const removeBudget = async (req, res) => {
  const { budgetId } = req.params;
  const userId = req.user._id;
  // console.log(budgetId);
  try {
    const budget = await removeBudgetService(budgetId, userId);

    res.status(200).json(budget);
  } catch (error) {
    // console.error('Error deleting budget:', error);
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
  createBudget, getAllBudgets, updateBudget, removeBudget,
};
