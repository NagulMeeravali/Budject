const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Please enter a category title",
    trim: true
  },
  slug: String,
  created: {
    type: Date,
    default: Date.now
  },
  color: {
    type: String,
    unique: true,
    trim: true
  },
  creator: String
});

module.exports = mongoose.model('Category', categorySchema);