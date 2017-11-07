const mongoose = require('mongoose');
const moment = require('moment');
const db = mongoose.connection;
const Category = mongoose.model('Category');
const Item = mongoose.model('Item');

const confirmOwner = (category, user) => {
  if (!category.author.equals(user._id)) {
    throw Error('You must own a category to view it!');
  }
};

exports.getCategories = async (req, res) => {
  if (typeof(req.user) === 'undefined' || !req.user) {
    req.flash('error', 'You must login to see your categories');
    res.redirect('/login');
  }

  const startDate = (req.query.month && req.query.year) ? moment().year(req.query.year).month(req.query.month - 1).startOf('month') : moment().startOf('month');
  const endDate = (req.query.month && req.query.year) ? moment().year(req.query.year).month(req.query.month - 1).endOf('month') : moment().endOf('month');
  const month = startDate.format('MMMM');
  const year = startDate.format('YYYY');
  const categories = await Category.find({'author' : req.user._id}).sort({ title: 1 });
  const itemArr = await Promise.all(categories.map(async (category) => {
    const count = await Item.numItemsByCategory(category._id, startDate, endDate);
    const itemSum = await Item.sumItemsByCategory(category._id, startDate, endDate);
    return [(count[0] || '0'), itemSum[0] || '0'];
  }));

  res.render('categoryList', {categories, itemArr, month, year});
};

exports.addCategory = (req, res) => {
  res.render('addCategory', { title: 'Add Category' });
}

exports.createCategory = async (req, res) => {
  req.body.author = req.user._id;
  const category = await (new Category(req.body)).save();
  res.redirect(`/category/${category.slug}`);
}

exports.getCategory = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, 'author': req.user._id});
  confirmOwner(category, req.user);
  res.render('editCategory', { title: `Edit ${category.title}`, category});
}

exports.updateCategory = async (req, res) => {
  const category = await Category.findOneAndUpdate({ slug: req.params.slug, 'author': req.user._id }, req.body, { new: true });
  confirmOwner(category, req.user);
  res.redirect(`/category/${category.slug}`);
}

exports.displayCategory = async (req, res) => {
  const startDate = (req.query.month && req.query.year) ? moment().year(req.query.year).month(req.query.month - 1).startOf('month') : moment().startOf('month');
  const endDate = (req.query.month && req.query.year) ? moment().year(req.query.year).month(req.query.month - 1).endOf('month') : moment().endOf('month');
  const month = startDate.format('MMMM');
  const year = startDate.format('YYYY');

  const categoriesPromise = Category.find({ 'author': req.user._id }).sort({title:1});
  const categoryPromise = Category.findOne({ slug: req.params.slug, 'author': req.user._id });
  const [categories, category] = await Promise.all([categoriesPromise, categoryPromise]);
  
  let oldestItem = await Item.getItemsByCat(category._id).sort({"date": 1}).limit(1);
  if (oldestItem.length === 0) {
    oldestItem = [{'date': new Date()}];
  }
  let newestItem = await Item.getItemsByCat(category._id).sort({ "date": -1 }).limit(1);
  if (newestItem.length === 0) {
    newestItem = [{'date': new Date()}];
  }
  const itemSum = await Item.sumItemsByCategory(category._id, startDate, endDate);
  const numItems = await Item.numItemsByCategory(category._id, startDate, endDate);
  const itemsByCatAndMonth = await Item.getItemsByCatAndMonth(category._id, startDate, endDate);
  const getItemsByQueriedYear = await Item.getItemsByQueriedYear(category._id, startDate, endDate);
  confirmOwner(category, req.user);
  
  res.render('category', { title: `${category.title}`, slug: `${category.slug}`, month, year, categories, category, oldestItem, itemSum: itemSum[0], numItems: numItems[0], itemsByCatAndMonth, getItemsByQueriedYear, oldestItemDate: oldestItem[0].date, newestItemDate: newestItem[0].date });
}

exports.deleteCategory = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, 'author': req.user._id});
  await Category.remove({ slug: req.params.slug, 'author': req.user._id });
  req.flash('success', `You have successfully deleted the ${category.title} category`);
  res.redirect('/dashboard');
}

// Retrieve how much was spent per category over timespan
exports.getCategoryData = async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug, 'author': req.user._id });
  next();
}

// API Endpoint - Get item amounts in queried calendar year
exports.getItemAmountsQueriedYear = async(req, res, next) => {
  const queriedYear = (req.query.year) ? moment().year(req.query.year).startOf('year') : moment().startOf('year');
  const year = queriedYear.format('YYYY');
  const categoriesPromise = Category.find({ 'author': req.user._id }).sort({title:1});
  const categoryPromise = Category.findOne({ slug: req.params.slug, 'author': req.user._id });
  const [categories, category] = await Promise.all([categoriesPromise, categoryPromise]);
  const getItemsByQueriedYear = await Item.getItemsByQueriedYear(category._id, queriedYear);
  const categoryItems = {};

  getItemsByQueriedYear.forEach((item) => {
    const date = new Date(item.date),
    year = date.getUTCFullYear(),
    month = date.getUTCMonth() + 1;
    const title = item.title;
    const amount = item.amount;

    categoryItems[year] = categoryItems[year] || {};
    categoryItems[year][month] = categoryItems[year][month] || [];
    categoryItems[year][month].push({title, amount, date});
  });

  res.json(categoryItems);
}

// API Endpoint - Sum items for months in queried calendar year
exports.sumItemsByMonthQueriedYear = async (req, res, next) => {
  const queriedYear = (req.query.year) ? moment().year(req.query.year).startOf('year') : moment().startOf('year');
  const year = queriedYear.format('YYYY');
  const categoriesPromise = Category.find({ 'author': req.user._id }).sort({title:1});
  const categoryPromise = Category.findOne({ slug: req.params.slug, 'author': req.user._id });
  const [categories, category] = await Promise.all([categoriesPromise, categoryPromise]);
  const getItemsByQueriedYear = await Item.getItemsByQueriedYear(category._id, queriedYear);
  const sumByMonth = {};

  getItemsByQueriedYear.forEach((item) => {
    const date = new Date(item.date),
    year = date.getUTCFullYear(),
    month = date.getUTCMonth() + 1,
    budgeted = category.amount,
    title = item.title,
    amount = item.amount;

    sumByMonth['budgeted'] = budgeted || 0;
    sumByMonth[year] = sumByMonth[year] || {};
    sumByMonth[year][month] = sumByMonth[year][month] || {};
    sumByMonth[year][month]['items'] = sumByMonth[year][month]['items'] || [];
    sumByMonth[year][month]['sum'] = sumByMonth[year][month]['sum'] || 0;
    sumByMonth[year][month]['items'].push({title, amount, date});
  });

  for (let i = 1; i < 13; i++) {
    const monthItems = sumByMonth[year][i]
    if (typeof(monthItems) !== 'undefined') {
      const itemsArr = monthItems.items;
      const sumsArr = []
      itemsArr.forEach((item) => sumsArr.push(item.amount));
      const sum = sumsArr.reduce((sum, value) => sum + value);
      sumByMonth[year][i]['sum'] = sum;
    }
  }

  res.json({ sumByMonth });
}

// API Endpoint - Sum items for months in queried calendar year regardless of category
exports.sumItemsByMonthQueriedYearNoCat = async (req, res, next) => {
  const queriedYear = (req.query.year) ? moment().year(req.query.year).startOf('year') : moment().startOf('year');
  const year = queriedYear.format('YYYY');
  const categoriesPromise = Category.find({ 'author': req.user._id }).sort({title:1});
  const categoryPromise = Category.findOne({ slug: req.params.slug, 'author': req.user._id });
  const [categories, category] = await Promise.all([categoriesPromise, categoryPromise]);

  const getItemsByQueriedYear = await Item.getItemsByQueriedYearNoCat(queriedYear);
  const sumByMonth = {};

  const totalBudgetArr = [];
  categories.map((category => totalBudgetArr.push(category.amount)));

  const totalBudget = totalBudgetArr.reduce((sum, value) => sum + value);
  sumByMonth['totalBudget'] = totalBudget;

  getItemsByQueriedYear.forEach((item) => {
    const date = new Date(item.date),
      year = date.getUTCFullYear(),
      month = date.getUTCMonth() + 1;

    sumByMonth[year] = sumByMonth[year] || {};
    sumByMonth[year][month] = sumByMonth[year][month] || [];
    sumByMonth[year][month].push(item.amount);
  });

  for (let i = 1; i < 13; i++) {
    const c = sumByMonth[year][i]
    if (typeof (c) !== 'undefined') {
      const b = c.reduce((sum, value) => sum + value)
      sumByMonth[year][i] = b
    }
}

  res.json({ sumByMonth });
}

// query for last 12 months? 