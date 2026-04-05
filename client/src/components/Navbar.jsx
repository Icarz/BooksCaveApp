import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { BookOpen, LogOut, Bookmark, Home } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-violet-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            BookCave
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition text-sm"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          {isAuthenticated && (
            <Link
              to="/saved"
              className="flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition text-sm"
            >
              <Bookmark className="h-4 w-4" />
              My Library
            </Link>
          )}

          {!isAuthenticated ? (
            <Link
              to="/auth"
              className="ml-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition"
            >
              Sign In
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 ml-2 px-3 py-2 text-slate-300 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition text-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
