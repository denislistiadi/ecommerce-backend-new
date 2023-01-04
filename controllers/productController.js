const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")

// Create Product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const newProduct = await Product.create(req.body)
    res.json(newProduct)
  } catch (error) {
    throw new Error(error)
  }
})

// Get All Product and Filter Product
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Filtering
    let queryObj = { ...req.query }
    const excludeFields = ["page", "sort", "limit", "fields"]
    excludeFields.forEach((el) => delete queryObj[el])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => "$" + match)

    let query = Product.find(JSON.parse(queryStr))

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("-createdAt")
    }

    // limiting fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ")
      query = query.select(fields)
    } else {
      query = query.select("-__v")
    }
    const products = await query
    res.json(products)
  } catch (error) {
    throw new Error(error)
  }
})

// Get Product
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const product = await Product.findById(id)
    res.json({ product })
  } catch (error) {
    throw new Error(error)
  }
})

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const product = await Product.findOneAndUpdate(id, req.body, {
      new: true,
    })
    res.json({ product })
  } catch (error) {
    throw new Error(error)
  }
})

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const product = await Product.findByIdAndDelete(id)
    res.json({ product })
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
}
