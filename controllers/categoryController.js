const mongoose = require('mongoose');
const Category = mongoose.model('Category');

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.addCategory = (req, res) => {
  res.render('addCategory', { title: 'Add Category' });
}

exports.createCategory = async (req, res) => {
  const category = await (new Category(req.body)).save();
  res.redirect(`/category/${category._id}`);
}

exports.displayCategory = async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id });
  res.json({category});
}

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndRemove({ _id: req.params.id });
  res.json({ category });
}