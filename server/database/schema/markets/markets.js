const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const MarketsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  state: {
    type: String,
  },
  district: {
    type: String,
  },
  location: {
    type: String,
  },
  totalShops: {
    type: String,
  },
  speciality: [{
    type: String,
  }],
  additionalComment: {
    type: String,
  },
  photo: {
    data: String,
    originalFileName: String,
    publicId: String,
    contentType: String,
  },
  createdBy: {
    type: String,
  },
  dateOfFormSubmission: {
    type: String,
  },
});

const NewMarket = new mongoose.model("W_Mark_Markets", MarketsSchema);
module.exports = NewMarket;
