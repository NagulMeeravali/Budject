const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Please enter your name.",
    trim: true
  },
  email: {
    type: String,
    required: "Please enter your email address.",
    trim: true,
    unique: true
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