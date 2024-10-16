const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Tags = new mongoose.Schema({
  tagName: {
    type: String,
  },
  content: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  dateOfFormSubmission: {
    type: String,
  },
});

const NewTags = new mongoose.model(
  "W_Mark_Tags",
  W_Mark_Tags
);
module.exports = NewTags;
