const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const sellerRoutes = require("./routes/sellerRoutes");
const walletRoutes = require("./routes/walletRoutes");
const returnRoutes = require("./routes/returnRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/seller", sellerRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/analytics", analyticsRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("Seller Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});