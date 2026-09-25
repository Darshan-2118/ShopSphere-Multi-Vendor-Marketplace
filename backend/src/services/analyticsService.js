const SellerOrder = require("../models/SellerOrder");
const Return = require("../models/Return");

const getSellerAnalytics = async (sellerId) => {
  const sellerOrders = await SellerOrder.find({
    sellerId,
  });

  const totalOrders = sellerOrders.length;

  const activeOrders = sellerOrders.filter(
    (order) => order.status !== "CANCELLED" && order.status !== "REFUNDED",
  );

  const totalSales = activeOrders.reduce(
    (total, order) => total + order.subtotal,
    0,
  );

  const totalCommission = sellerOrders.reduce(
    (total, order) => total + order.commission,
    0,
  );

  const totalSellerEarnings = sellerOrders.reduce(
    (total, order) => total + order.sellerAmount,
    0,
  );

  const sellerOrderIds = sellerOrders.map((order) => order._id);

  const totalReturns = await Return.countDocuments({
    sellerOrderId: { $in: sellerOrderIds },
  });

  const totalProductsSold = sellerOrders.reduce((total, order) => {
    return (
      total +
      order.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0)
    );
  }, 0);

  return {
    totalOrders,
    totalSales,
    totalCommission,
    totalSellerEarnings,
    totalReturns,
    totalProductsSold,
  };
};

module.exports = {
  getSellerAnalytics,
};
