import React, { useEffect, useState } from "react";
import axios from "axios";

const SavedBooks = () => {
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedBooks = async () => {
      try {
        const res = await axios.get("/api/google-books/saved");
        setSavedBooks(res.data.books);
      } catch (err) {
        console.error("Error fetching saved books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedBooks();
  }, []);

  return (
    <section className="py-10 px-6 md:px-12 bg-white">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Saved Books</h2>
  
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : savedBooks.length === 0 ? (
        <p className="text-center text-gray-500">You haven't saved any books yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {savedBooks.map((book, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded shadow hover:shadow-md transition"
            >
              {book.thumbnail ? (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="h-60 w-full object-contain mb-4 rounded"
                />
              ) : (
                <div className="h-60 bg-white flex items-center justify-center text-gray-500 mb-4">
                  <span className="text-sm italic">No cover available</span>
                </div>
              )}
  
              <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                by {book.author || "Unknown"}
              </p>
              <p className="text-xs text-gray-500">{book.category || "General"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
  
  );
};

export default SavedBooks;
