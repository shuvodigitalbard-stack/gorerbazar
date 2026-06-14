const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  image: { type: String, required: true },
  link: { type: String, default: '' },
  buttonText: { type: String, default: 'Shop Now' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  position: { type: String, enum: ['hero', 'middle', 'bottom'], default: 'hero' }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
