const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  porridgeType: {
    type: String,
    required: true,
    enum: ['plain', 'with-milk', 'with-sugar', 'special']
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  extras: [{
    type: String
  }],
  specialInstructions: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  queuePosition: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  estimatedTime: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
