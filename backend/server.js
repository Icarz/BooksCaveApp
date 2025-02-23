const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bookRoutes = require("./routes/books");

// Load environment variables
dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors());         // Enable CORS
app.use("/api/books", bookRoutes);
// Connect to DB
const connectDB = require("./config/db");
connectDB();
// Import Routes
const authRoutes = require("./routes/authRoutes");

// Register Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Book Cave API is running...");
});
 // protected routes
const protectedRoutes = require("./routes/protected");
app.use("/api", protectedRoutes);

// Register Book Routes
app.use("/api/books", bookRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
