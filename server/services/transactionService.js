import TransactionModel from '../models/TransactionModel.js';
import AccountModel from '../models/AccountModel.js';
import BudgetModel from '../models/BudgetModel.js';
import GoalModel from '../models/GoalModel.js';
import UserModel from '../models/UserModel.js';
import { socketIO } from '../Utils/websocket.js';
import NotFoundError from '../config/NotFoundError.js';
import UnauthorizedError from '../config/UnauthorizedError.js';

const addTransactionService = async (userId, account, category, type, amount, description) => {
  const io = socketIO();
  const newTransaction = new TransactionModel({
    userId, account, category, type, amount, description,
  });

  // create new Transaction
  await newTransaction.save();

  // Adjust account balance
  // increment balance if transaction type is income else decrement
  const accountUpdate = { $inc: { balance: type === 'income' ? amount : -amount } };
  const updatedAccount = await AccountModel.findByIdAndUpdate(
    account,
    accountUpdate,
    { new: true },
  );
  // console.log(updatedAccount);

  // Adjust user budget if it exists
  const budget = await BudgetModel.findOne({ userId, category });
  // console.log(budget);
  if (budget) {
    // increment budget amount
    const budgetUpdate = { $inc: { amount: +amount } };
    // await BudgetModel.findByIdAndUpdate(budget, budgetUpdate);
    const updatedBudget = await BudgetModel.findByIdAndUpdate(
      budget,
      budgetUpdate,
      { new: true },
    );
    console.log('budget updated');

    // send real time notification if budget exceeded limit
    if (updatedBudget.amount >= updatedBudget.limit) {
      io.emit('notificationEvent', {
        user: userId,
        budget: updatedBudget,
        message: `Budget: ${budget.period} ${budget.name} has exceeded $${budget.limit} limit`,
      });
    }
  }

  // Adjust user goal if it exists
  const user = await UserModel.findOne(userId);
  // if (user.currentGoal) {
  if (user.currentGoal && (updatedAccount.type === 'Checking' || updatedAccount.type === 'Savings')) {
    // increment goal currentAmount if account type is debit/savings else decrement
    const goalUpdate = { $inc: { currentAmount: type === 'income' ? amount : -amount } };
    // await GoalModel.findByIdAndUpdate(user.currentGoal, goalUpdate);
    const updatedGoal = await GoalModel.findByIdAndUpdate(
      user.currentGoal,
      goalUpdate,
      { new: true },
    );
    // console.log(updatedGoal);
    console.log('goal updated');
    // console.log(io.sockets.sockets);

    // send real time notification if goal is completed
    if (updatedGoal.currentAmount >= updatedGoal.targetAmount) {
      io.emit('notificationEvent', {
        user: userId,
        goal: updatedGoal,
        message: `Congratulations. Goal: ${updatedGoal.name} achieved!`,
      });
    }
  }
  return newTransaction;
};

const getAllTransactionsService = async (userId, limit) => {
  let query = TransactionModel.find({ userId })
    .populate('account', 'name') // retrieve account name instead of id
    .populate('category', 'name'); // retrieve category name instead of id

  // option to limit the results
  if (limit) {
    query = query.sort({ _id: -1 }).limit(parseInt(limit, 10));
  }

  // execute query
  const transactions = await query.exec();

  // no transactions found
  if (transactions.length === 0) {
    console.log('No transactions found');
    throw new NotFoundError('No transactions found');
  }

  return transactions;
};

const getTransactionByTypeService = async (userId, transactionType) => {
  const transactionsByCategory = await TransactionModel.aggregate([
    {
      // filter user transactions by type
      $match: { userId, type: transactionType },
      // $match: { userId: id, type: transactionType }, // for postman testing
    },
    {
      // join transaction collection with category collection
      $lookup: {
        from: 'categories',
        localField: 'category', // category id
        foreignField: '_id',
        as: 'categoryData',
      },
    },
    { // group by category name with their total amount
      $group: {
        _id: '$categoryData.name',
        totalAmount: { $sum: '$amount' },
      },
    },
    // sort by each category total amount in descending order
    { $sort: { totalAmount: -1 } },
  ]);
  // console.log(transactionsByCategory);

  return transactionsByCategory;
};

const updateTransactionService = async (transactionId, userId, updateData) => {
  const transaction = await TransactionModel.findById(transactionId);

  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }
  // check for authentication
  if (transaction.userId.toString() !== userId.toString()) {
    throw new UnauthorizedError('You do not have permission to update this transaction.');
  }

  // update transaction
  const updatedTransaction = await TransactionModel.findByIdAndUpdate(
    transactionId,
    updateData,
    { new: true },
  );
  // console.log(updatedTransaction);
  return updatedTransaction;
};

const removeTransactionService = async (transactionId, userId) => {
  const transaction = await TransactionModel.findById(transactionId);

  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }
  // check for authentication
  if (transaction.userId.toString() !== userId.toString()) {
    throw new UnauthorizedError('You do not have permission to remove this transaction.');
  }

  await transaction.deleteOne();
  return transaction;
};

export {
  addTransactionService,
  getAllTransactionsService,
  getTransactionByTypeService,
  updateTransactionService,
  removeTransactionService,
};
