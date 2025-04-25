import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import Navbar from "./components/Navbar";
import SavedBooks from "./pages/SavedBooks";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:id" element={<BookDetail />} />
        {/* <Route path="/saved" element={<SavedBooks />} /> */}
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedBooks />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer/>
      
    </>
  );
}

export default App;
