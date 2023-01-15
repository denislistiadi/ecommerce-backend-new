const User = require("../models/userModel")
const Product = require("../models/productModel")
const Cart = require("../models/cartModel")
const Coupon = require("../models/couponModel")

const asyncHandler = require("express-async-handler")
const validateMongodbId = require("../utils/validateMongodbId")

// Add Cart
const addCart = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { cart } = req.body
  validateMongodbId(_id)

  try {
    let products = []
    const user = await User.findById(_id)

    // check user product cart already
    const alreadyExistCart = await Cart.findOne({ orderby: user._id })
    if (alreadyExistCart) {
      alreadyExistCart.remove()
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {}
      object.product = cart[i]._id
      object.count = cart[i].count
      object.color = cart[i].color
      let getPrice = await Product.findById(cart[i]._id).select("price").exec()
      object.price = getPrice.price
      products.push(object)
    }
    let cartTotal = 0
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save()
    res.json(newCart)
  } catch (error) {
    throw new Error(error)
  }
})

// Get Cart
const getCart = asyncHandler(async (req, res) => {
  const { _id } = req.user
  validateMongodbId(_id)
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
      // "_id title price totalAfterDiscount"
    )
    res.json(cart)
  } catch (error) {
    throw new Error(error)
  }
})

// Empty Cart
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user
  validateMongodbId(_id)
  try {
    const cart = await Cart.findOneAndRemove({ orderby: _id })
    res.json(cart)
  } catch (error) {
    throw new Error(error)
  }
})

// Use Coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.user
  validateMongodbId(_id)
  const { coupon } = req.body
  try {
    const validCoupon = await Coupon.findOne({ name: coupon })
    if (validCoupon === null) throw new Error("Invalid Coupon")
    let { products, cartTotal } = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    )
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2)
    await Cart.findOneAndUpdate(
      { orderby: _id },
      { totalAfterDiscount },
      { new: true }
    )
    res.json(totalAfterDiscount)
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = { addCart, getCart, emptyCart, applyCoupon }
