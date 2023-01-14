const Product = require("../models/productModel")
const User = require("../models/userModel")
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

    // pagination
    const page = req.query.page
    const limit = req.query.limit
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const productCount = await Product.countDocuments()
      if (skip >= productCount) {
        throw new Error("This Page does not Exist")
      }
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

// add Wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { prodId } = req.body
  try {
    const user = await User.findById(_id)
    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId)
    if (alreadyAdded) {
      const user = await User.findByIdAndUpdate(
        _id,
        { $pull: { wishlist: prodId } },
        { new: true }
      )
      res.json(user)
    } else {
      const user = await User.findByIdAndUpdate(
        _id,
        { $push: { wishlist: prodId } },
        { new: true }
      )
      res.json(user)
    }
  } catch (error) {
    throw new Error(error)
  }
})

// add Rating
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { star, comment, prodId } = req.body
  try {
    const product = await Product.findById(prodId)
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    )
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      )
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: { ratings: { star: star, comment: comment, postedby: _id } },
        },
        { new: true }
      )
    }
    const getAllRating = await Product.findById(prodId)
    const totalRating = getAllRating.ratings.length
    const ratingSum = getAllRating.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0)
    const actualRating = Math.round(ratingSum / totalRating)
    const finalProduct = await Product.findByIdAndUpdate(
      prodId,
      { totalrating: actualRating },
      { new: true }
    )
    res.json(finalProduct)
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
  addToWishlist,
  rating,
}
