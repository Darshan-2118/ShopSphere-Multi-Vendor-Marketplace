const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("CUSTOMER"), createOrder);

router.get("/", protect, authorize("CUSTOMER"), getMyOrders);

router.get("/seller", protect, authorize("SELLER"), getSellerOrders);

router.get("/:id", protect, authorize("CUSTOMER"), getOrderById);

module.exports = router;
