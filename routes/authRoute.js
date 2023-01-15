const express = require("express")
const {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logoutUser,
  updatePasswordUser,
  forgotPasswordToken,
  resetPasswordToken,
  loginAdmin,
  getWishlist,
  saveAddress,
} = require("../controllers/userController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUser)
router.post("/login-admin", loginAdmin)
router.post("/forgot-password", forgotPasswordToken)

router.get("/", getAllUser)
router.get("/refresh", handleRefreshToken)
router.get("/logout", logoutUser)
router.get("/wishlist", authMiddleware, getWishlist)
router.get("/:id", authMiddleware, isAdmin, getUser)

router.put("/edit", authMiddleware, updateUser)
router.put("/address", authMiddleware, saveAddress)
router.put("/password", authMiddleware, updatePasswordUser)
router.put("/reset-password/:token", resetPasswordToken)
router.put("/block/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock/:id", authMiddleware, isAdmin, unblockUser)

router.delete("/:id", deleteUser)

module.exports = router
