const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors());         // Enable CORS

// Test route
app.get("/", (req, res) => {
    res.send("Book Cave API is running...");
});

const connectDB = require("./config/db");
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// testing create route

const User = require("./models/User");

app.get("/test-user", async (req, res) => {
    try {
        const newUser = await User.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "hasheddoe"
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

