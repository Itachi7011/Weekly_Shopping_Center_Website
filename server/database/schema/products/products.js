const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const ProductsSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  subCategory: {
    type: String,
  },
  price: {
    type: String,
  },
  brand: {
    type: String,
  },
  model: {
    type: String,
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
  weight: {
    type: String,
  },
  dimensions: {
    type: String,
  },

  // Only Admin Can Apply This

  discount: {
    // Only Admin Can Apply This

    type: String,
    default:0
  },
  stock_quantity: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],

  images: [
    {
      data: String,
      publicId: String,
      contentType: String,
    },
  ],
  youtubeUrl: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  dateOfFormSubmission: {
    type: String,
  },
});

const NewProduct = new mongoose.model("W_Mark_Products", ProductsSchema);
module.exports = NewProduct;
