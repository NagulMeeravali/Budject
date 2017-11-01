"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*jslint browser:true */

(function () {
  'use strict';

  function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
      return uri + separator + key + "=" + value;
    }
  }

  var dashboardCategoryFilter = document.querySelector('select[name=category-type-filter]');
  if (dashboardCategoryFilter) {
    dashboardCategoryFilter.addEventListener('change', function (e) {
      var sort = 'sort';
      var value = this.value;
      window.location.href = updateQueryStringParameter(window.location.href, sort, value);
    });
  }

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

  var formInputs = [].concat(_toConsumableArray(document.querySelectorAll('input:not([type=submit]):not([type=date]), select, textarea')));
  if (formInputs) {
    var _loop = function _loop(formInput) {
      if (formInput.value) {
        formInput.classList.add('has-value');
      }

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

  if (passwordInput && confirmPasswordInput) {
    confirmPasswordInput.addEventListener('keyup', function (e) {
      if (this.value !== passwordInput.value) {
        this.classList.add('invalid-input');
      } else {
        this.classList.remove('invalid-input');
        this.classList.add('passwords-match');
        passwordInput.classList.add('passwords-match');
      }
    });
  }

  // Add class to parent container when amount field is in focus
  var amountInput = document.querySelector('.amount-field input');

  function addAmountInputClass() {
    this.parentElement.classList.add('active-element');
  }

  function removeAmountInputClass() {
    if (this.value) {
      return;
    }

    this.parentElement.classList.remove('active-element');
  }

  if (amountInput) {
    amountInput.addEventListener('focus', addAmountInputClass, true);
    amountInput.addEventListener('blur', addAmountInputClass, true);
    amountInput.addEventListener('focusout', removeAmountInputClass, true);
  }

  // Change color of budget spent number depending on if it exceeds or is lower than budget goal number

  function changeBudgetColor() {
    var budgetDetails = [].concat(_toConsumableArray(document.querySelectorAll('.budget-meta')));

    if (budgetDetails) {
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
  }

  changeBudgetColor();
})();