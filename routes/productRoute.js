const express = require("express")
const {
  createProduct,
  getProduct,
  getAllProduct,
} = require("../controllers/productController")

const router = express.Router()

router.post("/", createProduct)

router.get("/", getAllProduct)
router.get("/:id", getProduct)

module.exports = router
