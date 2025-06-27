// models/Powertrain.js
const mongoose = require('mongoose');

const powertrainSchema = new mongoose.Schema({
  variant: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant', required: true },
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  wheelbase: { type: Number, required: true },
  bootspace: { type: Number, required: true },
  fuel_tank: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Powertrain', powertrainSchema);
