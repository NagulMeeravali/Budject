const fs = require('fs');

exports.moment = require('moment');

// debugging function
exports.dump = (obj) => JSON.stringify(obj, null, 2);

exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.siteName = `Budgeter`;

exports.menu = [
  { slug: '/about', title: 'About' }
];

exports.formatPrice = function(amount) {
  return `$${(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}