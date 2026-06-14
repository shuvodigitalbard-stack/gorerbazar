const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/products - public
router.get('/', async (req, res) => {
  try {
    const {
      category, search, sort, page = 1, limit = 20,
      featured, bestSelling, newArrival, organic, preOrder, minPrice, maxPrice
    } = req.query;

    let filter = { isActive: true };

    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (bestSelling === 'true') filter.isBestSelling = true;
    if (newArrival === 'true') filter.isNewArrival = true;
    if (organic === 'true') filter.isOrganic = true;
    if (preOrder === 'true') filter.isPreOrder = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let sortOption = {};
    switch (sort) {
      case 'price_asc': sortOption = { price: 1 }; break;
      case 'price_desc': sortOption = { price: -1 }; break;
      case 'newest': sortOption = { createdAt: -1 }; break;
      case 'rating': sortOption = { rating: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/featured - public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(12);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/bestselling - public
router.get('/bestselling', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isBestSelling: true })
      .populate('category', 'name slug')
      .limit(12);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:slug - public
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products - admin
router.post('/', protect, adminOnly, upload.array('images', 10), async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
    const product = await Product.create({ ...req.body, images });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/products/:id - admin
router.put('/:id', protect, adminOnly, upload.array('images', 10), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(f => `/uploads/${f.filename}`);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/products/:id - admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
