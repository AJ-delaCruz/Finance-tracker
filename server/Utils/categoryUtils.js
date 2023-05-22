import CategoryModel from '../models/CategoryModel.js';

const defaultCategories = [

  // expense categories
  { name: 'Rent', type: 'expense' },
  { name: 'Utilities (Electricity, Water, Gas, Internet)', type: 'expense' },
  { name: 'Groceries', type: 'expense' },
  { name: 'Food & drinks', type: 'expense' },
  { name: 'Shopping', type: 'expense' },
  { name: 'Entertainment', type: 'expense' },
  { name: 'Health/Medical', type: 'expense' },
  { name: 'Travel', type: 'expense' },
  { name: 'Gas', type: 'expense' },
  { name: 'Miscellaneous', type: 'expense' },

  // income categories
  { name: 'Salary', type: 'income' },
  { name: 'Bonus', type: 'income' },
  { name: 'Gift', type: 'income' },
  { name: 'Investment', type: 'income' },

];

// add default categories when a user registers
const createDefaultCategories = async (user) => {
  console.log(user._id);
  const categoryPromises = defaultCategories.map((category) => {
    const newCategory = new CategoryModel({
      ...category,
      userId: user._id,
    });
    return newCategory.save();
  });

  // waiting for all the categories to be saved to the database before continuing
  await Promise.all(categoryPromises);
};

export default createDefaultCategories;
