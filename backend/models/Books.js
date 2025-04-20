const mongoose = require("mongoose");

// adding the user review models
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    coverImage: { type: String },
    category: { type: String, required: true },
    publishedYear: { type: Number, required: true },
    reviews: [reviewSchema], // Array of reviews
    averageRating: { type: Number, default: 0 },
    thumbnail: { type: String },
    infoLink: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
