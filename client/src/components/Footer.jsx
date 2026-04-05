import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-16 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-violet-400" />
            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              BookCave
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your personal book sanctuary. Discover, save, and review your favourite reads.
          </p>
        </div>

        <div>
          <h3 className="text-slate-300 font-semibold text-sm mb-4 uppercase tracking-wide">Quick Links</h3>
          <ul className="space-y-2.5 text-slate-500 text-sm">
            <li><Link to="/" className="hover:text-violet-400 transition">Home</Link></li>
            <li><Link to="/saved" className="hover:text-violet-400 transition">My Library</Link></li>
            <li><Link to="/auth" className="hover:text-violet-400 transition">Sign In</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-slate-300 font-semibold text-sm mb-4 uppercase tracking-wide">Connect</h3>
          <div className="flex gap-3">
            {[FaInstagram, FaFacebook, FaTwitter, FaLinkedin].map((Icon, i) => (
              <button
                key={i}
                className="w-9 h-9 flex items-center justify-center bg-slate-800 hover:bg-violet-600 border border-slate-700 hover:border-violet-600 text-slate-400 hover:text-white rounded-xl transition-all duration-200"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-slate-600 text-xs">
          &copy; {new Date().getFullYear()} BookCave. All rights reserved.
        </p>
        <p className="text-slate-600 text-xs">Built by Icarus and Co.</p>
      </div>
    </footer>
  );
};

export default Footer;
