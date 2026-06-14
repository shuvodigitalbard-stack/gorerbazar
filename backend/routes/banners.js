const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/banners - public
router.get('/', async (req, res) => {
  try {
    const { position } = req.query;
    let filter = { isActive: true };
    if (position) filter.position = position;
    const banners = await Banner.find(filter).sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/banners - admin
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const bannerData = { ...req.body };
    if (req.file) bannerData.image = `/uploads/${req.file.filename}`;
    const banner = await Banner.create(bannerData);
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/banners/:id - admin
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/banners/:id - admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
