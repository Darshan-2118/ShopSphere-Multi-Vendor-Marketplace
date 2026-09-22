const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const SellerOrder = require("../models/SellerOrder");

// Create order from customer's cart
const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      customerId: req.user.id,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;
    const sellerGroups = {};

    // Validate products and group cart items by seller
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product ${item.productId} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      const sellerId = product.sellerId.toString();

      if (!sellerGroups[sellerId]) {
        sellerGroups[sellerId] = [];
      }

      sellerGroups[sellerId].push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      }); 
    }

    // Create parent order
    const order = await Order.create({
      customerId: req.user.id,
      totalAmount,
    });

    const sellerOrders = [];

    // Create separate seller orders
    for (const sellerId of Object.keys(sellerGroups)) {
      const items = sellerGroups[sellerId];

      const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      const sellerOrder = await SellerOrder.create({
        parentOrderId: order._id,
        sellerId,
        items,
        subtotal,
      });

      sellerOrders.push(sellerOrder);
    }

    // Reduce product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
      sellerOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};
// Get customer's order history
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.user.id,
    }).sort({ createdAt: -1 });

    const ordersWithSellerOrders = await Promise.all(
      orders.map(async (order) => {
        const sellerOrders = await SellerOrder.find({
          parentOrderId: order._id,
        });

        return {
          ...order.toObject(),
          sellerOrders,
        };
      }),
    );

    res.json({
      orders: ordersWithSellerOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order history",
      error: error.message,
    });
  }
};
// Get single order details
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customerId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const sellerOrders = await SellerOrder.find({
      parentOrderId: order._id,
    });

    res.json({
      order: {
        ...order.toObject(),
        sellerOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
};
// Get seller's orders
const getSellerOrders = async (req, res) => {
  try {
    const sellerOrders = await SellerOrder.find({
      sellerId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      sellerOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch seller orders",
      error: error.message,
    });
  }
};
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
};
