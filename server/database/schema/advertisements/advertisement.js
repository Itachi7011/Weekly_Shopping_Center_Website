const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Advetises = new mongoose.Schema({
    sponserName: {
        type: String,
    },
    phoneNo: {
        type: String,
    },
    email: {
        type: String,
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
    createdByUserType: {
        type: String,
    },
    dateOfFormSubmission: {
        type: String,
    },
});

const MarketPageSpecificAdvetises = new mongoose.model(
    "W_Mark_Advetises",
    W_Mark_Advetises
);
module.exports = MarketPageSpecificAdvetises;
