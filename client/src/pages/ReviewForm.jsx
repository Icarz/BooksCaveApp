import { useState } from "react";
import axios from "axios";
import { Star } from "lucide-react"; // Using lucide-react for stars

const ReviewForm = ({ bookId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/google-books/saved/${bookId}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("✅ Review submitted!");
      setRating(0);
      setComment("");
      onReviewAdded();
    } catch {
      setMessage("❌ Error submitting review");
    }
  };

  const handleStarClick = (value) => setRating(value);

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-3">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            onClick={() => handleStarClick(value)}
            className={`h-6 w-6 cursor-pointer ${
              value <= rating ? "fill-yellow-400 stroke-yellow-500" : "stroke-gray-400"
            }`}
          />
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review here..."
        className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
        rows={3}
        required
      />

      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 text-sm"
        >
          Submit Review
        </button>
        {message && (
          <p className="text-xs text-green-600 ml-2">
            {message}
          </p>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
