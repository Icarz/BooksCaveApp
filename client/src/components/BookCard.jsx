import React from "react";

const BookCard = ({ book, isLoggedIn, onSave }) => {
  const handleSave = () => {
    if (onSave && typeof onSave === "function") {
      onSave(book.id);
    }
  };

  const truncate = (text, length = 120) => {
    return text?.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow hover:shadow-md transition flex flex-col justify-between">
      <div>
        <img
          src={book.thumbnail || "https://via.placeholder.com/150"}
          alt={book.title}
          className="w-full h-60 object-cover mb-4 rounded"
        />
        <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-1">
          {book.authors?.join(", ") || "Unknown author"}
        </p>

        {book.publishedYear && (
          <p className="text-xs text-gray-500">
            Published: {book.publishedYear}
          </p>
        )}

        {book.category && (
          <p className="text-xs text-gray-500">Category: {book.category}</p>
        )}

        {book.description && (
          <p className="text-xs text-gray-600 mt-2">
            {truncate(book.description)}
          </p>
        )}
      </div>

      {isLoggedIn && (
        <button
          onClick={handleSave}
          className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm"
        >
          Save to Library
        </button>
      )}
    </div>
  );
};

export default BookCard;
