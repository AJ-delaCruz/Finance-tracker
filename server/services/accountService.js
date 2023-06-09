import AccountModel from '../models/AccountModel.js';
import UnauthorizedError from '../config/UnauthorizedError.js';
import NotFoundError from '../config/NotFoundError.js';

const createAccountService = async (userId, type, name, balance, creditLimit) => {
  // create new account
  const newAccount = new AccountModel({
    userId, type, name, balance, creditLimit,
  });

  // store account in db
  await newAccount.save();
  // console.log(newAccount);
  return newAccount;
};

const getAllAccountsService = async (userId) => {
  const accounts = await AccountModel.find({ userId });
  if (!accounts) {
    console.log('no accounts found');
    throw new NotFoundError('No accounts found');
  }
  return accounts;
};

const updateAccountService = async (accountId, userId, updateData) => {
  const account = await AccountModel.findById(accountId);
  if (!account) {
    throw new NotFoundError('Account not found');
  }
  // check for authentication
  if (account.userId.toString() !== userId.toString()) {
    throw new UnauthorizedError('You do not have permission to update this account.');
  }
  const updatedAccount = await AccountModel.findByIdAndUpdate(accountId, updateData, { new: true });
  return updatedAccount;
};

const removeAccountService = async (accountId, userId) => {
  const account = await AccountModel.findById(accountId);
  if (!account) {
    throw new NotFoundError('Account not found');
  }
  // check for authentication
  if (account.userId.toString() !== userId.toString()) {
    throw new UnauthorizedError('You do not have permission to remove this account.');
  }
  await account.deleteOne();
  return account;
};

export {
  createAccountService,
  getAllAccountsService,
  updateAccountService,
  removeAccountService,
};
