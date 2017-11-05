/*jslint browser:true */

(function () {
  'use strict';

  function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
      return uri + separator + key + "=" + value;
    }
  }

  const dashboardCategoryFilter = document.querySelector('select[name=category-type-filter]');
  if (dashboardCategoryFilter) {
    dashboardCategoryFilter.addEventListener('change', function(e) {
      const sort = 'sort';
      const value = this.value;
      window.location.href = updateQueryStringParameter(window.location.href, sort, value);
    });
  }
  
  // Mobile Menu Toggle Functionality
  const mobileMenuIcon = document.querySelector('.mobile-menu-toggle');

  const mobileMenuToggle = function () {
    mobileMenuIcon.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector('body').classList.toggle('menu-open');
    });
  };

  mobileMenuToggle();

  // Add class to form input if input has value

  const formInputs = [...document.querySelectorAll('input:not([type=submit]):not([type=date]), select, textarea')];
  if (formInputs) {
    for (const formInput of formInputs) {
      if (formInput.value) {
        formInput.classList.add('has-value');
      }
      
      formInput.addEventListener('change', function(e) {
        if (formInput.value) {
          this.classList.add('has-value');
        } else {
          this.classList.remove('has-value');
        }
      })
    }
  }

  // Add validation to email input as you type

  function validateEmail(email) {
    const emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailValidation.test(email);
  }

  const emailInputs = [...document.querySelectorAll('input[type=email]')];
  for (const emailInput of emailInputs) {
    emailInput.addEventListener('keydown', function(e) {
      if (validateEmail(this.value)) {
        this.classList.remove('invalid-input');
      } else {
        this.classList.add('invalid-input');
      }
    });
  }

  // Add validation to password and confirm password fields as you type

  const passwordInput = document.querySelector('input[name=password]');
  const confirmPasswordInput = document.querySelector('input[name=confirm-password]');

  if (passwordInput && confirmPasswordInput) {
    confirmPasswordInput.addEventListener('keyup', function(e) {
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
  const amountInput = document.querySelector('.amount-field input');

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
    if (amountInput.classList.contains('has-value')) {
      amountInput.parentElement.classList.add('active-element');
    }
    amountInput.addEventListener('focus', addAmountInputClass, true);
    amountInput.addEventListener('blur', addAmountInputClass, true);
    amountInput.addEventListener('focusout', removeAmountInputClass, true)
  }

  // Change color of budget spent number depending on if it exceeds or is lower than budget goal number

  function changeBudgetColor() {
    const budgetDetails = [...document.querySelectorAll('.budget-meta')];

    if (budgetDetails) {
      budgetDetails.forEach(detail => {
        const parent = detail.parentElement.parentElement;
        const budgetSpentElement = detail.querySelector('.budget-spent');
        const budgetSpent = Number(budgetSpentElement.textContent.replace(/[^0-9\.-]+/g, ""));
        const budgetGoal = Number(detail.querySelector('.budget-goal').textContent.replace(/[^0-9\.-]+/g, ""));
        const budgetClass = budgetSpent > budgetGoal ? 'overspend' : 'underspend';

        budgetSpentElement.classList.add(budgetClass);
        parent.classList.add(budgetClass);
      });
    }
  }
  
  changeBudgetColor();

}());
