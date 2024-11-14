const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Admin_Navbar_Setting_Content = new mongoose.Schema({
    name: {
        type: String,

    },
    link: {
        type: String,
    },
    details: {
        type: String,
    },
    createdByName: {
        type: String,
    },
    createdByEmail: {
        type: String,
    },
    dateOfFormSubmission: {
        type: String,
    },
});

const NewCategories = new mongoose.model(
    "W_Mark_Admin_Navbar_Setting_Content",
    W_Mark_Admin_Navbar_Setting_Content
);
module.exports = NewCategories;
