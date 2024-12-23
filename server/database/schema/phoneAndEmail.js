const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Phone_Email_Schema = new mongoose.Schema({
  email: {
    type: String,
  },
  emergencyNo: {
    type: Number,
  },
  loanEnquiryNo: {
    type: Number,
  },
  technicalHelpNo: {
    type: Number,
  },
  fraudComplaintNo: {
    type: Number,
  },
  newOffersNo: {
    type: Number,
  },
  dateOfFormSubmission: {
    type: String,
  },
});

const NewBankOffers = new mongoose.model(
  "W_Mark_Phone_Email",
  W_Mark_Phone_Email_Schema
);

module.exports = NewBankOffers;
