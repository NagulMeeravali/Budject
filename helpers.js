const fs = require('fs');

exports.moment = require('moment');

// debugging function
exports.dump = (obj) => JSON.stringify(obj, null, 2);

exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.siteName = `Budgeter`;

exports.userMenu = [
  { slug: '/dashboard', title: 'Dashboard' },
  { slug: '/categories', title: 'Categories' },
  { slug: '/account', title: 'Account' },
  { slug: '/logout', title: 'Logout' }
];

exports.generalMenu = [
  { slug: '/login', title: 'Login' },
  { slug: '/register', title: 'Register' }
];

exports.formatPrice = function(amount) {
  return `$${(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}