const express = require("express");
const router = express.Router();

const {
  registerSeller,
} = require("../controllers/sellerController");

router.post("/register", registerSeller);

module.exports = router;