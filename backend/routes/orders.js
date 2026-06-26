import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Place a new rental order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const { items, deliveryAddress, deliveryCity, deliveryDate } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No items in order' });
  }

  try {
    const orderItems = [];
    let totalMonthlyRent = 0;
    let totalSecurityDeposit = 0;

    // Validate and process items
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }

      // Check inventory availability
      if (product.inventory < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for ${product.name}. Available: ${product.inventory}`,
        });
      }

      // Calculate monthly rent based on tenure
      const multiplier = product.tenureRates.get(String(item.tenure)) || 1.0;
      const finalMonthlyRent = Math.round(product.baseRent * multiplier);
      const securityDeposit = product.deposit;

      orderItems.push({
        product: product._id,
        tenure: item.tenure,
        monthlyRent: finalMonthlyRent,
        securityDeposit: securityDeposit,
        quantity: item.quantity,
      });

      totalMonthlyRent += finalMonthlyRent * item.quantity;
      totalSecurityDeposit += securityDeposit * item.quantity;

      // Adjust product inventory
      product.inventory -= item.quantity;
      product.rentedCount += item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalMonthlyRent,
      totalSecurityDeposit,
      deliveryAddress,
      deliveryCity,
      deliveryDate,
      status: 'Pending Delivery',
      paymentStatus: 'Paid', // Simulation default
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get current user's rental history/active rentals
// @route   GET /api/orders/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending Delivery', 'Active', 'Returned', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid order status' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.status;

    // Inventory reinstatement logic if order is returned or cancelled
    const releasingStock = ['Returned', 'Cancelled'].includes(status);
    const wasInLease = ['Pending Delivery', 'Active'].includes(previousStatus);

    if (releasingStock && wasInLease) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.inventory += item.quantity;
          product.rentedCount = Math.max(0, product.rentedCount - item.quantity);
          await product.save();
        }
      }
    }
    // Re-deducting stock if moving from Cancelled/Returned to Active/Pending
    else if (!releasingStock && ['Returned', 'Cancelled'].includes(previousStatus)) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.inventory = Math.max(0, product.inventory - item.quantity);
          product.rentedCount += item.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
