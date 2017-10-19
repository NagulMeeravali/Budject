const mongoose = require('mongoose');
const db = mongoose.connection;
const Category = mongoose.model('Category');
const Item = mongoose.model('Item');

exports.getCategories = async (req, res) => {
  const categories = await Category.find().sort({ title: 1 });
  res.render('categoryList', {categories});
};

exports.addCategory = (req, res) => {
  res.render('addCategory', { title: 'Add Category' });
}

exports.createCategory = async (req, res) => {
  const category = await (new Category(req.body)).save();
  res.redirect(`/category/${category.slug}`);
}

exports.getCategory = async (req, res) => {
  const category = await Category.findOne({slug: req.params.slug});
  res.render('editCategory', { title: `Edit ${category.title}`, category});
}

exports.updateCategory = async (req, res) => {
  const category = await Category.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
  res.redirect(`/category/${category.slug}`);
}

exports.displayCategory = async (req, res) => {
  const categoriesPromise = Category.find().sort({title:1});
  const categoryPromise = Category.findOne({ slug: req.params.slug });

  const [categories, category] = await Promise.all([categoriesPromise, categoryPromise]);
  const itemSum = await Item.sumItemsByCategory(category._id)
  console.log(typeof(itemSum))

  res.render('category', { title: `Category: ${category.title}`, categories, category, itemSum: itemSum[0] });
}

exports.deleteCategory = async (req, res) => {
  await Category.remove({ slug: req.params.slug });
  res.json({ category });
}