var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');
const { catchErrors } = require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// Category Routes

router.get('/categories', categoryController.getCategories);
router.get('/category/add', categoryController.addCategory)
router.post('/category/add', catchErrors(categoryController.createCategory));

// Item Routes

router.get('/add', catchErrors(itemController.addItem));
router.post(`/add`, catchErrors(itemController.createItem));
router.get(`/add/:id`, catchErrors(itemController.updateItem));
router.get(`/delete/:id`, catchErrors(itemController.deleteItem));

module.exports = router;
