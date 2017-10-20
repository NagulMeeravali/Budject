const mongoose = require('mongoose');
const moment = require('moment');
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
  
  const oldestItem = await Item.getItemsByCat(category._id).sort({"date": 1}).limit(1);
  const newestItem = await Item.getItemsByCat(category._id).sort({ "date": -1 }).limit(1);
  const itemSum = await Item.sumItemsByCategory(category._id);
  const numItems = await Item.numItemsByCategory(category._id);
  const itemsByCatAndMonth = await Item.getItemsByCatAndMonth(category._id);

  res.render('category', { title: `${category.title}`, categories, category, oldestItem, itemSum: itemSum[0], numItems: numItems[0], itemsByCatAndMonth, oldestItem, newestItem });
}

exports.deleteCategory = async (req, res) => {
  await Category.remove({ slug: req.params.slug });
  res.json({ category });
}