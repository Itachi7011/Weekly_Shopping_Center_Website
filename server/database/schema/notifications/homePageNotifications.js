const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Home_Page_Notifications = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  iconClass: {
    type: String,
  },
  status: {
    type: String,
    default:"Active"
  },

  dateOfFormSubmission: {
    type: String,
  },
});

const HomePageNotifications = new mongoose.model(
  "W_Mark_Home_Page_Notifications",
  W_Mark_Home_Page_Notifications
);
module.exports = HomePageNotifications;
