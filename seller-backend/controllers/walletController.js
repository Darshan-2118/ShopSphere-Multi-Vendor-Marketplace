const Wallet = require("../models/Wallet");

const getWallet = async (req, res) => {
  try {
    const wallets = await Wallet.find();
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWallet = async (req, res) => {
  try {
    const { sellerId, balance } = req.body;

    const wallet = await Wallet.create({
      sellerId,
      balance,
    });

    res.status(201).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWallet,
  createWallet,
};