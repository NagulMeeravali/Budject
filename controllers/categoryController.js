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
  const startDate = (req.query.month && req.query.year) ? moment().year(req.query.year).month(req.query.month - 1).startOf('month') : moment().startOf('month');
  const endDate = (req.query.month && req.query.year) ? moment().year(req.query.year).month(req.query.month - 1).endOf('month') : moment().endOf('month');
  const month = startDate.format('MMMM');
  const year = startDate.format('YYYY');

  const categoriesPromise = Category.find().sort({title:1});
  const categoryPromise = Category.findOne({ slug: req.params.slug });
  const [categories, category] = await Promise.all([categoriesPromise, categoryPromise]);
  
  const oldestItem = await Item.getItemsByCat(category._id).sort({"date": 1}).limit(1);
  const newestItem = await Item.getItemsByCat(category._id).sort({ "date": -1 }).limit(1);
  const itemSum = await Item.sumItemsByCategory(category._id, startDate, endDate);
  const numItems = await Item.numItemsByCategory(category._id, startDate, endDate);
  const itemsByCatAndMonth = await Item.getItemsByCatAndMonth(category._id, startDate, endDate);
  
  res.render('category', { title: `${category.title}`, month, year, categories, category, oldestItem, itemSum: itemSum[0], numItems: numItems[0], itemsByCatAndMonth, oldestItem, newestItem });
}

exports.deleteCategory = async (req, res) => {
  await Category.remove({ slug: req.params.slug });
  res.json({ category });
}