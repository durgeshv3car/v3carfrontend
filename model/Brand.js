const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  foundedYear: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);