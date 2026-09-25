const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  orderId: String,
  reason: String,
  status: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model("Return", returnSchema);