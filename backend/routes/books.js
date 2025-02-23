const express = require("express");
const Book = require("../models/Books");

const router = express.Router();

// @route   POST /api/books
// @desc    Create a new book
router.post("/", async (req, res) => {
    try {
        const { title, author, description, category, publishedYear,price } = req.body;
        const newBook = new Book({ title, author, description, category, publishedYear,price });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @route   GET /api/books
// @desc    Get all books
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
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
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

module.exports = router;
