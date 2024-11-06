const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  reviewedBy: {
    type: String,
    default: "Guest",
    required: true,
  },
  reviewedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    optional: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {timestamps: true});

module.exports = mongoose.model("Review", reviewSchema);