const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, isVendor } = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getMyOrders);
router.get('/queue-status', orderController.getQueueStatus);
router.get('/:id', auth, orderController.getOrderById);
router.get('/', auth, isVendor, orderController.getAllOrders);
router.put('/:id/status', auth, isVendor, orderController.updateOrderStatus);
router.delete('/:id', auth, orderController.cancelOrder);

module.exports = router;
