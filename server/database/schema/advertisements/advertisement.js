const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Advertises = new mongoose.Schema({
    sponserName: {
        type: String,
    },
    phoneNo: {
        type: String,
    },
    email: {
        type: String,
    },
    redirectLink: {
        type: String,
    },
    isEnable: {
        type: Boolean,
        default: false,
    },

    position: [{
        type: String,
    }],

    subCategories: [{
        type: String,
    }],
    tags: [{
        type: String,
    }],
    image:
    {
        data: String,
        originalFileName: String,
        publicId: String,
        contentType: String,
    },
    content: {
        type: String,
    },
    createdByName: {
        type: String,
    },
    createdByEmail: {
        type: String,
    },
    createdByUserType: {
        type: String,
    },
    dateOfFormSubmission: {
        type: String,
    },
});

const MarketPageSpecificAdvetises = new mongoose.model(
    "W_Mark_Advertises",
    W_Mark_Advertises
);
module.exports = MarketPageSpecificAdvetises;
