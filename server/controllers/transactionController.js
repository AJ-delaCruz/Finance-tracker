import TransactionModel from '../models/TransactionModel.js';
import AccountModel from '../models/AccountModel.js';
import BudgetModel from '../models/BudgetModel.js';
import GoalModel from '../models/GoalModel.js';
import UserModel from '../models/UserModel.js';
import { socketIO } from '../Utils/websocket.js';

const addTransaction = async (req, res) => {
  const io = socketIO();
  const {
    // required in transactions
    account, category, type, amount,
    // optional
    // budget,
    // goal,
    description,
  } = req.body;

  const userId = req.user._id;
  // console.log(userId);
  try {
    const newTransaction = new TransactionModel({
      userId, account, category, type, amount, description,
    });
    // const newTransaction = new TransactionModel(req.body);

    // create new Transaction
    await newTransaction.save();
    // console.log(newTransaction);

    // todo: use RabbitMQ or Kafka to handle updates for account, budget, and goal?
    // using websocket API instead

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

    // Return the new transaction as response to the client
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await TransactionModel.find({ userId })
      .populate('account', 'name') // retrieve account name instead of id
      .populate('category', 'name'); // retrieve category name instead of id

    // no transactions found
    if (!transactions) {
      // not found
      res.status(404).json({ message: 'no transactions found' });
      console.log('no transactions found');
      return;
    }
    // console.log(transactions);

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getTransactionByType = async (req, res) => {
  const transactionType = req.query.type; // expense or income
  // console.log(req.headers);

  // console.log(req.user._id);
  // console.log(transactionType);
  try {
    // for testing without using jwt token user id
    // const id = new mongoose.Types.ObjectId(req.query.userId);
    // console.log(id);

    const transactionsByCategory = await TransactionModel.aggregate([
      {
        // filter user transactions by type
        $match: { userId: req.user._id, type: transactionType },
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
    res.status(200).json(transactionsByCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const updateTransaction = async (req, res) => {
//
//     // todo
// };
//
const removeTransaction = async (req, res) => {
  const { transactionId } = req.params;
  const userId = req.user._id;
  // console.log(transactionId);
  try {
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }
    // check for authentication
    if (transaction.userId.toString() !== userId.toString()) {
      res.status(403).json({ message: 'You do not have permission to remove this transaction.' });
      return;
    }
    // Model.prototype.deleteOne()
    await transaction.deleteOne();

    res.status(200).json(transaction);
  } catch (error) {
    // console.error('Error deleting transaction:', error);
    res.status(500).json({ message: error.message });
  }
};

export {
  addTransaction, getAllTransactions, getTransactionByType, removeTransaction,
};
