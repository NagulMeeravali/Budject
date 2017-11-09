const mongoose = require('mongoose');
const moment = require('moment');
const Category = mongoose.model('Category');
const Item = mongoose.model('Item');

const confirmOwner = (item, user) => {
  if (!item.author.equals(user._id)) {
    throw Error('You must own a item to view it!');
  }
};

exports.addItem = async (req, res) => {
  const categoryList = await Category.find({ author: req.user });
  const category = await Category.findOne({slug: req.query.ref});
  const referrer = (category) ? category._id : "";
  res.render('editItem', { title: 'Add Item', categoryList, referrer });
}

exports.createItem = async (req, res) => {
  req.body.author = req.user._id;
  req.body.date = moment(req.body.date).utc();
  const item = await (new Item(req.body)).save();
  const category = await Category.findOne({_id: req.body.category})
  res.redirect(`/category/${category.slug}`);
}

exports.getItem = async (req, res) => {
  const categoryList = await Category.find({author: req.user});
  const item = await Item.findOne({_id: req.params.id});
  confirmOwner(item, req.user)
  res.render('editItem', { title: `Edit ${item.title}`, item, categoryList});
}

exports.updateItem = async (req, res) => {
  const categoryList = await Category.find();
  req.body.date = moment(req.body.date).utc();
  const item = await Item.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
  const category = await Category.findOne({_id: req.body.category})
  confirmOwner(item, req.user)
  res.redirect(`/category/${category.slug}`);
}

exports.deleteItem = async (req, res) => {
  const item = await Item.findByIdAndRemove({ _id: req.params.id });
  req.flash('success', 'Your transaction was successfully deleted.')
  res.redirect('back');
}

exports.sumAmount = async(req, res, next) => {
  const sum = Item.sumAmount();
  next();
}