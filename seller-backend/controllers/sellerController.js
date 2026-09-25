const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");

const registerSeller = async (req, res) => {
  try {
    const { name, email, password, shopName } = req.body;

    const sellerExists = await Seller.findOne({ email });

    if (sellerExists) {
      return res.status(400).json({
        message: "Seller already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      name,
      email,
      password: hashedPassword,
      shopName,
    });

    res.status(201).json({
      message: "Seller Registered Successfully",
      seller,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerSeller,
};