import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // 👈 import useAuth

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth(); // 👈 use context values

  const handleLogout = () => {
    logout(); // 👈 use the context logout
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-purple-600">
          BookCave
        </Link>

        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-purple-600">
            Home
          </Link>

          {isAuthenticated && (
            <Link to="/saved" className="text-gray-700 hover:text-purple-600">
              Your Saved Books
            </Link>
          )}

          {!isAuthenticated ? (
            <Link to="/Auth" className="text-gray-700 hover:text-purple-600">
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
