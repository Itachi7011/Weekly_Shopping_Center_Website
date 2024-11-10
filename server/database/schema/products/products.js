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
  marketName: {
    type: String,
  },
  newOrRefurbished: {
    type: String,
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isNewProduct: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isLimitedTimeDeal: {
    type: Boolean,
    default: false
  },
  price: {
    type: String,
  },
  effectivePrice: {
    type: String,
  },
  brand: {
    type: String,
  },
  model: {
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

  stockNextRefillDate: {
    type: String,
  },
  sellerDiscount: {

    type: String,
    default: 0
  },

  adminDiscount: {
    // Only Admin Can Apply This

    type: String,
    default: 0
  },
  stock_available: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],


  bankOffers: [
    {
      id: String,
      bankOfferName: String,
    },
  ],


  images: [
    {
      data: String,
      originalFileName: String,
      publicId: String,
      contentType: String,
    },
  ],
  youtubeUrl: {
    type: String,
  },
  productDetails: {
    type: String,
  },
  warrantyDetails: {
    type: String,
  },
  technicalDetails: {
    type: String,
  },

  rating: {
    type: Number,
  },
  comments: [
    {
      userName: String,
      userEmail: String,
      comment: String,
      likes: Number,
      disLikes: Number,
    },
  ],
  freqAskedQuest: [
    {
      userName: String,
      userEmail: String,
      question: String,
      answer: String,
      comment: String,
      likes: Number,
      disLikes: Number,
    },
  ],

  issueReports: [
    {
      userName: String,
      userEmail: String,
      topic: String,
      content: String,
      dateOfFormSubmission: String,
    },
  ],
  totalSold: {
    type: Number,
    default:0
  },
  totalCart: {
    type: Number,
    default:0
  },

  createdByName: {
    type: String,
  },
  createdByType: {
    type: String,
  },
  dateOfFormSubmission: {
    type: String,
  },
});

const NewProduct = new mongoose.model("W_Mark_Products", ProductsSchema);
module.exports = NewProduct;
