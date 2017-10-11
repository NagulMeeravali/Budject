const mongoose = require('mongoose');
const Category = mongoose.model('Category');

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.render('categoryList', {categories});
};

exports.addCategory = (req, res) => {
  res.render('addCategory', { title: 'Add Category' });
}

exports.createCategory = async (req, res) => {
  const category = await (new Category(req.body)).save();
  res.redirect(`/category/${category._id}`);
}

exports.displayCategory = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  res.render('category', { title: `${category.title}`, category });
}

exports.deleteCategory = async (req, res) => {
  await Category.remove({ slug: req.params.slug });
  res.json({ category });
}