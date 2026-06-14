const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
    image: String
  }],
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    postalCode: { type: String, default: '' },
    note: { type: String, default: '' }
  },
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'bkash', 'nagad', 'card'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: { type: String, default: '' },
  notes: { type: String, default: '' },
  deliveredAt: { type: Date }
}, { timestamps: true });

// Generate order number
orderSchema.pre('validate', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `GB${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
