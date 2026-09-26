const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const SellerOrder = require("../models/SellerOrder");

const { settleSellerOrder } = require("../services/settlementService");

// Get logged-in seller's wallet
const getWallet = async (req, res) => {
  try {
    const sellerId = req.user.id;

    let wallet = await Wallet.findOne({
      sellerId,
    });

    // Create wallet automatically if it does not exist
    if (!wallet) {
      wallet = await Wallet.create({
        sellerId,
        balance: 0,
      });
    }

    res.status(200).json({
      message: "Wallet fetched successfully",
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get logged-in seller's transactions
const getTransactions = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const transactions = await Transaction.find({
      sellerId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Settle a seller order
const settleOrder = async (req, res) => {
  try {
    const { sellerOrderId } = req.params;

    // Find the seller order
    const sellerOrder = await SellerOrder.findById(sellerOrderId);

    if (!sellerOrder) {
      return res.status(404).json({
        message: "Seller order not found",
      });
    }

    // Make sure the logged-in seller owns this order
    if (sellerOrder.sellerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to settle this seller order",
      });
    }

    const result = await settleSellerOrder(sellerOrderId);

    res.status(200).json({
      message: "Seller order settled successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getWallet,
  getTransactions,
  settleOrder,
};
