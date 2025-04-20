// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// Utility to check if user is logged in
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const Home = () => {
  const [books, setBooks] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loggedIn = isAuthenticated();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("/api/google-books?q=subject:fiction");
        setBooks(res.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    const fetchSavedBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedBooks(res.data.books);
      } catch (error) {
        console.error("Error fetching saved books:", error);
      }
    };

    fetchBooks();
    if (loggedIn) fetchSavedBooks();
  }, [loggedIn]);

  const handleSearch = async () => {
    try {
      const query = search ? `${search}` : "";
      const categoryQuery = category ? `+subject:${category}` : "";
      if (!query && !categoryQuery) return;

      setLoading(true);
      const res = await axios.get(
        `/api/google-books?q=${encodeURIComponent(query + categoryQuery)}`
      );
      setBooks(res.data.books);
      setLoading(false);
    } catch (err) {
      console.error("Search failed:", err);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSaveBook = async (bookId) => {
    try {
      const res = await axios.post(
        "/api/google-books/save",
        { volumeId: bookId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to save book to database.";
      setMessage(`⚠️ ${msg}`);
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Book Cave
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Discover, review, and share your favorite books with readers around
            the world.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/Auth"
              className="bg-indigo-600 border border-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              Join Now
            </a>
          </div>
        </div>
      </section>

      {/* Search + Category */}
      <section className="py-10 px-6 md:px-12 bg-gray-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full md:flex-1 px-4 py-2 border rounded shadow-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border rounded shadow-sm"
          >
            <option value="">All Categories</option>
            <option value="fiction">Fiction</option>
            <option value="history">History</option>
            <option value="science">Science</option>
          </select>
          <button
            onClick={handleSearch}
            className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>

        {message && (
          <div className="max-w-4xl mx-auto mt-4 text-center text-sm text-green-700 bg-green-100 border border-green-300 px-4 py-2 rounded">
            {message}
          </div>
        )}
      </section>

      {/* Saved Books Section */}
      {loggedIn && (
        <section className="py-10 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Your Saved Books
            </h2>
            {savedBooks.length === 0 ? (
              <p className="text-center text-gray-500">
                You haven't saved any books yet.
              </p>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {savedBooks.map((book, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded shadow hover:shadow-md transition"
                  >
                    <img
                      src={book.thumbnail || "https://via.placeholder.com/150"}
                      alt={book.title}
                      className="w-full h-60 object-cover mb-4 rounded"
                    />
                    <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      by {book.author || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {book.category || "General"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Google Books Results Section */}
      <section className="py-10 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-gray-100 p-4 rounded shadow hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <img
                  src={book.thumbnail || "https://via.placeholder.com/150"}
                  alt={book.title}
                  className="w-full h-60 object-cover mb-4 rounded"
                />
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {book.authors?.join(", ") || "Unknown author"}
                </p>
              </div>
              <button
                onClick={() => handleSaveBook(book.id)}
                className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Save to Library
              </button>
            </div>
          ))}
        </div>
        {loading && (
          <div className="text-center mt-10 text-gray-500">
            Loading books...
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
