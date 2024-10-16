const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const W_Mark_Navbar_Items = new mongoose.Schema({
  itemName: {
    type: String
  },
  itemLink: {
    type: String
  },
  itemIcon: {
    type: String
  },
  subItems: [
    {
      name: String,
      link: String,
    },
  ],
  createdBy: {
    type: String,
  },
  dateOfFormSubmission: {
    type: String,
  },
});

const NewNavbarItems = new mongoose.model(
  "W_Mark_Navbar_Items",
  W_Mark_Navbar_Items
);
module.exports = NewNavbarItems;
