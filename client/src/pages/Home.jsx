// src/pages/Home.jsx
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-100 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">📚 Book Cave</h1>
        <nav className="space-x-4">
          <a href="/" className="text-gray-700 hover:text-black">Home</a>
          <a href="/login" className="text-gray-700 hover:text-black">Login</a>
          <a href="/register" className="text-gray-700 hover:text-black">Register</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Discover Your Next Favorite Book</h2>
        <p className="text-lg">Search, review, and save books you love.</p>
      </section>

      {/* Search & Filters */}
      <section className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by title or author"
            className="p-2 border border-gray-300 rounded"
          />
          <select className="p-2 border border-gray-300 rounded">
            <option value="">All Categories</option>
            <option value="Fiction">Fiction</option>
            <option value="Science">Science</option>
          </select>
          <select className="p-2 border border-gray-300 rounded">
            <option value="">Sort by</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </section>

      {/* Book List */}
      <section className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Example Book Card */}
          <div className="border rounded shadow hover:shadow-lg p-4">
            <img
              src="https://via.placeholder.com/150"
              alt="Book Cover"
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="font-semibold text-lg">Book Title</h3>
            <p className="text-sm text-gray-600">Author Name</p>
            <p className="text-yellow-500 text-sm mt-1">⭐ 4.5</p>
            <button className="mt-2 text-indigo-600 hover:underline">View Details</button>
          </div>
        </div>
      </section>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Previous</button>
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Next</button>
      </div>

      {/* Footer */}
      <footer className="text-center p-4 mt-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} Book Cave. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
