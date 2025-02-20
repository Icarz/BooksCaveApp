const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    books: [{ 
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" }, 
        quantity: { type: Number, required: true } 
    }],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Shipped", "Delivered"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
