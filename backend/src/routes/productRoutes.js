const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("SELLER"), createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/:id", protect, authorize("SELLER"), updateProduct);

router.delete("/:id", protect, authorize("SELLER"), deleteProduct);

module.exports = router;