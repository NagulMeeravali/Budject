const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const Item = mongoose.model('Item');

exports.addItem = async (req, res) => {
  const categoryList = await Category.find();
  res.render('editItem', { title: 'Add Item', categoryList});
}

exports.createItem = async (req, res) => {
  const item = await (new Item(req.body)).save();
  res.json(item);
}