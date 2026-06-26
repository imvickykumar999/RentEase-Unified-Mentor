import express from 'express';
import Maintenance from '../models/Maintenance.js';
import Order from '../models/Order.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Raise a new maintenance/relocation/return ticket
// @route   POST /api/maintenance
// @access  Private
router.post('/', protect, async (req, res) => {
  const { orderId, productId, issueType, description } = req.body;

  if (!orderId || !productId || !issueType || !description) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  try {
    // Validate order exists and belongs to the user
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Matching order not found' });
    }

    // Validate the product is part of that order
    const hasProduct = order.items.some(item => item.product.toString() === productId);
    if (!hasProduct) {
      return res.status(400).json({ success: false, message: 'Product not found in this order' });
    }

    const ticket = await Maintenance.create({
      user: req.user._id,
      order: orderId,
      product: productId,
      issueType,
      description,
      status: 'Pending',
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get current user's tickets
// @route   GET /api/maintenance/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const tickets = await Maintenance.find({ user: req.user._id })
      .populate('product', 'name category images')
      .populate('order', 'deliveryAddress deliveryCity')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all tickets (Admin only)
// @route   GET /api/maintenance
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const tickets = await Maintenance.find()
      .populate('user', 'name email')
      .populate('product', 'name category images')
      .populate('order', 'deliveryAddress deliveryCity')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Schedule/Resolve ticket (Admin only)
// @route   PUT /api/maintenance/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  const { status, scheduledDate } = req.body;
  const validStatuses = ['Pending', 'In Progress', 'Resolved'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid ticket status' });
  }

  try {
    const ticket = await Maintenance.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (status) {
      ticket.status = status;
    }

    if (scheduledDate) {
      ticket.scheduledDate = new Date(scheduledDate);
    }

    await ticket.save();

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
