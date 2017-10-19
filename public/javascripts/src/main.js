/*jslint browser:true */

(function () {
  'use strict';

  console.log('test');

  // Mobile Menu Toggle Functionality
  const mobileMenuIcon = document.querySelector('.mobile-menu-toggle');

  const mobileMenuToggle = function () {
    mobileMenuIcon.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector('body').classList.toggle('menu-open');
    });
  };

  mobileMenuToggle();

  // Add today's date as value to date input

  function todayDate() {
    const today = moment().format('YYYY-MM-DD');
    const dateInput = document.querySelector('input[type="date"]');

    dateInput.value = today;
  }

  todayDate();

}());
