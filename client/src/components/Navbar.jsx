
// src/components/Navbar.jsx
import { Link } from "react-router-dom";

const Navbar = () => {
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
          <Link to="/login" className="text-gray-700 hover:text-purple-600">
            Login
          </Link>
          <Link to="/register" className="text-gray-700 hover:text-purple-600">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
