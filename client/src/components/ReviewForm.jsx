import { useState } from "react";
import axios from "axios";
import { Star, Send } from "lucide-react";

const ReviewForm = ({ bookId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setMessage({ text: "Please select a rating", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(
        `/api/google-books/saved/${bookId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMessage({ text: "Review submitted!", type: "success" });
      setRating(0);
      setComment("");
      onReviewAdded();
    } catch {
      setMessage({ text: "Failed to submit review", type: "error" });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Leave a Review</p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(0)}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              value <= (hovered || rating)
                ? "fill-yellow-400 stroke-yellow-400"
                : "stroke-slate-600 fill-transparent"
            }`}
          />
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full p-2.5 bg-slate-800 border border-slate-700 text-white text-xs rounded-xl resize-none focus:outline-none focus:border-violet-500 transition placeholder-slate-500"
        rows={3}
        required
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs rounded-lg transition"
        >
          <Send className="h-3 w-3" />
          {submitting ? "Submitting..." : "Submit"}
        </button>
        {message.text && (
          <p className={`text-xs ${message.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
