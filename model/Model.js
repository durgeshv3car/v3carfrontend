// models/BrandModel.js
const mongoose = require('mongoose');

const brandModelSchema = new mongoose.Schema({
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  model_name: { type: String, required: true },
  model_body_type: { type: String, required: true }, // e.g., SUV, Sedan, etc.
  launch_date: { type: Date, required: true },
  upload_brochure: { type: String }, // file URL for brochure
  url_slug: { type: String, unique: true }, // SEO-friendly slug
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('BrandModel', brandModelSchema);
