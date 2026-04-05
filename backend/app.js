const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/protected"));
app.use("/api/google-books", require("./routes/googleBooks"));

app.get("/", (req, res) => {
  res.json({ message: "Book Cave API is running...", status: "success" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

module.exports = app;
