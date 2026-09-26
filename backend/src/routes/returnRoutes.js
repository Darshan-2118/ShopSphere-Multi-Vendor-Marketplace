const express = require("express");

const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  createReturn,
  getMyReturns,
  approveReturn,
  rejectReturn,
} = require("../controllers/returnController");

// Customer creates a return request
router.post("/", protect, createReturn);

// Customer views their returns
router.get("/", protect, getMyReturns);

// Admin approves a return
router.put("/:returnId/approve", protect, authorize("ADMIN"), approveReturn);

// Admin rejects a return
router.put("/:returnId/reject", protect, authorize("ADMIN"), rejectReturn);

module.exports = router;
