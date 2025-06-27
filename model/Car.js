const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },

  brandModel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BrandModel',
    required: true
  },

  powertrain : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Powertrain',
    required: true
  },

  variant : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant',
    required: true
  },

});

module.exports = mongoose.model('Car', carSchema);
