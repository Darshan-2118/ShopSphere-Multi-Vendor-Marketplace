const express = require("express");
const router = express.Router();

const {
  getWallet,
  createWallet,
} = require("../controllers/walletController");

router.get("/", getWallet);

router.post("/", createWallet);

module.exports = router;