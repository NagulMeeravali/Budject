const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(categoryController.getCategories));
router.get('/add', categoryController.addCategory)
router.post('/add', catchErrors(categoryController.createCategory));

module.exports = router;