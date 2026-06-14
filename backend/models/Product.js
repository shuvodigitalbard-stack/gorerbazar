const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, default: 'Gorerbazar' },
  images: [{ type: String }],
  thumbnail: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: 'piece' },
  weight: { type: String, default: '' },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isBestSelling: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isOrganic: { type: Boolean, default: false },
  isPreOrder: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.virtual('discountPercent').get(function() {
  if (this.originalPrice > 0) {
    return Math.round((1 - this.price / this.originalPrice) * 100);
  }
  return this.discount;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
