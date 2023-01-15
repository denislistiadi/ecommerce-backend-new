const express = require("express")
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
} = require("../controllers/productController")
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware")
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages")

const router = express.Router()

router.post("/", authMiddleware, isAdmin, createProduct)

router.get("/", getAllProduct)
router.get("/:id", getProduct)

router.put("/wishlist", authMiddleware, addToWishlist)
router.put("/rating", authMiddleware, rating)
router.put("/:id", authMiddleware, isAdmin, updateProduct)
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
)

router.delete("/:id", authMiddleware, isAdmin, deleteProduct)

module.exports = router
