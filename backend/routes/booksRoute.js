const express = require('express');
const { Book } = require('../models/bookModel');
const { auth } = require('./auth');

const router = express.Router();

// Save a New Book
router.post('/books', auth, async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;

    if (!title || !author || !publishYear) {
      return res.status(400).json({ message: 'Please provide title, author, and publishYear.' });
    }

    const newBook = await Book.create({
      title,
      author,
      publishYear,
      user: req.user._id,
    });

    return res.status(201).json(newBook);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error while creating the book.' });
  }
});

// Get All Books
router.get('/books', auth, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }); 
    res.status(200).json({ count: books.length, data: books });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error while fetching books.' });
  }
});

// Get a Single Book
router.get('/books/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id }); 
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    res.status(200).json(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error while fetching the book.' });
  }
});

// Update a Book
router.put('/books/:id', auth, async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;

    if (!title || !author || !publishYear) {
      return res.status(400).json({ message: 'Please provide title, author, and publishYear.' });
    }

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, author, publishYear },
      { new: true }
    );

    if (!book) return res.status(404).json({ message: 'Book not found.' });

    res.status(200).json({ message: 'Book updated successfully.', book });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error while updating the book.' });
  }
});

// Delete a Book
router.delete('/books/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    res.status(200).json({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error while deleting the book.' });
  }
});

module.exports = router;
