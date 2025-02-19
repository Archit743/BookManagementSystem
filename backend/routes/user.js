const bcrypt = require('bcrypt');
const { Router } = require('express');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/userModel'); // Fixed import path

const userRouter = Router();
const JWT_SECRET = process.env.JWT_USER_SECRET; // Ensure this is properly set in .env

// User Signup Route
userRouter.post('/signup', async (req, res) => {
  const requiredBody = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(3).max(100),
  });

  const parsedCorrectly = requiredBody.safeParse(req.body);
  if (!parsedCorrectly.success) {
    return res.status(400).json({
      message: 'Input validation failed',
      errors: parsedCorrectly.error.errors,
    });
  }

  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists. Please login.',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token
    const token = jwt.sign({ _id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'User signed up successfully',
      token,
    });
  } catch (e) {
    console.error('Error creating user:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Signin Route
userRouter.post('/signin', async (req, res) => {
  const requiredBody = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const parsedCorrectly = requiredBody.safeParse(req.body);
  if (!parsedCorrectly.success) {
    return res.status(400).json({
      message: 'Input validation failed',
      errors: parsedCorrectly.error.errors,
    });
  }

  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: 'User does not exist. Please sign up.',
      });
    }

    // Compare passwords
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(403).json({
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (e) {
    console.error('Error during signin:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = userRouter;
