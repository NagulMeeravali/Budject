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

exports.updateItem = async (req, res) => {
  const categoryList = await Category.find();
  const item = await Item.findOne({_id: req.params.id});
  res.render('editItem', { title: `Edit ${item.title}`, item, categoryList});
}

exports.deleteItem = async (req, res) => {
  await Item.findByIdAndRemove({ _id: req.params.id });
  res.json({ message: 'Item deleted'})
}