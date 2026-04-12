import { useEffect, useState } from "react";
import axios from "axios";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { BookOpen, Trash2, Star, MessageSquare, Library } from "lucide-react";
import { useAuth } from "../AuthContext";

const SavedBooks = () => {
  const { isAuthenticated } = useAuth();
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <Library className="h-20 w-20 text-slate-700 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Your Library Awaits</h2>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            Log in to access your personal library and see all your saved books.
          </p>
          <a
            href="/auth"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition text-sm"
          >
            Log in to see your library
          </a>
        </div>
      </section>
    );
  }

  useEffect(() => {
    const fetchSavedBooks = async () => {
      try {
        const res = await axios.get("/api/google-books/saved", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSavedBooks(res.data.books || []);
      } catch {
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSavedBooks((prev) => prev.filter((book) => book._id !== bookId));
      if (expandedBook === bookId) setExpandedBook(null);
    } catch {
      alert("Could not delete the book. Please try again.");
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-950 pt-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 h-10 w-48 bg-slate-800 rounded-xl animate-pulse" />
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl h-80 animate-pulse border border-slate-700/50" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-950 pt-24 px-4 md:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white">My Library</h2>
          <p className="text-slate-400 mt-1 text-sm">
            {savedBooks.length} {savedBooks.length === 1 ? "book" : "books"} saved
          </p>
        </div>

        {error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : savedBooks.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-6">Your library is empty</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition text-sm"
            >
              Browse Books
            </a>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {savedBooks.map((book) => (
              <div
                key={book._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-slate-700 transition-all"
              >
                {/* Cover */}
                <div className="bg-slate-800 h-52 flex items-center justify-center overflow-hidden">
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-14 w-14 text-slate-600" />
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-violet-400 text-xs mb-1">{book.author || "Unknown"}</p>
                  <p className="text-slate-500 text-xs mb-3">{book.category || "General"}</p>

                  {book.averageRating > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 stroke-yellow-400" />
                      <span className="text-yellow-400 text-xs font-medium">
                        {book.averageRating.toFixed(1)}
                      </span>
                      <span className="text-slate-500 text-xs">
                        ({book.reviews?.length || 0})
                      </span>
                    </div>
                  )}

                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() =>
                        setExpandedBook(expandedBook === book._id ? null : book._id)
                      }
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-600/30 text-violet-400 text-xs rounded-lg transition"
                    >
                      <MessageSquare className="h-3 w-3" />
                      {expandedBook === book._id ? "Hide" : "Reviews"}
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="p-1.5 bg-red-950/30 hover:bg-red-950/60 border border-red-700/30 text-red-400 rounded-lg transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {expandedBook === book._id && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <ReviewForm bookId={book._id} onReviewAdded={() => {}} />
                      <ReviewList bookId={book._id} />
                    </div>
                  )}
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
