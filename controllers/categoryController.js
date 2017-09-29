const mongoose = require('mongoose');
const Category = mongoose.model('Category');

exports.getCategories = (req, res) => {
  res.render('index');
};

exports.addCategory = (req, res) => {
  res.render('addCategory', { title: 'Add Category' });
}

exports.createCategory = async (req, res) => {
  const category = await (new Category(req.body)).save();
  res.redirect('/');
}

