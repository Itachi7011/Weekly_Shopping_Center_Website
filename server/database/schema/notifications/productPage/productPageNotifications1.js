const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Product_Page_Notifications1 = new mongoose.Schema({
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
    status: {
        type: String,
        default: "Active"
    },

    dateOfFormSubmission: {
        type: String,
    },
});

const ProductPageNotifications1 = new mongoose.model(
    "W_Mark_Product_Page_Notifications1",
    W_Mark_Product_Page_Notifications1
);
module.exports = ProductPageNotifications1;
