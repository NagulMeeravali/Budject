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

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i'); 

  // pass regex into query
  const categoriesWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (categoriesWithSlug.length) { // if slug already exists
    this.slug = `${this.slug}-${categoriesWithSlug.length + 1}`; // create a new slug and with number value at the end
  }

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

// Return sum of money spent per category per month


module.exports = mongoose.model('Category', categorySchema);