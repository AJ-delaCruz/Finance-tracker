import BudgetModel from '../models/BudgetModel.js';

// Add a budget to track spending
const createBudgetService = async (budgetData, userId) => {
  const newBudget = new BudgetModel({
    userId,
    ...budgetData,
  });
  // console.log(newBudget);

  // store new budget to db
  await newBudget.save();
  return newBudget;
};

// Retrieve all the budgets using userId
const getAllBudgetsService = async (userId) => {
  const budgets = await BudgetModel.find({ userId }).populate('category', 'name');
  return budgets;
};

const updateBudgetService = async (userId, id, budgetData) => {
  const budget = await BudgetModel.findById(id);
  if (!budget) {
    throw new Error('Budget not found');
  }
  if (budget.userId.toString() !== userId.toString()) {
    throw new Error('You do not have permission to remove this budget.');
  }

  // update budget
  const updatedBudget = await BudgetModel.findByIdAndUpdate(
    id,
    budgetData,
    { new: true },
  );
  return updatedBudget;
};

const removeBudgetService = async (budgetId, userId) => {
  const budget = await BudgetModel.findById(budgetId);
  if (!budget) {
    throw new Error('Budget not found');
  }
  if (budget.userId.toString() !== userId.toString()) {
    throw new Error('You do not have permission to remove this budget.');
  }
  // Model.prototype.deleteOne()
  await budget.deleteOne();
  return budget;
};

export {
  createBudgetService,
  getAllBudgetsService,
  updateBudgetService,
  removeBudgetService,
};
