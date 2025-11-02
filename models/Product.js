// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  externalId: { type: Number, unique: true }, // For API IDs
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, min: 0, max: 100, default: 0 }, // New: e.g., 12.96
  rating: { type: Number, min: 0, max: 5, default: 0 }, // New: 1-5 stars
  image: { type: String, required: true }, // Main thumbnail
  images: [{ type: String }], // New: Full gallery array
  category: { type: String },
  brand: { type: String }, // New: e.g., "Apple"
  stock: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Product', productSchema);