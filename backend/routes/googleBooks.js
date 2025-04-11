const express = require("express");
const axios = require("axios");
const router = express.Router();
const Book = require("../models/Books");

// GET /api/google-books?q=searchTerm
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

    // Filter books that are truly in English
    const books = items
      .filter((item) => item.volumeInfo.language === "en") // ensure language field is explicitly English
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

// POST /api/google-books/save
router.post("/save", async (req, res) => {
  const { volumeId } = req.body;

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
    const publishedYear = parseInt(volume.publishedDate?.substring(0, 4)) || 0;
    const price = 0; // Google Books API usually doesn't provide price info

    // Check if the book already exists in the DB
    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
      return res.status(409).json({
        message: "Book already exists in the database",
        book: existingBook,
      });
    }

    // Save the new book
    const newBook = new Book({
      title,
      author,
      description,
      category,
      publishedYear,
      price,
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

// ✅ Correct export
module.exports = router;
