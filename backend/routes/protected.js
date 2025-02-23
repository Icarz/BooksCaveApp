const express = require("express");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/protected", protect, (req, res) => {
  res.json({ message: "Welcome to your dashboard", userId: req.user.id });
});

module.exports = router;
