// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if token exists on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/Home");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-purple-600">
          BookCave
        </Link>

        {/* Nav Links */}
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-purple-600">
            Home
          </Link>

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
