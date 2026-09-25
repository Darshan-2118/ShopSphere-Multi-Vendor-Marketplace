const getAnalytics = async (req, res) => {
  try {
    res.status(200).json({
      totalSales: 10000,
      totalOrders: 50,
      totalReturns: 5,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};