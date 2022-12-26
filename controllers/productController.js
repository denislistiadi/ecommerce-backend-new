const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler")

// Create Product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const newProduct = await Product.create(req.body)
    res.json(newProduct)
  } catch (error) {
    throw new Error(error)
  }
})

// Get All Product
const getAllProduct = asyncHandler(async(req,res) => {
  try {
    const products = await Product.find()
    res.json({products})
  } catch (error) {
    throw new Error(error)
  }
})

// Get Product
const getProduct = asyncHandler(async(req, res) => {
  const { id } = req.params
  try {
    const product = await Product.findById(id)
    res.json({product})
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = { createProduct, getAllProduct, getProduct }
