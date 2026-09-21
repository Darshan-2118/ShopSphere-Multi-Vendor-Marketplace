const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("CUSTOMER"), getCart);

router.post("/", protect, authorize("CUSTOMER"), addToCart);

router.put("/:productId", protect, authorize("CUSTOMER"), updateCartItem);

router.delete("/:productId", protect, authorize("CUSTOMER"), removeCartItem);

module.exports = router;
