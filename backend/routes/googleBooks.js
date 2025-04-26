const express = require("express");
const axios = require("axios");
const router = express.Router();
const Book = require("../models/Books");
const { protect } = require("../middleware/auth");

// 📚 SEARCH GOOGLE BOOKS
router.get("/", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: "Please provide a search query" });
  }

  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}&key=${apiKey}&maxResults=20&langRestrict=en`;

    const response = await axios.get(googleBooksUrl);

    const items = response.data.items || [];

    const books = items
      .filter((item) => item.volumeInfo.language === "en")
      .map((item) => {
        const volume = item.volumeInfo;
        return {
          id: item.id,
          title: volume.title,
          authors: volume.authors || [],
          description: volume.description || "No description available",
          publishedDate: volume.publishedDate,
          categories: volume.categories || [],
          thumbnail: volume.imageLinks?.thumbnail || null,
          infoLink: volume.infoLink,
        };
      });

    res.json({ books });
  } catch (error) {
    console.error("Error fetching from Google Books API:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch books from Google Books API" });
  }
});

// 💾 SAVE BOOK TO DATABASE
router.post("/save", protect, async (req, res) => {
  const volumeId = req.body.volumeId || req.body.id;
  if (!volumeId) {
    return res
      .status(400)
      .json({ message: "Missing volumeId in request body" });
  }

  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes/${volumeId}?key=${apiKey}`;
    const response = await axios.get(url);
    const volume = response.data.volumeInfo;

    const title = volume.title;
    const author = volume.authors ? volume.authors[0] : "Unknown";
    const description = volume.description || "No description available";
    const category = volume.categories ? volume.categories[0] : "General";
    const publishedYear = volume.publishedDate
      ? parseInt(volume.publishedDate.substring(0, 4))
      : 0;
    const validPublishedYear = isNaN(publishedYear) ? 0 : publishedYear;
    const price = 0;
    const thumbnail = volume.imageLinks?.thumbnail || null;
    const infoLink = volume.infoLink || null;
    const userId = req.user.id;

    const existingBook = await Book.findOne({ volumeId });
    if (existingBook) {
      return res.status(409).json({
        message: "Book already exists in the database",
        book: existingBook,
      });
    }

    const newBook = new Book({
      title,
      author,
      description,
      category,
      publishedYear: validPublishedYear,
      price,
      thumbnail,
      infoLink,
      volumeId,
      userId,
    });

    await newBook.save();
    res.status(201).json({ message: "Book saved to database", book: newBook });
  } catch (error) {
    console.error("Error saving Google Book:", error.message);
    res
      .status(500)
      .json({ message: "Failed to save book from Google Books API" });
  }
});

// 📖 GET SAVED BOOKS
router.get("/saved", protect, async (req, res) => {
  try {
    let { search, page, limit, category, sort } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    let query = { userId: req.user.id }; // ✅ Only fetch books saved by the current user

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    let sortOptions = {};
    if (sort) {
      const sortFields = {
        price: "price",
        title: "title",
        year: "publishedYear",
      };
      const direction = sort.startsWith("-") ? -1 : 1;
      const field = sort.replace("-", "");
      if (sortFields[field]) {
        sortOptions[sortFields[field]] = direction;
      }
    }

    const books = await Book.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalBooks = await Book.countDocuments(query);

    res.json({
      totalBooks,
      page,
      totalPages: Math.ceil(totalBooks / limit),
      books, // ✅ this is what Home.jsx expects
    });
  } catch (error) {
    console.error("Error fetching saved books:", error.message);
    res.status(500).json({ message: "Failed to fetch saved books" });
  }
});

// 📘 GET A SINGLE BOOK
router.get("/saved/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✏️ UPDATE A BOOK
router.put("/saved/:id", async (req, res) => {
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

// ❌ DELETE A BOOK
router.delete("/saved/:id",protect, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ⭐ ADD A REVIEW
router.post("/saved/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const review = {
      user: req.user._id,
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

// ⭐ GET REVIEWS FOR A BOOK
router.get("/saved/:id/reviews", protect, async (req, res) => {
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