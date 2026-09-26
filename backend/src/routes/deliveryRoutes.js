const express = require("express");

const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const { updateDeliveryStatus } = require("../controllers/deliveryController");

// Delivery partner updates delivery status
router.put("/:id", protect, authorize("DELIVERY"), updateDeliveryStatus);

module.exports = router;
