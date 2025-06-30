import { useEffect, useState } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

const SavedBooks = () => {
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedBooks = async () => {
      try {
        const res = await axios.get("/api/google-books/saved", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSavedBooks(res.data.books || []);
      } catch (err) {
        console.error("Error fetching saved books:", err);
        setError("Failed to load your saved books.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedBooks();
  }, []);

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`/api/google-books/saved/${bookId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSavedBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookId)
      );
    } catch (err) {
      console.error("Failed to delete book:", err);
      alert("Could not delete the book. Please try again.");
    }
  };

  return (
    <section className="py-10 px-6 md:px-12 bg-white min-h-screen pt-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-700">
          Your Saved Books
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : savedBooks.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="mb-4">You haven't saved any books yet.</p>
            <a
              href="/"
              className="inline-block text-purple-600 hover:underline"
            >
              Browse books to get started →
            </a>
          </div>
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
                <p className="text-xs text-gray-500 mb-2">
                  {book.category || "General"}
                </p>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>

                {/* ⭐ Review Form & Reviews */}
                <div className="mt-6 border-t pt-4">
                  <ReviewForm bookId={book._id} onReviewAdded={() => {}} />
                  <ReviewList bookId={book._id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SavedBooks;
