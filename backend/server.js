const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const walletRoutes = require("./src/routes/walletRoutes");
const returnRoutes = require("./src/routes/returnRoutes");
const refundRoutes = require("./src/routes/refundRoutes");
const deliveryRoutes = require("./src/routes/deliveryRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ShopSphere Backend API is running!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
