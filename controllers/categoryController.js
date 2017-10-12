const mongoose = require('mongoose');
const Category = mongoose.model('Category');

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

exports.displayCategory = async (req, res) => {
  const categoriesPromise = Category.find().sort({title:1});
  const categoryPromise = Category.findOne({ slug: req.params.slug });
  const [categories, category] = await Promise.all([categoriesPromise, categoryPromise]);
  res.render('category', { title: `${category.title}`, categories, category });
}

exports.deleteCategory = async (req, res) => {
  await Category.remove({ slug: req.params.slug });
  res.json({ category });
}