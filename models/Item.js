const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Please enter the name of the item",
    trim: true
  },
  amount: {
    type: Number,
    required: 'Please enter the cost of the item',
    trim: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: 'Please supply the category this item belongs to'
  }
});

module.exports = mongoose.model('Item', itemSchema);