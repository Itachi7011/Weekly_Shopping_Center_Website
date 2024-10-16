const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Enquiry_Schema = new mongoose.Schema({
  loanAmount: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  city: {
    type: String,
  },
  status: {
    type: String,
  },

  dateOfFormSubmission: {
    type: String,
  },
});

const NewBankOffers = new mongoose.model(
  "W_Mark_Enquiry",
  W_Mark_Enquiry_Schema
);
module.exports = NewBankOffers;
