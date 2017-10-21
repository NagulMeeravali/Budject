'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*jslint browser:true */

(function () {
  'use strict';

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
    var today = moment().utc().format('YYYY-MM-DD');
    var dateInput = document.querySelector('input[type="date"]');

    dateInput.value = today;
  }

  if (document.querySelector('input[type="date"]')) {
    todayDate();
  }

  // Change color of budget spent number depending on if it exceeds or is lower than budget goal number

  function changeBudgetColor() {
    var budgetDetails = [].concat(_toConsumableArray(document.querySelectorAll('.budget-meta')));

    budgetDetails.forEach(function (detail) {
      var budgetSpentElement = detail.querySelector('.budget-spent');
      var budgetSpent = Number(budgetSpentElement.textContent.replace(/[^0-9\.-]+/g, ""));
      var budgetGoal = Number(detail.querySelector('.budget-goal').textContent.replace(/[^0-9\.-]+/g, ""));
      var budgetClass = budgetSpent >= budgetGoal ? 'overspend' : 'underspend';

      return budgetSpentElement.classList.add(budgetClass);
    });
  }

  changeBudgetColor();

  // Datepicker
  // if (document.querySelector('.datepicker')) {

  //   // const oldestItemDate = '!{oldestItem[0].date}'
  //   // const newestItemDate = '!{newestItem[0].date}'

  //   const picker = new Pikaday({ 
  //     field: document.querySelector('.datepicker'),
  //     onSelect: function() {
  //       document.querySelector('.datepicker').innerHTML = this.getMoment().format('MMMM YYYY');
  //         //- startDate = this.getDate();
  //         //- updateStartDate();
  //     }
  //   });
  // }

})();