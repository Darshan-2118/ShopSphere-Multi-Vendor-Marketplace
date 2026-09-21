const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get customer's cart
router.get("/", protect, getCart);

// Add product to cart
router.post("/", protect, addToCart);

// Update product quantity
router.put("/:productId", protect, updateCartItem);

// Remove product from cart
router.delete("/:productId", protect, removeCartItem);

module.exports = router;