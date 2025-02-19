// Load environment variables
require('dotenv').config();

// Import dependencies using CommonJS syntax
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/booksRoute');
const userRouter = require('./routes/user'); // Import user routes

// Initialize the Express app
const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors()); // Allow all origins by default

// Root route for testing
app.get('/', (req, res) => {
  return res.status(200).send('Welcome');
});

// Registering the routes for users and books
app.use('/books', router);  // Books related routes
app.use('/users', userRouter);  // User related routes
// MongoDB connection and app start
const mongoDBURL = process.env.MONGO_DB_URL;  // Ensure this is defined in your .env file
const PORT = process.env.PORT || 5000; // Default to 5000 if not defined

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });
