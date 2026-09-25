const { getSellerAnalytics } = require("../services/analyticsService");

// Get analytics for logged-in seller
const getAnalytics = async (req, res) => {
  try {
    const analytics = await getSellerAnalytics(req.user.id);

    res.status(200).json({
      message: "Analytics fetched successfully",
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};
