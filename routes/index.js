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

// Category Routes

router.get('/:username/categories', categoryController.getCategories);
router.get('/:username/category/add', authController.isLoggedIn, categoryController.addCategory)
router.post('/:username/category/add', catchErrors(categoryController.createCategory));
router.get('/:username/category/:slug', catchErrors(categoryController.displayCategory));
router.get('/:username/category/:slug/edit', catchErrors(categoryController.getCategory));
router.post('/:username/category/:slug/edit', catchErrors(categoryController.updateCategory));
router.get(`/:username/category/:slug/delete`, catchErrors(categoryController.deleteCategory));

// Item Routes

router.get(`/:username/add`, authController.isLoggedIn, catchErrors(itemController.addItem));
router.post(`/:username/add`, catchErrors(itemController.createItem));
router.get(`/:username/add/:id`, catchErrors(itemController.getItem));
router.post(`/:username/add/:id`, catchErrors(itemController.updateItem));
router.get(`/:username/delete/:id`, catchErrors(itemController.deleteItem));

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
router.get('/:username/dashboard', authController.isLoggedIn, catchErrors(userController.getDashboard));

// edit 
router.get('/:username/account', authController.isLoggedIn, userController.account);
router.post('/:username/account', catchErrors(userController.updateAccount));

// Month View - Show total amount budgeted and total amount spent
// Leftover money for savings - https://dribbble.com/shots/3685757-Finance-App-New-Budget/attachments/825117


module.exports = router;
