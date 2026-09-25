const Return = require("../models/Return");
const SellerOrder = require("../models/SellerOrder");
const Order = require("../models/Order");

// Create a return request
const createReturn = async (req, res) => {
  try {
    const { sellerOrderId, reason } = req.body;

    if (!sellerOrderId || !reason) {
      return res.status(400).json({
        message: "sellerOrderId and reason are required",
      });
    }

    const sellerOrder = await SellerOrder.findById(sellerOrderId);

    if (!sellerOrder) {
      return res.status(404).json({
        message: "Seller order not found",
      });
    }

    const parentOrder = await Order.findById(sellerOrder.parentOrderId);

    if (!parentOrder) {
      return res.status(404).json({
        message: "Parent order not found",
      });
    }

    // Only the customer who owns the parent order can request a return
    if (parentOrder.customerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to return this order",
      });
    }

    if (sellerOrder.status === "CANCELLED") {
      return res.status(400).json({
        message: "Cancelled orders cannot be returned",
      });
    }

    const existingReturn = await Return.findOne({
      sellerOrderId,
      status: {
        $in: ["REQUESTED", "APPROVED"],
      },
    });

    if (existingReturn) {
      return res.status(400).json({
        message: "A return request already exists for this seller order",
      });
    }

    const returnRequest = await Return.create({
      sellerOrderId,
      customerId: req.user.id,
      reason,
    });

    res.status(201).json({
      message: "Return request created successfully",
      returnRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create return request",
      error: error.message,
    });
  }
};

// Get customer's return requests
const getMyReturns = async (req, res) => {
  try {
    const returns = await Return.find({
      customerId: req.user.id,
    })
      .populate("sellerOrderId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      returns,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch return requests",
      error: error.message,
    });
  }
};

// Approve a return request - Admin only
const approveReturn = async (req, res) => {
  try {
    const { returnId } = req.params;

    const returnRequest = await Return.findById(returnId);

    if (!returnRequest) {
      return res.status(404).json({
        message: "Return request not found",
      });
    }

    if (returnRequest.status !== "REQUESTED") {
      return res.status(400).json({
        message: `Return request cannot be approved from ${returnRequest.status} status`,
      });
    }

    returnRequest.status = "APPROVED";
    await returnRequest.save();

    res.status(200).json({
      message: "Return request approved successfully",
      returnRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve return request",
      error: error.message,
    });
  }
};

// Reject a return request - Admin only
const rejectReturn = async (req, res) => {
  try {
    const { returnId } = req.params;

    const returnRequest = await Return.findById(returnId);

    if (!returnRequest) {
      return res.status(404).json({
        message: "Return request not found",
      });
    }

    if (returnRequest.status !== "REQUESTED") {
      return res.status(400).json({
        message: `Return request cannot be rejected from ${returnRequest.status} status`,
      });
    }

    returnRequest.status = "REJECTED";
    await returnRequest.save();

    res.status(200).json({
      message: "Return request rejected successfully",
      returnRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reject return request",
      error: error.message,
    });
  }
};

module.exports = {
  createReturn,
  getMyReturns,
  approveReturn,
  rejectReturn,
};
