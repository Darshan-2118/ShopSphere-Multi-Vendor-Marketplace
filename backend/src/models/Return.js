const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    sellerOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerOrder",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["REQUESTED", "APPROVED", "REJECTED", "REFUNDED"],
      default: "REQUESTED",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Return", returnSchema);
    