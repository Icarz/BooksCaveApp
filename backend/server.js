const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/protected")); // Protected routes
app.use("/api/google-books", require("./routes/googleBooks")); // All book functionality here

// Test route
app.get("/", (req, res) => {
  res.send("Book Cave API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
