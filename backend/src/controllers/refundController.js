const { processRefund } = require("../services/refundService");

// Process an approved return refund
const processReturnRefund = async (req, res) => {
  try {
    const { returnId } = req.params;

    const result = await processRefund(returnId);

    res.status(200).json({
      message: "Refund processed successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to process refund",
      error: error.message,
    });
  }
};

module.exports = {
  processReturnRefund,
};