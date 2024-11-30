const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_HomePage_Top_Carousel = new mongoose.Schema({

    redirectLink: {
        type: String,
    },
    images:
        [{
            data: String,
            originalFileName: String,
            publicId: String,
            contentType: String,
        }],
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
    "W_Mark_HomePage_Top_Carousel",
    W_Mark_HomePage_Top_Carousel
);
module.exports = MarketPageSpecificAdvetises;
