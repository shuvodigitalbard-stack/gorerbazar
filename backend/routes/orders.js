const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/orders - create order
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/my - get user orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name thumbnail');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders - admin all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let filter = {};
    if (status) filter.orderStatus = status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ orders, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/stats - admin dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    const todayRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: today }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayOrders,
      todayRevenue: todayRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/orders/:id/status - admin update status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (orderStatus === 'delivered') updateData.deliveredAt = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name thumbnail');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Only allow owner or admin
    if (req.user.role !== 'admin' && order.user?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
