const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const SellerOrder = require("../models/SellerOrder");

const COMMISSION_RATE = 0.1;

/**
 * Calculate and settle a SellerOrder.
 *
 * Example:
 * subtotal    = ₹10,000
 * commission  = ₹1,000 (10%)
 * paymentFee  = ₹0
 * sellerAmount = ₹9,000
 */
const settleSellerOrder = async (sellerOrderId) => {
  const sellerOrder = await SellerOrder.findById(sellerOrderId);

  if (!sellerOrder) {
    throw new Error("Seller order not found");
  }

  // Prevent the same seller order from being settled twice
  if (sellerOrder.sellerAmount > 0) {
    return {
      message: "Seller order already settled",
      sellerOrder,
    };
  }

  const subtotal = sellerOrder.subtotal;

  // 10% platform commission
  const commission = Number((subtotal * COMMISSION_RATE).toFixed(2));

  // Payment processing fee
  // Currently kept as 0 because no payment gateway fee
  // has been defined for the project.
  const paymentFee = 0;

  // Amount credited to seller
  const sellerAmount = Number((subtotal - commission - paymentFee).toFixed(2));

  // Find or create seller wallet
  let wallet = await Wallet.findOne({
    sellerId: sellerOrder.sellerId,
  });

  if (!wallet) {
    wallet = await Wallet.create({
      sellerId: sellerOrder.sellerId,
      balance: 0,
    });
  }

  // Credit seller wallet
  wallet.balance = Number((wallet.balance + sellerAmount).toFixed(2));

  await wallet.save();

  // Update SellerOrder
  sellerOrder.commission = commission;
  sellerOrder.paymentFee = paymentFee;
  sellerOrder.sellerAmount = sellerAmount;

  await sellerOrder.save();

  // Create transaction record
  const transaction = await Transaction.create({
    sellerId: sellerOrder.sellerId,
    amount: sellerAmount,
    type: "SETTLEMENT",
    description: `Settlement for Seller Order ${sellerOrder._id}`,
  });

  return {
    sellerOrder,
    wallet,
    transaction,
  };
};

module.exports = {
  settleSellerOrder,
};
