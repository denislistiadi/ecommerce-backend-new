const express = require('express');
const {
  addCart,
  getCart,
  emptyCart,
  applyCoupon,
} = require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addCart);
router.post('/apply-coupon', authMiddleware, applyCoupon);

router.get('/', authMiddleware, getCart);

router.delete('/', authMiddleware, emptyCart);

module.exports = router;
