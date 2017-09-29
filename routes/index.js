var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/categoryController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/categories', categoryController.getCategories);
router.get('/category/add', categoryController.addCategory)
router.post('/category/add', catchErrors(categoryController.createCategory));

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
