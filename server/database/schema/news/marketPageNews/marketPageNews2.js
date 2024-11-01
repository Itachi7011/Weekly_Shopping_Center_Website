const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Market_Page_News2 = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    iconClass: {
        type: String,
    },
    logoImage:
    {
        data: String,
        originalFileName: String,
        publicId: String,
        contentType: String,
    },
    images: [
        {
            data: String,
            originalFileName: String,
            publicId: String,
            contentType: String,
        },
    ],

    status: {
        type: String,
        default: "Active"
    },

    dateOfFormSubmission: {
        type: String,
    },
});

const MarketPageNews2 = new mongoose.model(
    "W_Mark_Market_Page_News2",
    W_Mark_Market_Page_News2
);
module.exports = MarketPageNews2;
