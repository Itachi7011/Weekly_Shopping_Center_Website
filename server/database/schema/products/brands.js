const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Brands = new mongoose.Schema({
  brandName: {
    type: String,

  },
  categoryName: {
    type: String,

  },
  brandOfficialWebsite: {
    type: String,
  },
  content: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  dateOfFormSubmission: {
    type: String,
  },
});

const NewBramd = new mongoose.model(
  "W_Mark_Brands",
  W_Mark_Brands
);
module.exports = NewBramd;
