// src/components/Footer.jsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-purple-400">BookCave</h2>
          <p className="mt-2 text-gray-400">
            Discover, save, and review your favorite reads. BookCave is your
            personal book sanctuary.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-purple-300">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/saved" className="hover:text-white">Saved Books</Link></li>
            <li><Link to="/auth" className="hover:text-white">Login</Link></li>
          </ul>
        </div>

        {/* Socials (optional) */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-purple-300">Connect</h3>
          <p className="text-gray-400">Follow us on social media</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-white">📘</a>
            <a href="#" className="text-gray-400 hover:text-white">🐦</a>
            <a href="#" className="text-gray-400 hover:text-white">📸</a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-10 text-sm border-t border-gray-700 pt-6">
        &copy; {new Date().getFullYear()} BookCave. All rights reserved Icarus and Co.
      </div>
    </footer>
  );
};

export default Footer;
