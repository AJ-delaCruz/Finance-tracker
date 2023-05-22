import BudgetModel from '../models/BudgetModel.js';

// add a budget to track spending
const createBudget = async (req, res) => {
  // console.log('req.body:', req.body);
  // console.log('req.user:', req.user);

  const {
    name, amount, limit, period, startDate, endDate, category,
  } = req.body;
  const userId = req.user._id;
  try {
    const newBudget = new BudgetModel({
      userId,
      name,
      amount,
      limit,
      period,
      startDate,
      endDate,
      category,
    });
    // console.log(newBudget);

    // store new budget to db
    await newBudget.save();

    // return budget to client
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBudgets = async (req, res) => {
  const userId = req.user._id;
  try {
    // retrieve all the budgets using userId
    // const budgets = await BudgetModel.find({ userId });
    const budgets = await BudgetModel.find({ userId }).populate('category', 'name');

    // console.log(budgets);
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getBudget = async (req, res) => {

  // todo
};

const updateBudget = async (req, res) => {
  const { id } = req.params;
  const {
    amount, limit, period, startDate, endDate, category,
  } = req.body;

  try {
    // Update the budget in the database
    const updatedBudget = await BudgetModel.findByIdAndUpdate(
      id,
      {
        amount, limit, period, startDate, endDate, category,
      },
      { new: true },
    );

    // Return the updated budge
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeBudget = async (req, res) => {

  // todo
};

export {
  createBudget, getAllBudgets, getBudget, updateBudget, removeBudget,
};
