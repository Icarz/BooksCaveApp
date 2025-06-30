import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

const ReviewList = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/google-books/saved/${bookId}/reviews`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [bookId]);

  return (
    <div className="mt-4 space-y-3">
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No reviews yet.</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index} className="bg-white p-3 border rounded shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? "fill-yellow-400 stroke-yellow-500"
                      : "stroke-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-auto">
                {review.user?.name || "Anonymous"}
              </span>
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
