const mongoose = require("mongoose");

const sellerOrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const sellerOrderSchema = new mongoose.Schema(
  {
    parentOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [sellerOrderItemSchema],

    // Total value of all products belonging to this seller
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // Platform commission (10%)
    commission: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Payment processing fee
    paymentFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Final amount payable to seller
    sellerAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
      ],
      default: "PLACED",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SellerOrder", sellerOrderSchema);
