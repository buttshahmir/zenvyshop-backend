const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// All order routes require login
router.use(protect);

router.post('/', createOrder);                                       // POST  /api/orders
router.get('/my', getMyOrders);                                      // GET   /api/orders/my
router.get('/:id', getOrderById);                                    // GET   /api/orders/:id
router.get('/', adminOnly, getAllOrders);                             // GET   /api/orders       (admin)
router.patch('/:id/status', adminOnly, updateOrderStatus);           // PATCH /api/orders/:id/status (admin)

module.exports = router;
