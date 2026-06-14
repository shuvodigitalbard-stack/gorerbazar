const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  address: {
    street: String,
    city: String,
    district: String,
    postalCode: String
  },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const bcrypt = require('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await require('bcryptjs').compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
