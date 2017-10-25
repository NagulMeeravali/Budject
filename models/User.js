const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Please enter your name.",
    trim: true
  },
  email: {
    type: String,
    required: "Please enter your email address.",
    lowercase: true,
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid Email Address']
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  income: {
    type: Number,
    trim: true
  },
  categories: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }
});

module.exports = mongoose.model('User', userSchema);