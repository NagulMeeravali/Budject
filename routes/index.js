var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Budgeter' });
});

router.get('/dashboard', catchErrors(userController.getDashboard));

// Category Routes

router.get('/categories', categoryController.getCategories);
router.get('/category/add', authController.isLoggedIn, categoryController.addCategory)
router.post('/category/add', catchErrors(categoryController.createCategory));
router.get('/category/:slug', catchErrors(categoryController.displayCategory));
router.get('/category/:slug/edit', catchErrors(categoryController.getCategory));
router.post('/category/:slug/edit', catchErrors(categoryController.updateCategory));
router.get(`/category/:slug/delete`, catchErrors(categoryController.deleteCategory));

// Item Routes

router.get(`/add`, authController.isLoggedIn, catchErrors(itemController.addItem));
router.post(`/add`, catchErrors(itemController.createItem));
router.get(`/add/:id`, catchErrors(itemController.getItem));
router.post(`/add/:id`, catchErrors(itemController.updateItem));
router.get(`/delete/:id`, catchErrors(itemController.deleteItem));

// User Routes

// login
router.get('/login', userController.loginForm);
router.post('/login', authController.login);

// register
router.get('/register', userController.registerForm);
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

// logout
router.get('/logout', authController.logout);

// dashboard
// edit 


// Month View - Show total amount budgeted and total amount spent
// Leftover money for savings - https://dribbble.com/shots/3685757-Finance-App-New-Budget/attachments/825117


module.exports = router;
