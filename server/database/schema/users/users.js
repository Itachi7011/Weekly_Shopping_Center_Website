const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { buffer } = require("stream/consumers");

const NewUserRegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    // ,
    // require : true
  },
  firstName: {
    type: String,
    // ,
    // require : true
  },
  lastName: {
    type: String,
    // ,
    // require : true
  },
  email: {
    type: String,
    // ,
    // require : true
  },
  gender: {
    type: String,
  },
  userType: [
    String
  ],
  phoneNo: {
    type: Number,
    // ,
    // require : true
  },
  state: {
    type: String,
    // ,
    // require : true
  },
  country: {
    type: String,
    // ,
    // require : true
  },
  location: {
    type: String,
    // ,
    // require : true
  },
  location: {
    type: String,
    // ,
    // require : true
  },sublocation:{
    type:String
  },
  dateOfFormSubmission: {
    type: String,
  },
  dateOfEmailValidation: {
    type: String,
  },
  emailVerification: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  blockedBy: {
    type: String
  },
  password: {
    type: String,
    // ,
    // require : true
  },
  cpassword: {
    type: String,
    require: true,
  },
  tokens: {
    type: String,
  },
});

// NewUserRegistrationSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// NewUserRegistrationSchema.methods.generateAuthToken = async function () {
//   try {
//     let token1 = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
//       expiresIn: "2592000000",
//     });
//     this.tokens = token1;
//     await this.save();
//     return token1;
//   } catch (err) {
//     console.log(err);
//   }
// };

const NewUserRegistration = new mongoose.model(
  "Users",
  NewUserRegistrationSchema
);
module.exports = NewUserRegistration;
