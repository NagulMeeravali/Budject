const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

// Validate registration form
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.sanitizeBody('income');

  req.checkBody('name', 'Please supply a name.').notEmpty();
  req.checkBody('email', 'Please enter a valid email address.').isEmail();

  // Allow dots, extensions and subaddresses
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });

  req.checkBody('password', 'Password cannot be blank.').notEmpty();
  req.checkBody('confirm-password', 'Confirm password cannt be blank.').notEmpty();

  req.checkBody('confirm-password', 'Your passwords do not match. Please try again.').equals(req.body.password);

  const errors = req.validationErrors(); 
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;
  }
  next();
}

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name, income: req.body.income })

  const registerWithPromise = promisify(User.register, User);

  await registerWithPromise(user, req.body.password); // encrypts password
  next();
}