const express = require("express")
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
} = require("../controllers/blogController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()

router.get("/", getAllBlogs)
router.get("/:id", getBlog)

router.post("/", authMiddleware, isAdmin, createBlog)

router.put("/likes", authMiddleware, likeBlog)
router.put("/dislikes", authMiddleware, dislikeBlog)
router.put("/:id", authMiddleware, isAdmin, updateBlog)

router.delete("/:id", authMiddleware, isAdmin, deleteBlog)

module.exports = router
