import { BookOpen, Calendar, Save } from "lucide-react";

const BookCard = ({ book, isLoggedIn, onSave }) => {
  const truncate = (text, length = 100) =>
    text?.length > length ? text.slice(0, length) + "..." : text;

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-0.5">
      {/* Cover */}
      <div className="relative overflow-hidden bg-slate-800 h-56 flex items-center justify-center">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <BookOpen className="h-16 w-16 text-slate-600" />
        )}
        {book.categories?.[0] && (
          <div className="absolute top-2 right-2 bg-violet-600/90 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
            {book.categories[0].split(" ")[0]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-violet-400 text-xs mb-2">
          {book.authors?.join(", ") || "Unknown author"}
        </p>

        {book.publishedDate && (
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
            <Calendar className="h-3 w-3" />
            {book.publishedDate.substring(0, 4)}
          </div>
        )}

        {book.description && (
          <p className="text-slate-400 text-xs leading-relaxed flex-1">
            {truncate(book.description)}
          </p>
        )}

        {isLoggedIn && (
          <button
            onClick={() => onSave(book.id)}
            className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-violet-600/20 hover:bg-violet-600 border border-violet-600/40 hover:border-violet-600 text-violet-400 hover:text-white rounded-xl text-xs font-medium transition-all duration-200"
          >
            <Save className="h-3.5 w-3.5" />
            Save to Library
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
