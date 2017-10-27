const passport = require('passport');
const crypto = require('crypto'); // native node module
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', { 
  failureRedirect: '/login', 
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You have successfully logged out.');
  res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  req.flash('error', 'You must be logged in to access that page.');
  res.redirect('/login');
}