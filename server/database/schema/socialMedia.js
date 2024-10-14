const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Social_Media_Schema = new mongoose.Schema({
  facebookId: {
    type: String,
  },
  instagramId: {
    type: String,
  },
  twitterId: {
    type: String,
  },
  linkedInId: {
    type: String,
  },
  dateOfFormSubmission: {
    type: String,
  },
});

const NewBankOffers = new mongoose.model(
  "W_Mark_Social_Media",
  W_Mark_Social_Media_Schema
);
module.exports = NewBankOffers;
