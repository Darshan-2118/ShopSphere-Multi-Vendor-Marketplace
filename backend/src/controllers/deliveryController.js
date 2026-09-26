const SellerOrder = require("../models/SellerOrder");

// Update seller order delivery status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const allowedStatuses = [
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid delivery status",
        allowedStatuses,
      });
    }

    const sellerOrder = await SellerOrder.findById(id);

    if (!sellerOrder) {
      return res.status(404).json({
        message: "Seller order not found",
      });
    }

    if (sellerOrder.status === "REFUNDED") {
      return res.status(400).json({
        message: "Refunded orders cannot be updated",
      });
    }

    if (sellerOrder.status === "CANCELLED") {
      return res.status(400).json({
        message: "Cancelled orders cannot be updated",
      });
    }

    sellerOrder.status = status;

    await sellerOrder.save();

    res.status(200).json({
      message: "Delivery status updated successfully",
      sellerOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update delivery status",
      error: error.message,
    });
  }
};

module.exports = {
  updateDeliveryStatus,
};
