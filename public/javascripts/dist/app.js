'use strict';

/*jslint browser:true */

(function () {
  'use strict';

  console.log('test');

  // Mobile Menu Toggle Functionality
  var mobileMenuIcon = document.querySelector('.mobile-menu-toggle');

  var mobileMenuToggle = function mobileMenuToggle() {
    mobileMenuIcon.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector('body').classList.toggle('menu-open');
    });
  };

  mobileMenuToggle();

  // Add today's date as value to date input

  function todayDate() {
    var today = moment().format('YYYY-MM-DD');
    var dateInput = document.querySelector('input[type="date"]');

    dateInput.value = today;
  }

  todayDate();
})();