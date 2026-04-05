import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

const ReviewList = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `/api/google-books/saved/${bookId}/reviews`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [bookId]);

  if (reviews.length === 0) {
    return <p className="text-xs text-slate-500 italic mt-3">No reviews yet — be the first!</p>;
  }

  return (
    <div className="mt-4 space-y-2.5">
      {reviews.map((review, index) => (
        <div key={index} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < review.rating
                      ? "fill-yellow-400 stroke-yellow-400"
                      : "stroke-slate-600 fill-transparent"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500">{review.user?.name || "Anonymous"}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
