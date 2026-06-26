import express from 'express';
import City from '../models/City.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all active cities
// @route   GET /api/cities
// @access  Public
router.get('/', async (req, res) => {
  try {
    const cities = await City.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, count: cities.length, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add a new city (Admin only)
// @route   POST /api/cities
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Please provide a city name' });
  }

  try {
    const cityExists = await City.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (cityExists) {
      return res.status(400).json({ success: false, message: 'City already exists' });
    }

    const city = await City.create({ name });
    res.status(201).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
