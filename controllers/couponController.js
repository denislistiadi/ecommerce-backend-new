const asyncHandler = require('express-async-handler');
const Coupon = require('../models/couponModel');
const validateMongoDbId = require('../utils/validateMongodbId');

// add Coupon
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

// get All Coupon
const getAllCoupon = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

// update Coupon
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const coupons = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

// delete Coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const coupons = await Coupon.findByIdAndDelete(id);
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCoupon, getAllCoupon, updateCoupon, deleteCoupon,
};
