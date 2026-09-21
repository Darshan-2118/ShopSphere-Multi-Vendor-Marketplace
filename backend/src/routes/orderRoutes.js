const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);
router.get("/seller", protect, getSellerOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;
    