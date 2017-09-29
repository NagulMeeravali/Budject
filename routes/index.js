var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/categoryController');
const ItemController = require('../controllers/ItemController');
const { catchErrors } = require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/categories', categoryController.getCategories);
router.get('/category/add', categoryController.addCategory)
router.post('/category/add', catchErrors(categoryController.createCategory));

module.exports = router;
