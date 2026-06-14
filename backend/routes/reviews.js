const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/reviews - public approved reviews
router.get('/', async (req, res) => {
  try {
    const { product } = req.query;
    let filter = { isApproved: true };
    if (product) filter.product = product;
    const reviews = await Review.find(filter)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reviews - logged in user
router.post('/', protect, async (req, res) => {
  try {
    const review = await Review.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/reviews/:id/approve - admin
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/reviews/:id - admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
