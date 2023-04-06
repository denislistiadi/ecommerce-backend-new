const express = require('express');
const {
  createCoupon,
  getAllCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/couponController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, isAdmin, getAllCoupon);

router.post('/', authMiddleware, isAdmin, createCoupon);

router.put('/:id', authMiddleware, isAdmin, updateCoupon);

router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
