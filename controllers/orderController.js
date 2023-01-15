const Order = require("../models/orderModel")
const Product = require("../models/productModel")
const Cart = require("../models/cartModel")

const asyncHandler = require("express-async-handler")
const validateMongodbId = require("../utils/validateMongodbId")
const uniqid = require("uniqid")

// create Order
const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body
  const { _id } = req.user
  validateMongodbId(_id)

  try {
    if (!COD) throw new Error("Create Cash Order Failed")
    const userCart = await Cart.findOne({ orderby: _id })

    let finalAmount = 0
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount
    } else {
      finalAmount = userCart.cartTotal
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash On Delivery",
        created: Date.now(),
        currency: "IDR",
      },
      orderby: _id,
      orderStatus: "Cash On Delivery",
    }).save()

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { stock: -item.count, sold: +item.count } },
        },
      }
    })

    const updated = await Product.bulkWrite(update, {})
    res.json({ message: "Success Create Order" })
  } catch (error) {
    throw new Error(error)
  }
})

//  Get Orders User
const getUserOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user
  validateMongodbId(_id)
  try {
    const userOrders = await Order.find({ orderby: _id })
      .populate("products.product")
      .exec()
    res.json(userOrders)
  } catch (error) {
    throw new Error(error)
  }
})

// update Order Status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const { id } = req.params
  validateMongodbId(id)
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    )
    res.json(updateOrderStatus)
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = { createOrder, getUserOrders, updateOrderStatus }
