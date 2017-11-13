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
    default: Date.now(),
    required: 'Please enter the date this transaction took place.',
    trim: true
  },
  receipt: String,
  description: {
    type: String,
    trim: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
});

// Get all items by queried category
itemSchema.statics.getItemsByCat = function getItemsByCat(category) {
  return this.aggregate([
    {
      $match: {
        category: mongoose.Types.ObjectId(category),
      }
    }
  ]);
}

// Get all items in queried month
itemSchema.statics.getItemsByMonth = function getItemsByMonth(author, start, end) {
  return this.aggregate([
    {
      $match: {
        author: mongoose.Types.ObjectId(author),
        date: { $gte: new Date(start), $lte: new Date(end) }
      }
    }
  ]);
}

// Get all items in queried category and queried month
itemSchema.statics.getItemsByCatAndMonth = function getItemsByCatAndMonth(category, start, end) {
  return this.aggregate([
    {
      $match: {
        category: mongoose.Types.ObjectId(category),
        date: { $gte: new Date(start), $lte: new Date(end) }
      }
    }
  ]);
}

// Sum all items from a queried date range
itemSchema.statics.spentPerMonth = function spentPerMonth(user, start, end) {
  return this.aggregate([
    {
      $match: {
        author: mongoose.Types.ObjectId(user._id),
        date: { $gte: new Date(start), $lte: new Date(end) }
      }
    },
    {
      $group: {
        _id: null,
        sum: { $sum: "$amount" }
      }
    }
  ])
}

// Sum the items in a queried category by queried date range
itemSchema.statics.sumItemsByCategory = function sumItemsByCategory(category, start, end) {
  return this.aggregate([
    {
      $match: {
        category: mongoose.Types.ObjectId(category),
        date: { $gte: new Date(start), $lte: new Date(end) }
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

// Get all items in category between queried date range
itemSchema.statics.getItemsByQueriedYear = function getItemsByQueriedYear(author, category, start, end = start) {
  return this.aggregate([
    {
      $match: {
        author: mongoose.Types.ObjectId(author),
        category: mongoose.Types.ObjectId(category),
        date: { $gte: new Date(moment(start).startOf('year')), $lte: new Date(moment(end).endOf('year')) }
      }
    }
  ]);
}

// Get all items between queried date range
itemSchema.statics.getItemsByQueriedYearNoCat = function getItemsByQueriedYearNoCat(author, start, end = start) {
  return this.aggregate([
    {
      $match: {
        author: mongoose.Types.ObjectId(author),
        date: { $gte: new Date(moment(start).startOf('year')), $lte: new Date(moment(end).endOf('year')) }
      }
    }
  ]);
}

// Static method - count number of items per category per month
itemSchema.statics.numItemsByCategory = function numItemsByCategory(category, start, end) {
  return this.aggregate([
    {
      $match: {
        category: mongoose.Types.ObjectId(category),
        date: { $gte: new Date(start), $lte: new Date(end) }
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