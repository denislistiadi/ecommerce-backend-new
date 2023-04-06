const asyncHandler = require('express-async-handler');
const Brand = require('../models/brandModel');
const validateMongodbId = require('../utils/validateMongodbId');

// Create Brand Product
const createBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

// Get All Brand Product
const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.find();
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

// Get Brand Product
const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const brand = await Brand.findById(id);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

// Update Brand Product
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete Brand Product
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const brand = await Brand.findByIdAndDelete(id);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  getAllBrand,
  getBrand,
  updateBrand,
  deleteBrand,
};
