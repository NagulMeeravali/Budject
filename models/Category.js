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
  creator: String,
  items: Array
  },
  {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  }
);

// Get entries where the item's category property === category _id property
categorySchema.virtual('entries', {
  ref: 'Item', // what model to link?
  localField: '_id', // which field on the store?
  foreignField: 'category' // which field on the review?
});

function autopopulate(next) {
  this.populate('entries');
  next();
}

categorySchema.pre('find', autopopulate);
categorySchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Category', categorySchema);