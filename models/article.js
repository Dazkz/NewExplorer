const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: (link) => validator.isURL(link),
  },
  image: {
    type: String,
    required: true,
    validate: (link) => validator.isURL(link),
  },
  owner: {
    type: String,
    select: false,
  },
  __v: {
    type: Number,
    select: false,
  },
});
module.exports = mongoose.model('article', articleSchema);
