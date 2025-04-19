// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("/api/google-books?q=harry+potter");
        setBooks(res.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/google-books/search?q=${search}`);
      setBooks(res.data.books);
    } catch (err) {
      console.error("Search failed:", err);
    }
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
              href="/register"
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
            {/* Add more categories if needed */}
          </select>
          <button
            onClick={handleSearch}
            className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-10 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-gray-100 p-4 rounded shadow hover:shadow-md transition"
            >
              <img
                src={book.thumbnail || "https://via.placeholder.com/150"}
                alt={book.title}
                className="w-full h-60 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">
                {book.authors?.join(", ") || "Unknown author"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
