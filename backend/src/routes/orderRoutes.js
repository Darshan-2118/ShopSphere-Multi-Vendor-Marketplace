const express = require("express");

const { createOrder } = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create order from customer's cart
router.post("/", protect, createOrder);

module.exports = router;
