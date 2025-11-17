const Order = require('../models/Order');

const calculatePrice = (porridgeType, size, quantity, extras) => {
  const basePrices = {
    'plain': { small: 200, medium: 300, large: 400 },
    'with-milk': { small: 250, medium: 350, large: 450 },
    'with-sugar': { small: 250, medium: 350, large: 450 },
    'special': { small: 300, medium: 400, large: 500 }
  };

  const extraPrices = {
    'groundnut': 50,
    'milk': 50,
    'sugar': 30,
    'dates': 100
  };

  let price = basePrices[porridgeType][size] * quantity;
  
  if (extras && extras.length > 0) {
    extras.forEach(extra => {
      price += (extraPrices[extra] || 0) * quantity;
    });
  }

  return price;
};

const calculateQueuePosition = async () => {
  const pendingOrders = await Order.countDocuments({ 
    status: { $in: ['pending', 'preparing'] } 
  });
  return pendingOrders + 1;
};

exports.createOrder = async (req, res) => {
  try {
    const { porridgeType, quantity, size, extras, specialInstructions } = req.body;

    const totalPrice = calculatePrice(porridgeType, size, quantity, extras);
    const queuePosition = await calculateQueuePosition();
    const estimatedTime = queuePosition * 5;

    const order = new Order({
      customer: req.userId,
      customerName: req.user.name,
      customerPhone: req.user.phone,
      porridgeType,
      quantity,
      size,
      extras: extras || [],
      specialInstructions: specialInstructions || '',
      totalPrice,
      queuePosition,
      estimatedTime
    });

    await order.save();

    const io = req.app.get('io');
    io.emit('newOrder', order);

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.userId })
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.customer.toString() !== req.userId.toString() && req.user.role !== 'vendor') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    const io = req.app.get('io');
    io.emit('orderUpdated', order);

    res.json({
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQueueStatus = async (req, res) => {
  try {
    const activeOrders = await Order.find({
      status: { $in: ['pending', 'preparing'] }
    }).sort({ createdAt: 1 });

    const totalOrders = activeOrders.length;
    const avgWaitTime = totalOrders * 5;

    res.json({
      queueLength: totalOrders,
      estimatedWaitTime: avgWaitTime,
      orders: activeOrders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.customer.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (order.status === 'completed' || order.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    await order.save();

    const io = req.app.get('io');
    io.emit('orderCancelled', order);

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
