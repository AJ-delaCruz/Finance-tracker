import {
  addTransactionService,
  getAllTransactionsService,
  getTransactionByTypeService,
  updateTransactionService,
  removeTransactionService,
} from '../services/transactionService.js';

const addTransaction = async (req, res) => {
  try {
    const {
      account, category, type, amount, description,
    } = req.body;
    const userId = req.user._id;
    // console.log(userId);

    const newTransaction = await addTransactionService(
      userId,
      account,
      category,
      type,
      amount,
      description,
    );

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit } = req.query;
    const transactions = await getAllTransactionsService(userId, limit);
    res.status(200).json(transactions);
  } catch (error) {
    switch (error.name) {
      case 'NotFoundError':
        res.status(404).json({ message: error.message });
        break;
      default:
        res.status(500).json({ message: error.message });
    }
  }
};

const getTransactionByType = async (req, res) => {
  try {
    const transactionType = req.query.type;
    const userId = req.user._id;
    const transactionsByCategory = await getTransactionByTypeService(userId, transactionType);
    res.status(200).json(transactionsByCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;
    const updatedTransaction = await updateTransactionService(transactionId, userId, req.body);
    res.status(200).json(updatedTransaction);
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

const removeTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;
    const removedTransaction = await removeTransactionService(transactionId, userId);
    res.status(200).json(removedTransaction);
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

export {
  addTransaction,
  getAllTransactions,
  getTransactionByType,
  removeTransaction,
  updateTransaction,
};
