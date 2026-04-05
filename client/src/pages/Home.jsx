import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { useAuth } from "../AuthContext";
import { Search } from "lucide-react";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Fiction", value: "fiction" },
  { label: "Non-fiction", value: "nonfiction" },
  { label: "Mystery", value: "mystery" },
  { label: "Romance", value: "romance" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Science", value: "science" },
  { label: "History", value: "history" },
  { label: "Biography", value: "biography" },
  { label: "Philosophy", value: "philosophy" },
  { label: "Technology", value: "technology" },
  { label: "Self-Help", value: "self-help" },
  { label: "Health", value: "health" },
  { label: "Travel", value: "travel" },
  { label: "Poetry", value: "poetry" },
  { label: "Religion", value: "religion" },
  { label: "Art", value: "art" },
  { label: "Business", value: "business" },
  { label: "Education", value: "education" },
  { label: "Comics", value: "comics" },
];

const Home = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/google-books?q=subject:fiction");
        setBooks(res.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleSearch = async () => {
    const query = search || "";
    if (!query && !category) return;

    let q;
    if (query && category) {
      q = `${query}+subject:${category}`;
    } else if (category) {
      q = `subject:${category}`;
    } else {
      q = query;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `/api/google-books?q=${encodeURIComponent(q)}`
      );
      setBooks(res.data.books);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/google-books/save",
        { volumeId: bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: res.data.message, type: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save book.";
      setMessage({ text: msg, type: "error" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950/30 to-slate-950" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight tracking-tight">
            Your Personal{" "}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Book Cave
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
            Discover, save, and review your favourite reads in one place.
          </p>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-violet-500 transition text-sm"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-xl focus:outline-none focus:border-violet-500 transition sm:w-44 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          {!isAuthenticated && (
            <p className="mt-5 text-slate-500 text-sm">
              <a href="/auth" className="text-violet-400 hover:text-violet-300 transition">
                Sign in
              </a>{" "}
              to save books to your personal library
            </p>
          )}
        </div>
      </section>

      {/* Status message */}
      {message.text && (
        <div className={`mx-4 mt-4 max-w-xl lg:mx-auto px-4 py-3 rounded-xl text-sm text-center border ${
          message.type === "success"
            ? "bg-emerald-950/50 border-emerald-700/50 text-emerald-400"
            : "bg-red-950/50 border-red-700/50 text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      {/* Books Grid */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl h-96 animate-pulse border border-slate-700/50" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isLoggedIn={isAuthenticated}
                onSave={handleSaveBook}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
