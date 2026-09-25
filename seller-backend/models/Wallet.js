const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Wallet", walletSchema);