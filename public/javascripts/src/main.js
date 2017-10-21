/*jslint browser:true */

(function () {
  'use strict';

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
    const today = moment().utc().format('YYYY-MM-DD');
    const dateInput = document.querySelector('input[type="date"]');

    dateInput.value = today;
  }

  if (document.querySelector('input[type="date"]')) {
    todayDate();
  }

  // Change color of budget spent number depending on if it exceeds or is lower than budget goal number

  function changeBudgetColor() {
    const budgetDetails = [...document.querySelectorAll('.budget-meta')];

    budgetDetails.forEach(detail => {
      const budgetSpentElement = detail.querySelector('.budget-spent');
      const budgetSpent = Number(budgetSpentElement.textContent.replace(/[^0-9\.-]+/g, ""));
      const budgetGoal = Number(detail.querySelector('.budget-goal').textContent.replace(/[^0-9\.-]+/g, ""));
      const budgetClass = budgetSpent >= budgetGoal ? 'overspend' : 'underspend';

      return budgetSpentElement.classList.add(budgetClass);
    });
  }
  
  changeBudgetColor();

  // Datepicker
  if (document.querySelector('.datepicker')) {
    // const oldestItemDate = '!{oldestItem[0].date}'
    // const newestItemDate = '!{newestItem[0].date}'


  }


}());
