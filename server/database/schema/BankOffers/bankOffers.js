const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const BankOffersSchema = new mongoose.Schema({
  bankName: {
    type: String,
  },
  tenure: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  processingFees: {
    type: String,
  },
  rateOfInterest: {
    type: String,
  },
  prepaymentCharges: {
    type: String,
  },
  loanAmount: {
    type: String,
  },
  foreclosureCharges: {
    type: String,
  },

  logo: {
    data: String,
    publicId:String,
    contentType: String,
  },

  dateOfFormSubmission: {
    type: String,
  },
});

const NewBankOffers = new mongoose.model(
  "Bank_Offers_Details",
  BankOffersSchema
);
module.exports = NewBankOffers;
