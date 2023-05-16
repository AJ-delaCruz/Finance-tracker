import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import userRoute from './routes/user.js';
import accountRoute from './routes/account.js';
import transactionRoute from './routes/transaction.js';
import categoryRoute from './routes/category.js';
import budgetRoute from './routes/budget.js';
import goalRoute from './routes/goal.js';
import billRoute from './routes/bills.js';
import chatbotRoute from './routes/chatbot.js';

const app = express(); // create an express app
app.use(cors()); // todo configure allowed domain/origin later
// app.use(cors({origin: process.env.frontendURL, credentials: true}));

app.use(express.urlencoded({ extended: true })); // parse req.body with URL-encoded format by client
app.use(express.json()); // parse request bodies that are in JSON format
dotenv.config();

const port = 3000 || process.env.PORT;

// Connection pooling to improve the performance and scalability
// Reuse connection to db
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // max connections in the pool
  // maxPoolSize: 100, //default
};

mongoose.connect(process.env.MONGODB_URL, options)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.log(err);
    console.log('MongoDB Connection Failed');
  });

app.use('/user', userRoute);
app.use('/account', accountRoute);
app.use('/transaction', transactionRoute);
app.use('/category', categoryRoute);
app.use('/budget', budgetRoute);
app.use('/goal', goalRoute);
app.use('/bill', billRoute);
app.use('/chat', chatbotRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
