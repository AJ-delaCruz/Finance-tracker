import CategoryModel from '../models/CategoryModel.js';

const createCategory = async (req, res) => {
  const { userId, name } = req.body;
  try {
    const newCategory = new CategoryModel({
      userId,
      name,
    });

    // check category name if it exists
    const categoryExists = CategoryModel.findOne({ name });
    // category already exists
    if (categoryExists) {
      // console.log(categoryExists);
      res.status(409).json({ message: 'Category already exists' });
    } else {
      // create new category in db
      await newCategory.save();
      // console.log(newCategory);

      res.status(201).json(newCategory);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log(userId);

    const categories = await CategoryModel.find({ userId });

    // no categories
    if (!categories) {
      // not found
      res.status(404).json({ message: 'no categories' });
      console.log('no categories');
      return;
    }
    // console.log(categories);
    // return categories
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getCategoryByType = async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.user._id;
    // find categories that match the given type and belong to the user
    const categories = await CategoryModel.find({ userId, type });

    if (!categories || categories.length === 0) {
      // no categories found for the given type
      res.status(404).json({ message: `No categories found for type: ${type}` });
      return;
    }

    // return the found categories
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {

  // todo
};

const removeCategory = async (req, res) => {

  // todo
};

export {
  createCategory, getAllCategories, getCategory, removeCategory, getCategoryByType,
};
