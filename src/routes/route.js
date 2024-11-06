const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');
const authenticateUser = require('../middlewares/authenticateUser.js');
const reviewController = require('../controllers/reviewController.js');

// User Routes
router.post('/register', userController.registerUser);  // User registration
router.post('/login', userController.loginUser);  // User login

// Book Routes
router.post('/books', authenticateUser, bookController.createBook);  // Create a new book (protected route)
router.get('/books', bookController.getBooks);  // Get all books
router.get('/books/:bookId', bookController.getBookById);  // Get a single book by ID
router.put('/books/:bookId', authenticateUser, bookController.updateBook);  // Update a book (protected route)
router.delete('/books/:bookId', authenticateUser, bookController.deleteBook);  // Delete a book (soft delete) (protected route)

// Review Routes
router.post('/reviews', authenticateUser, reviewController.createReview);  // Create a new review for a book (protected route)
router.get('/reviews/:bookId', reviewController.getReviews);  // Get all reviews for a book
router.put('/reviews/:reviewId', authenticateUser, reviewController.updateReview);  // Update a review (protected route)
router.delete('/reviews/:reviewId', authenticateUser, reviewController.deleteReview);  // Delete a review (soft delete) (protected route)

module.exports = router;
