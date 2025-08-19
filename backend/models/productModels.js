const mongoose = require("mongoose");

const detailsProductSchema = new mongoose.Schema({
  flavour: {
    type: String,
    required: true,
  },
  instock: {
    type: Number,
    required: true,
  },
  sales: {
    type: Number,
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  mfd: {
    type: Date,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  details: [detailsProductSchema],
});

module.exports = mongoose.model("Product", productSchema);
