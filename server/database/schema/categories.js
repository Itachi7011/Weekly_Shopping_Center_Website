const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Categories = new mongoose.Schema({
  categoryName: {
    type: String,

  },
  subCategoryName: [{

    type: String,


  }],
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

const NewCategories = new mongoose.model(
  "W_Mark_Categories",
  W_Mark_Categories
);
module.exports = NewCategories;
