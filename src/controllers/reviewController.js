const Review = require('../models/reviewModel');
const Book = require('../models/bookModel');
const { isValidObjectId } = require('mongoose');

// POST /reviews - Create a new review for a book
exports.createReview = async (req, res) => {
  try {
    const { bookId, rating, review } = req.body;
    const reviewedBy = req.userId;  // Use the logged-in user's ID from the middleware

    // Validation checks
    if (!bookId || !rating) {
      return res.status(400).json({ status: false, message: "bookId and rating are mandatory." });
    }

    if (!isValidObjectId(bookId)) {
      return res.status(400).json({ status: false, message: "Invalid bookId." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ status: false, message: "Rating should be between 1 and 5." });
    }

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book || book.isDeleted) {
      return res.status(404).json({ status: false, message: "Book not found or deleted." });
    }

    // Create the review
    const reviewData = new Review({
      bookId,
      reviewedBy: reviewedBy || "Guest",  // Default to "Guest" if no user is logged in
      rating,
      review: review || "",  // If review is not provided, set to an empty string
    });

    // Save the review to the database
    await reviewData.save();

    // Update the review count in the book document
    book.reviews += 1;  // Increment the review count
    await book.save();

    res.status(201).json({ status: true, message: "Review created successfully", data: reviewData });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// PUT /reviews/:reviewId - Update an existing review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, review } = req.body;

    // Check if the reviewId is valid
    if (!isValidObjectId(reviewId)) {
      return res.status(400).json({ status: false, message: "Invalid reviewId." });
    }

    // Find the review
    const existingReview = await Review.findById(reviewId);
    if (!existingReview || existingReview.isDeleted) {
      return res.status(404).json({ status: false, message: "Review not found or deleted." });
    }

    // Ensure the logged-in user is the same as the one who created the review
    if (existingReview.reviewedBy !== req.userId) {
      return res.status(403).json({ status: false, message: "You can only update your own reviews." });
    }

    // Validate the rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ status: false, message: "Rating should be between 1 and 5." });
    }

    // Update the review fields
    existingReview.rating = rating || existingReview.rating;
    existingReview.review = review || existingReview.review;

    // Save the updated review
    await existingReview.save();

    res.status(200).json({ status: true, message: "Review updated successfully", data: existingReview });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// GET /reviews/:bookId - Get all reviews for a book
exports.getReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!isValidObjectId(bookId)) {
      return res.status(400).json({ status: false, message: "Invalid bookId." });
    }

    const reviews = await Review.find({ bookId, isDeleted: false });
    if (reviews.length === 0) {
      return res.status(404).json({ status: false, message: "No reviews found for this book." });
    }

    res.status(200).json({ status: true, message: "Reviews list", data: reviews });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// DELETE /reviews/:reviewId - Delete a review (soft delete)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Check if the reviewId is valid
    if (!isValidObjectId(reviewId)) {
      return res.status(400).json({ status: false, message: "Invalid reviewId." });
    }

    // Find the review
    const existingReview = await Review.findById(reviewId);
    if (!existingReview || existingReview.isDeleted) {
      return res.status(404).json({ status: false, message: "Review not found or already deleted." });
    }

    // Ensure the logged-in user is the same as the one who created the review
    if (existingReview.reviewedBy !== req.userId) {
      return res.status(403).json({ status: false, message: "You can only delete your own reviews." });
    }

    // Mark the review as deleted (soft delete)
    existingReview.isDeleted = true;
    await existingReview.save();

    // Decrement the review count in the associated book
    const book = await Book.findById(existingReview.bookId);
    if (book) {
      book.reviews -= 1;  // Decrease the review count
      await book.save();
    }

    res.status(200).json({ status: true, message: "Review deleted successfully." });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
