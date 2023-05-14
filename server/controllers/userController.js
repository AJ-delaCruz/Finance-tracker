import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import createDefaultCategories from '../Utils/categoryUtils.js';

const register = async (req, res) => {
  // console.log('Inside SiGN UP POST');
  const { username, password } = req.body;
  // console.log(req.body);
  try {
    // random string added to the password before hashed
    const salt = await bcrypt.genSalt(10);
    // hash password
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      username,
      password: passwordHash,
    });

    // console.log(req.body.username);
    // console.log(req.body.password);

    // Check if username is already taken
    const userTaken = await UserModel.findOne({ username });
    // console.log(username);
    if (userTaken) {
      // conflict
      res.status(409).json({ message: 'Username is taken' });
      console.log('Username is taken');
    } else {
      // create user
      await newUser.save();
      // Add default categories for the new user
      await createDefaultCategories(newUser);

      // Return a success response to the client
      res.status(201).json({ message: 'Registration Successful' });
      // console.log(`signed up: ${newUser.username}`);
    }
  } catch (err) {
    // Handle errors and return an error response to the client
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  // console.log('INSIDE LOGIN');

  const { username, password } = req.body;

  // console.log(req.body.username);
  // console.log(req.body.password);

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      // not found
      res.status(401).json({ message: 'Invalid Credentials. Wrong username or password' });
      console.log('wrong username');
      return;
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(401).json({ message: 'Invalid credentials' });
      console.log('wrong password');
      return;
    }

    // console.log('SUCCESSFUL LOGIN');

    // Generate a JWT token
    const payload = { _id: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 1008000,
    });
    // console.log(token);
    // Return a token as response to the client
    res.status(200).json({ token });
  } catch (error) {
    // console.log('LOGIN NOT WORKING');
    res.status(500).json({ message: error });
  }
};

const getAllUsers = async (req, res) => {

  // todo
};

const getUser = async (req, res) => {

  // todo
};

const updateUser = async (req, res) => {

  // todo
};

const deleteUser = async (req, res) => {

  // todo
};

export {
  register, login, getAllUsers, getUser, updateUser, deleteUser,
};
