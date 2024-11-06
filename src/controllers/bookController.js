const Book = require('../models/bookModel');  // Importing the Book model
const User = require('../models/userModel');  // Importing the User model for validation
const { isValidObjectId } = require('mongoose');  // For validating MongoDB ObjectId

// POST /books - Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body;

    // Validation checks
    if (!title || !excerpt || !userId || !ISBN || !category || !subcategory || !releasedAt) {
      return res.status(400).json({ status: false, message: "All fields are mandatory." });
    }

    // Check if user exists
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ status: false, message: "Invalid userId." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    // Create the book
    const book = new Book({
      title,
      excerpt,
      userId,
      ISBN,
      category,
      subcategory,
      releasedAt,
    });

    // Save the book to the database
    await book.save();
    res.status(201).json({ status: true, message: "Book created successfully", data: book });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// GET /books - Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({ isDeleted: false })
      .select('_id title excerpt userId category releasedAt reviews');  // Select only necessary fields
    
    if (books.length === 0) {
      return res.status(404).json({ status: false, message: "No books found." });
    }

    res.status(200).json({ status: true, message: 'Books list', data: books });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// GET /books/:bookId - Get a single book by its ID
exports.getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!isValidObjectId(bookId)) {
      return res.status(400).json({ status: false, message: "Invalid bookId." });
    }

    const book = await Book.findById(bookId).populate('reviews');
    if (!book || book.isDeleted) {
      return res.status(404).json({ status: false, message: "Book not found." });
    }

    res.status(200).json({ status: true, message: "Book details", data: book });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// PUT /books/:bookId - Update a book
exports.updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, excerpt, ISBN, category, subcategory, releasedAt } = req.body;

    if (!isValidObjectId(bookId)) {
      return res.status(400).json({ status: false, message: "Invalid bookId." });
    }

    const book = await Book.findById(bookId);
    if (!book || book.isDeleted) {
      return res.status(404).json({ status: false, message: "Book not found." });
    }

    // Ensure unique constraints
    const existingBook = await Book.findOne({ ISBN, _id: { $ne: bookId } });
    if (existingBook) {
      return res.status(400).json({ status: false, message: "Book with this ISBN already exists." });
    }

    // Update book fields
    book.title = title || book.title;
    book.excerpt = excerpt || book.excerpt;
    book.ISBN = ISBN || book.ISBN;
    book.category = category || book.category;
    book.subcategory = subcategory || book.subcategory;
    book.releasedAt = releasedAt || book.releasedAt;

    await book.save();
    res.status(200).json({ status: true, message: "Book updated successfully", data: book });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// DELETE /books/:bookId - Delete a book (soft delete)
exports.deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!isValidObjectId(bookId)) {
      return res.status(400).json({ status: false, message: "Invalid bookId." });
    }

    const book = await Book.findById(bookId);
    if (!book || book.isDeleted) {
      return res.status(404).json({ status: false, message: "Book not found." });
    }

    // Soft delete the book
    book.isDeleted = true;
    book.deletedAt = Date.now();
    await book.save();

    res.status(200).json({ status: true, message: "Book deleted successfully", data: book });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};