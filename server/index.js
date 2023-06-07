import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
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
import { initializeIo } from './Utils/websocket.js';

dotenv.config();
const app = express(); // create an express app

// create a Socket.IO server for websocket and attach to http server
const http = createServer(app); // create http server
initializeIo(http); // Initialize Socket.IO with the HTTP server

app.use(cors({
  // handle http API request
  // origin: [process.env.frontendURL, 'http://localhost:4000'],
  origin: '*',
  // credentials: true
}));

app.use(express.urlencoded({ extended: true })); // parse req.body with URL-encoded format by client
app.use(express.json()); // parse request bodies that are in JSON format

const port = 3000 || process.env.PORT;

// Connection pooling to improve the performance and scalability
// Reuse connection to db
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 100, // max connections in the pool
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

app.use('/api/user', userRoute);
app.use('/api/account', accountRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/category', categoryRoute);
app.use('/api/budget', budgetRoute);
app.use('/api/goal', goalRoute);
app.use('/api/bill', billRoute);
app.use('/api/chat', chatbotRoute);

// start the HTTP server for both Express app and Socket.IO server
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
