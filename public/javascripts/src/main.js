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

  // Add class to form input if input has value

  const formInputs = [...document.querySelectorAll('input:not([type=submit]):not([type=date])')];
  if (formInputs) {
    for (const formInput of formInputs) {
      formInput.addEventListener('change', function(e) {
        if (formInput.value) {
          this.classList.add('has-value');
        } else {
          this.classList.remove('has-value');
        }
      })
    }
  }

  // Change color of budget spent number depending on if it exceeds or is lower than budget goal number

  function changeBudgetColor() {
    const budgetDetails = [...document.querySelectorAll('.budget-meta')];

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
}());
