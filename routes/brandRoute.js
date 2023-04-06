const express = require('express');
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrand,
} = require('../controllers/brandController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllBrand);
router.get('/:id', getBrand);

router.post('/', authMiddleware, isAdmin, createBrand);

router.put('/:id', authMiddleware, isAdmin, updateBrand);

router.delete('/:id', authMiddleware, isAdmin, deleteBrand);

module.exports = router;
