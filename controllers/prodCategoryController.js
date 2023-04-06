const asyncHandler = require('express-async-handler');
const Category = require('../models/prodCategoryModel');
const validateMongodbId = require('../utils/validateMongodbId');

// Create Category Product
const createCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

// Get All Category Product
const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.find();
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

// Get Category Product
const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const category = await Category.findById(id);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

// Update Category Product
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete Category Product
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const category = await Category.findByIdAndDelete(id);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
