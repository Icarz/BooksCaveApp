const express = require("express");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Book = require("../models/Books");

const router = express.Router();

// Add book to favorites
router.post("/:bookId", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const book = await Book.findById(req.params.bookId);
        
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (user.favorites.includes(req.params.bookId)) {
            return res.status(400).json({ message: "Book already in favorites" });
        }

        user.favorites.push(req.params.bookId);
        await user.save();
        
        res.json({ message: "Book added to favorites", favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove book from favorites
router.delete("/:bookId", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.favorites = user.favorites.filter(fav => fav.toString() !== req.params.bookId);
        await user.save();

        res.json({ message: "Book removed from favorites", favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user’s favorite books
router.get("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("favorites");
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
