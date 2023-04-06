const express = require('express');
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/user', authMiddleware, getUserOrders);
router.post('/', authMiddleware, createOrder);
router.put('/:id', authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;
