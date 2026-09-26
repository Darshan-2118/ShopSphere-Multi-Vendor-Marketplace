const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getWallet,
  getTransactions,
  settleOrder,
} = require("../controllers/walletController");

// Get logged-in seller's wallet
router.get("/", protect, getWallet);

// Get logged-in seller's transaction history
router.get("/transactions", protect, getTransactions);

// Settle a seller order
router.post("/settle/:sellerOrderId", protect, settleOrder);

module.exports = router;
