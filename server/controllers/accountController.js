import AccountModel from '../models/AccountModel.js';

// create a checking or savings account
const createAccount = async (req, res) => {
  const {
    type, name, balance, creditLimit,
  } = req.body;
  const userId = req.user._id;
  try {
    // create new account
    const newAccount = new AccountModel({
      userId, type, name, balance, creditLimit,
    });
    // store account in db
    await newAccount.save();
    // console.log(newAccount);

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
    const accounts = await AccountModel.find({ userId });

    // no accounts found
    if (!accounts) {
      // not found
      res.status(404).json({ message: 'no accounts found' });
      console.log('no accounts found');
      return;
    }
    // console.log(accounts);

    res.status(200).json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAccount = async (req, res) => {

  // todo
};

const updateAccount = async (req, res) => {

  // todo
};

const removeAccount = async (req, res) => {

  // todo
};

export {
  createAccount, getAllAccounts, getAccount, updateAccount, removeAccount,
};
