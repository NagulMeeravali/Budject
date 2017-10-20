const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const moment = require('moment');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Please enter the name of the item.",
    trim: true
  },
  amount: {
    type: Number,
    required: 'Please enter the cost of the item.',
    trim: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: 'Please supply the category this item belongs to.'
  },
  date: {
    type: Date,
    required: 'Please enter the date this transaction took place.',
    trim: true
  }
});

itemSchema.statics.getItemsByCat = function getItemsByCat(category) {
  return this.aggregate([
    {
      $match: {
        category: mongoose.Types.ObjectId(category),
      }
    }
  ]);
}

itemSchema.statics.getItemsByCatAndMonth = function getItemsByCatAndMonth(category) {
  const startOfMonth = moment().startOf('month');
  const endOfMonth = moment().endOf('month');

  return this.aggregate([
    {
      $match: {
        category: mongoose.Types.ObjectId(category),
        date: { $gte: new Date(startOfMonth), $lte: new Date(endOfMonth) }
      }
    }
  ]);
}

itemSchema.statics.sumItemsByCategory = function sumItemsByCategory(category) {
  const startOfMonth = moment().startOf('month');
  const endOfMonth = moment().endOf('month');

  return this.aggregate([
    {
      $match: {
        category: mongoose.Types.ObjectId(category),
        date: { $gte: new Date(startOfMonth), $lte: new Date(endOfMonth) }
      }
    },
    {
      $group: {
        _id: null,
        sum: { $sum: "$amount"}
      }
    }
  ]);
}

// Static method - count number of items per category per month
itemSchema.statics.numItemsByCategory = function numItemsByCategory(category) {
  const startOfMonth = moment().startOf('month');
  const endOfMonth = moment().endOf('month');

  return this.aggregate([
    {
      $match: {
        category: mongoose.Types.ObjectId(category),
        date: { $gte: new Date(startOfMonth), $lte: new Date(endOfMonth) }
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1}
      }
    }
  ]);
}

module.exports = mongoose.model('Item', itemSchema);