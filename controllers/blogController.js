const Blog = require("../models/blogModel")
const User = require("../models/userModel")
const validateMongodbId = require("../utils/validateMongodbId")
const asyncHandler = require("express-async-handler")

// Create Blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch (error) {
    throw new Error(error)
  }
})

// Update Blog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true })
    res.json(blog)
  } catch (error) {
    throw new Error(error)
  }
})

// Get Blog by Id
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const blog = await Blog.findById(id)
    const update = await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true }
    )
    res.json(update)
  } catch (error) {
    throw new Error(error)
  }
})

// Get all Blog
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find()
    res.json(blogs)
  } catch (error) {
    throw new Error(error)
  }
})

// Delete Blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const blog = await Blog.findByIdAndDelete(id)
    res.json(blog)
  } catch (error) {
    throw new Error(error)
  }
})

// Like post blog
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body
  validateMongodbId(blogId)
  const blog = await Blog.findById(blogId)
  const loginUserId = req?.user?._id

  const isLiked = blog?.isLiked
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  )

  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    )
    res.json(blog)
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    )
    res.json(blog)
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    )
    res.json(blog)
  }
})

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
}
