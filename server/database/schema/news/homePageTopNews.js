const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Home_Page_TopNews = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
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
    iconClass: {
        type: String,
    },
    status: {
        type: String,
        default: "Active"
    },

    dateOfFormSubmission: {
        type: String,
    },
});

const HomePageTopNews = new mongoose.model(
    "W_Mark_Home_Page_TopNews",
    W_Mark_Home_Page_TopNews
);
module.exports = HomePageTopNews;
