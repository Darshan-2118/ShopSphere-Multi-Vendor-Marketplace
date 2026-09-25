const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    res.status(200).json({
      message: "Delivery status updated",
      orderId: id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  updateDeliveryStatus,
};