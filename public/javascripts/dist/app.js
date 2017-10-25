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

  // Add class to form input if input has value

  var formInputs = [].concat(_toConsumableArray(document.querySelectorAll('input:not([type=submit]):not([type=date])')));
  if (formInputs) {
    var _loop = function _loop(formInput) {
      formInput.addEventListener('change', function (e) {
        if (formInput.value) {
          this.classList.add('has-value');
        } else {
          this.classList.remove('has-value');
        }
      });
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = formInputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var formInput = _step.value;

        _loop(formInput);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  // Add validation to email input as you type

  function validateEmail(email) {
    var emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailValidation.test(email);
  }

  var emailInputs = [].concat(_toConsumableArray(document.querySelectorAll('input[type=email]')));
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = emailInputs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var emailInput = _step2.value;

      emailInput.addEventListener('keydown', function (e) {
        if (validateEmail(this.value)) {
          this.classList.remove('invalid-input');
        } else {
          this.classList.add('invalid-input');
        }
      });
    }

    // Add validation to password and confirm password fields as you type
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var passwordInput = document.querySelector('input[name=password]');
  var confirmPasswordInput = document.querySelector('input[name=confirm-password]');

  confirmPasswordInput.addEventListener('keyup', function (e) {
    if (this.value !== passwordInput.value) {
      this.classList.add('invalid-input');
    } else {
      this.classList.remove('invalid-input');
    }
  });

  // Add class to parent container when income field is in focus
  var incomeInput = document.querySelector('input[name=income]');

  function addIncomeInputClass() {
    console.log(incomeInput);
    console.log(document.activeElement);
    if (incomeInput === document.activeElement) {
      this.parentElement.classList.add('active-element');
    } else {
      this.parentElement.classList.remove('active-element');
    }
  }

  incomeInput.addEventListener('click', addIncomeInputClass);
  incomeInput.addEventListener('keydown', addIncomeInputClass);

  // Change color of budget spent number depending on if it exceeds or is lower than budget goal number

  function changeBudgetColor() {
    var budgetDetails = [].concat(_toConsumableArray(document.querySelectorAll('.budget-meta')));

    budgetDetails.forEach(function (detail) {
      var parent = detail.parentElement.parentElement;
      var budgetSpentElement = detail.querySelector('.budget-spent');
      var budgetSpent = Number(budgetSpentElement.textContent.replace(/[^0-9\.-]+/g, ""));
      var budgetGoal = Number(detail.querySelector('.budget-goal').textContent.replace(/[^0-9\.-]+/g, ""));
      var budgetClass = budgetSpent > budgetGoal ? 'overspend' : 'underspend';

      budgetSpentElement.classList.add(budgetClass);
      parent.classList.add(budgetClass);
    });
  }

  changeBudgetColor();

  // const svg = d3.select("svg.line-chart"),
  // margin = {top: 20, right: 20, bottom: 30, left: 50},
  // width = +svg.attr("width") - margin.left - margin.right,
  // height = +svg.attr("height") - margin.top - margin.bottom,
  // g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // var parseTime = d3.timeParse("%d-%b-%y");

  // var x = d3.scaleTime()
  //     .rangeRound([0, width]);

  // var y = d3.scaleLinear()
  //     .rangeRound([height, 0]);

  // var line = d3.line()
  //     .x(function(d) { return x(d.date); })
  //     .y(function(d) { return y(d.close); });
})();