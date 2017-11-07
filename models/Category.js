const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');


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
  amount: {
    type: Number,
    trim: true
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  },
  icon: String
  },
  {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  }
);

categorySchema.pre('save', async function(next) {
  if (!this.isModified('title')) {
    next();
    return;
  };

  this.slug = slug(this.title, {lower: true});

  next();
});

// Get entries where the item's category property === category _id property
categorySchema.virtual('entries', {
  ref: 'Item', // what model to link?
  localField: '_id', // which field on the item?
  foreignField: 'category' // which field on the review?
});

function autopopulate(next) {
  this.populate('entries');
  next();
}

categorySchema.pre('find', autopopulate);
categorySchema.pre('findOne', autopopulate);

// Return sum of money budgeted per category per month
categorySchema.statics.budgetedPerMonth = function budgetedPerMonth(user) {
  return this.aggregate([
    {
      $match: {
        author: mongoose.Types.ObjectId(user._id),
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

module.exports = mongoose.model('Category', categorySchema);