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
  otherInformation: {
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
  "W_Mark_Bank_Offers",
  BankOffersSchema
);
module.exports = NewBankOffers;
