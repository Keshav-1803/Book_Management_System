const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ISBN: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: [String],
    required: true,
  },
  reviews: {
    type: Number,
    default: 0,
    comment: "Holds number of reviews of this book",
  },
  deletedAt: {
    type: Date,
    match: /^\d{4}-\d{2}-\d{2}$/,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  releasedAt: {
    type: Date,
    match: /^\d{4}-\d{2}-\d{2}$/,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {timestamps: true});

module.exports = mongoose.model("Book", bookSchema);