// models/Variant.js
const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'BrandModel', required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }], // array of image URLs
}, { timestamps: true });

module.exports = mongoose.model('Variant', variantSchema);
