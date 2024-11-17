const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Market_Page_Specific_Advetises = new mongoose.Schema({
    sponserName: {
        type: String,
    },
    content: {
        type: String,
    },
    position: [{
        type: String,
    }],
    categories: [{
        type: String,
    }],

    subCategories: [{
        type: String,
    }],
    tags: [{
        type: String,
    }],
    logoImage:
    {
        data: String,
        originalFileName: String,
        publicId: String,
        contentType: String,
    },

    images:
    [{
        data: String,
        originalFileName: String,
        publicId: String,
        contentType: String,
    }],
    status: {
        type: String,
        default: "Active"
    },

    dateOfFormSubmission: {
        type: String,
    },
});

const MarketPageSpecificAdvetises = new mongoose.model(
    "W_Mark_Market_Page_Specific_Advetises",
    W_Mark_Market_Page_Specific_Advetises
);
module.exports = MarketPageSpecificAdvetises;
