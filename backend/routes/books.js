const express = require("express");
const Book = require("../models/Books");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/books
// @desc    Create a new book
router.post("/", async (req, res) => {
  try {
    const { title, author, description, category, publishedYear, price } =
      req.body;
    const newBook = new Book({
      title,
      author,
      description,
      category,
      publishedYear,
      price,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   GET /api/books
// @desc    Get all books with pagination & search
router.get("/", async (req, res) => {
  try {
    let { search, page, limit } = req.query;

    page = parseInt(page) || 1; // Default to page 1
    limit = parseInt(limit) || 10; // Default to 10 books per page
    const skip = (page - 1) * limit;

    let query = {};

    // Case-insensitive search for title, author, or category
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };
    }

    const books = await Book.find(query).skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments(query);

    res.json({
      totalBooks,
      page,
      totalPages: Math.ceil(totalBooks / limit),
      books,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/books/:id
// @desc    Get a single book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/books/:id
// @desc    Update a book by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook) return res.status(404).json({ error: "Book not found" });
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/books/:id/reviews
// @desc    Add a review to a book
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Create a new review
    const review = {
      user: req.user._id, // Get user ID from auth middleware
      rating,
      comment,
    };

    book.reviews.push(review);
    book.averageRating =
      book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length;

    await book.save();
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/books/:id/reviews
// @desc    Get all reviews for a book
router.get("/:id/reviews", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "reviews.user",
      "name email"
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book.reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
