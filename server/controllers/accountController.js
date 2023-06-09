import {
  createAccountService,
  getAllAccountsService,
  updateAccountService,
  removeAccountService,
} from '../services/accountService.js';

// create a checking, savings, credit card, or loan account
const createAccount = async (req, res) => {
  const {
    type, name, balance, creditLimit,
  } = req.body;
  const userId = req.user._id;
  try {
    // create new account
    const newAccount = await createAccountService(userId, type, name, balance, creditLimit);

    // return response to client
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// retrieve user accounts
const getAllAccounts = async (req, res) => {
  try {
    const userId = req.user._id;
    const accounts = await getAllAccountsService(userId);

    res.status(200).json(accounts);
  } catch (error) {
    console.error(error);
    switch (error.name) {
      case 'NotFoundError':
        res.status(404).json({ message: error.message });
        break;
      default:
        res.status(500).json({ message: error.message });
    }
  }
};

const updateAccount = async (req, res) => {
  const { accountId } = req.params;
  const userId = req.user._id;
  const { updateData } = req.body;

  try {
    const updatedAccount = await updateAccountService(accountId, userId, updateData);

    res.status(200).json(updatedAccount);
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

// todo in react
const removeAccount = async (req, res) => {
  const { accountId } = req.params;
  const userId = req.user._id;

  try {
    const account = await removeAccountService(accountId, userId);

    res.status(200).json(account);
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
  createAccount, getAllAccounts, updateAccount, removeAccount,
};
