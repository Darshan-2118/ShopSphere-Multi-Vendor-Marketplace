const express = require("express");

const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const { processReturnRefund } = require("../controllers/refundController");

// Admin processes an approved return refund
router.put("/:returnId", protect, authorize("ADMIN"), processReturnRefund);

module.exports = router;
