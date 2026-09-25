const Return = require("../models/Return");
const SellerOrder = require("../models/SellerOrder");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

const processRefund = async (returnId) => {
  // Find return request
  const returnRequest = await Return.findById(returnId);

  if (!returnRequest) {
    throw new Error("Return request not found");
  }

  // Refund can only be processed after approval
  if (returnRequest.status !== "APPROVED") {
    throw new Error(
      `Refund cannot be processed from ${returnRequest.status} status`,
    );
  }

  // Find associated seller order
  const sellerOrder = await SellerOrder.findById(returnRequest.sellerOrderId);

  if (!sellerOrder) {
    throw new Error("Seller order not found");
  }

  // Prevent duplicate refund
  if (sellerOrder.status === "REFUNDED") {
    throw new Error("Seller order has already been refunded");
  }

  // The amount previously credited to the seller
  const sellerRefundAmount = sellerOrder.sellerAmount;

  // Total amount paid for this seller order
  const customerRefundAmount = sellerOrder.subtotal;

  // Find seller wallet
  const wallet = await Wallet.findOne({
    sellerId: sellerOrder.sellerId,
  });

  if (!wallet) {
    throw new Error("Seller wallet not found");
  }

  // Make sure the wallet can support the reversal
  if (wallet.balance < sellerRefundAmount) {
    throw new Error("Insufficient seller wallet balance for refund reversal");
  }

  // Reverse the amount previously credited to seller
  wallet.balance = Number((wallet.balance - sellerRefundAmount).toFixed(2));

  await wallet.save();

  // Mark seller order as refunded
  sellerOrder.status = "REFUNDED";
  await sellerOrder.save();

  // Mark return request as refunded
  returnRequest.status = "REFUNDED";
  await returnRequest.save();

  // Record refund transaction against seller wallet
  const transaction = await Transaction.create({
    sellerId: sellerOrder.sellerId,
    amount: sellerRefundAmount,
    type: "REFUND",
    description: `Refund reversal for Seller Order ${sellerOrder._id}`,
  });

  return {
    returnRequest,
    sellerOrder,
    wallet,
    transaction,
    customerRefundAmount,
    sellerRefundAmount,
    commissionReversed: sellerOrder.commission,
  };
};

module.exports = {
  processRefund,
};
