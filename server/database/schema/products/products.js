const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  metaTitle: {
    type: String,
  },

  metaKeyword: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  
  articleCategory1: {
    type: String,
    default:""
  },
  articleCategory: {
    type: String,
    default:""
  },
  articleContent: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  articleImage: {
    data: String,
    publicId:String,
    contentType: String,
  }, 
   youtubeUrl: {
    type: String,
  },
  developerName: {
    type: String,
    default:""
  },projectName: {
    type: String,
    default:""
  },
  status: {
    type: String,
  },
  dateOfFormSubmission: {
    type: String,
  },
});

const NewArticles = new mongoose.model(
  "Articles",
  ArticleSchema
);
module.exports = NewArticles;
