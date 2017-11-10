'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function yearGraphs(category) {
  var year = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : moment().startOf('year').format('YYYY');

  axios.get('/api/category/' + category + '/items?year=' + year).then(function (res) {
    var data = res.data;
    var valuesObj = Object.values(data['sumByMonth'][year]);
    var labelsObj = Object.keys(data['sumByMonth'][year]);
    var labels = labelsObj.map(function (label) {
      return label;
    });
    var items = valuesObj.map(function (value) {
      var valueItems = value.items;
      var arr = [];
      valueItems.forEach(function (item) {
        arr.push(item.amount);
      });
      return arr;
    });

    var sum = valuesObj.map(function (value) {
      return value.sum;
    });
    var budgeted = data['sumByMonth']['budgeted'].toFixed(2);
    var label = 'Amount Spent Per Month \u2014 Budget: $' + budgeted;
    var ctx = document.getElementById("categoryChart");

    var backgroundColor = [];

    sum.map(function (value) {
      if (value <= budgeted) {
        backgroundColor.push('#17B890');
      } else {
        backgroundColor.push('#DB504A');
      }
    });

    var barData = {
      labels: labels,
      datasets: [{
        label: label,
        data: sum,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        borderWidth: 1,
        fill: false
      }]
    };

    var lineData = {
      labels: labels,
      datasets: [{
        label: label,
        data: sum,
        borderColor: '#748386',
        pointBackgroundColor: backgroundColor,
        pointBorderColor: backgroundColor,
        borderWidth: 2,
        fill: false
      }]
    };

    var options = {
      title: {
        display: true,
        fontSize: 18,
        text: category.charAt(0).toUpperCase() + category.slice(1) + ' Spending for ' + year
      },
      legend: {
        labels: {
          boxWidth: 0
        }
      },
      scales: {
        xAxes: [{
          stacked: true,
          ticks: {
            callback: function callback(tick) {
              return moment(tick, 'MM').format('MMM');
            }
          }
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            beginAtZero: true,
            type: 'linear',
            ticks: {
              min: 0,
              max: 6500,
              stepSize: 1300
            },
            callback: function callback(value, index, values) {
              return '$' + value;
            }
          }
        }]
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        displayColors: false,
        backgroundColor: '#FAFFFD',
        titleFontFamily: "'Lora', serif",
        titleFontSize: 16,
        titleFontColor: '#252323',
        titleMarginBottom: 8,
        bodyFontFamily: "'Lora', serif",
        bodyFontSize: 12,
        bodyFontColor: '#252323',
        bodySpacing: 10,
        callbacks: {
          title: function title(tooltipItem) {
            return moment(this._data.labels[tooltipItem[0].index], 'MM').format('MMMM');
          },
          label: function label(tooltipItems, data) {
            return '$' + tooltipItems.yLabel.toFixed(2);
          }
        }
      },
      hover: {
        onHover: function onHover(e) {
          ctx.style.cursor = e[0] ? "pointer" : "default";
        }
      }
    };

    var categoryChart = new Chart(ctx, {
      type: 'bar',
      data: barData,
      options: options
    });

    var chartBtns = [].concat(_toConsumableArray(document.querySelectorAll('button.chartBtn')));
    var chartBtnVal = 'bar';
    if (chartBtns) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = chartBtns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var chartBtn = _step.value;

          chartBtn.addEventListener('click', function (e) {
            chartBtnVal = this.value;
            categoryChart.destroy();
            if (chartBtnVal === 'line') {
              categoryChart = new Chart(ctx, {
                type: 'line',
                data: lineData,
                options: options
              });
            } else if (chartBtnVal === 'bar') {
              categoryChart = new Chart(ctx, {
                type: 'bar',
                data: barData,
                options: options
              });
            }
          });
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

    ctx.onclick = function (evt) {
      var activePoints = categoryChart.getElementsAtEvent(evt);
      var firstPoint = activePoints[0];
      var label = categoryChart.data.labels[firstPoint._index];
      var value = categoryChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
      if (firstPoint !== undefined) window.location.href = window.location.href.split('?')[0] + '?month=' + label + '&year=' + year;
    };
  });
}
'use strict';

function generateRandomColor() {
  var digits = '0123456789ABCDEF';
  var hash = '#';
  for (var i = 0; i < 6; i++) {
    hash += digits[Math.floor(Math.random() * 16)];
  }
  return hash;
}

function monthGraphs(category) {
  var year = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : moment().startOf('year').format('YYYY');

  axios.get('/api/category/' + category + '/items?year=' + year).then(function (res) {
    var data = res.data;
    var valuesObj = Object.values(data['sumByMonth'][year]);

    var catMonth = document.querySelector('.datepicker .month').textContent;
    var catYear = document.querySelector('.datepicker .year').textContent;
    var budgeted = data['sumByMonth']['budgeted'].toFixed(2);
    var queriedSum = data['sumByMonth'][moment().year(catYear).format("YYYY")][moment().month(catMonth).format("M")].sum;
    var queriedMonthData = data['sumByMonth'][moment().year(catYear).format("YYYY")][moment().month(catMonth).format("M")].items;
    var pieArr = [];
    queriedMonthData.map(function (item) {
      pieArr.push(item.amount);
    });

    var labelArr = [];
    queriedMonthData.map(function (item) {
      labelArr.push(item.title);
    });

    var ctx = document.getElementById("categoryPieChart");

    var backgroundColor = [];
    for (var i = 0; i < labelArr.length; i++) {
      var color = generateRandomColor();
      backgroundColor.push(color);
    }

    // If budget hasn't been exceeded, add in remaining section to pie chart
    var itemSum = pieArr.reduce(function (sum, value) {
      return sum + value;
    });
    var unspent = budgeted - itemSum;

    if (unspent > 0) {
      pieArr.push(unspent);
      labelArr.push('Remaining in Budget');
      backgroundColor.push('#748386');
    }

    console.log(backgroundColor);
    var pieData = {
      labels: labelArr,
      datasets: [{
        data: pieArr,
        borderColor: '#748386',
        backgroundColor: backgroundColor,
        borderWidth: 1,
        fill: false
      }]
    };

    var options = {
      title: {
        display: true,
        padding: 20,
        fontSize: 22,
        text: category.charAt(0).toUpperCase() + category.slice(1) + ' Spending for ' + catMonth + year
      },
      legend: {
        display: false,
        labels: {
          boxWidth: 0
        }
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        displayColors: false,
        backgroundColor: '#FAFFFD',
        titleFontFamily: "'Lora', serif",
        titleFontSize: 16,
        titleFontColor: '#252323',
        titleMarginBottom: 10,
        bodyFontFamily: "'Lora', serif",
        bodyFontSize: 12,
        bodyFontColor: '#252323',
        bodySpacing: 10,
        callbacks: {
          title: function title(tooltipItem) {
            return this._data.labels[tooltipItem[0].index];
          },
          label: function label(tooltipItems, data) {
            var percent = (Number(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]) / queriedSum * 100).toFixed(2);
            var cost = '$' + data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index].toFixed(2);
            var percentStatement = percent + '% of total spending';
            var tooltip = new Array(cost, percentStatement);
            return tooltip;
          }
        }
      },
      hover: {
        onHover: function onHover(e) {
          ctx.style.cursor = e[0] ? "pointer" : "default";
        }
      }
    };

    var categoryChart = new Chart(ctx, {
      type: 'pie',
      data: pieData,
      options: options
    });
  });
}
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function loadAllItems() {
  var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : moment().startOf('year').format('YYYY');

  axios.get('/api/categories/items?year=' + year).then(function (res) {
    var data = res.data;
    var labels = Object.keys(data['sumByMonth'][year]);
    var values = Object.values(data['sumByMonth'][year]);
    var budgeted = data['sumByMonth']['totalBudget'].toFixed(2);
    var ctx = document.getElementById("dashboardChart");
    var label = 'Total Monthly Budget: $' + budgeted;

    var backgroundColor = [];

    values.map(function (value) {
      if (value <= budgeted) {
        backgroundColor.push('#17B890');
      } else {
        backgroundColor.push('#DB504A');
      }
    });

    var barData = {
      labels: labels,
      datasets: [{
        label: label,
        data: values,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        borderWidth: 1,
        fill: false
      }]
    };

    var lineData = {
      labels: labels,
      datasets: [{
        label: label,
        data: values,
        borderColor: '#748386',
        pointBackgroundColor: backgroundColor,
        pointBorderColor: backgroundColor,
        borderWidth: 2,
        fill: false
      }]
    };

    var options = {
      responsive: true,
      title: {
        display: true,
        fontSize: 18,
        text: 'Spending for ' + year
      },
      legend: {
        labels: {
          boxWidth: 0
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            callback: function callback(tick) {
              return moment(tick, 'MM').format('MMM');
            }
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function callback(value, index, values) {
              return '$' + value;
            }
          }
        }]
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        displayColors: false,
        backgroundColor: '#FAFFFD',
        titleFontFamily: "'Lora', serif",
        titleFontSize: 16,
        titleFontColor: '#252323',
        titleMarginBottom: 8,
        bodyFontFamily: "'Lora', serif",
        bodyFontSize: 12,
        bodyFontColor: '#252323',
        bodySpacing: 10,
        callbacks: {
          title: function title(tooltipItem) {
            return moment(this._data.labels[tooltipItem[0].index], 'MM').format('MMMM');
          },
          label: function label(tooltipItems, data) {
            return '$' + tooltipItems.yLabel.toFixed(2);
          }
        }
      },
      hover: {
        onHover: function onHover(e) {
          ctx.style.cursor = e[0] ? "pointer" : "default";
        }
      }
    };

    var categoryChart = new Chart(ctx, {
      type: 'bar',
      data: barData,
      options: options
    });

    var chartBtns = [].concat(_toConsumableArray(document.querySelectorAll('button.chartBtn')));
    var chartBtnVal = 'bar';
    if (chartBtns) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = chartBtns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var chartBtn = _step.value;

          chartBtn.addEventListener('click', function (e) {
            e.preventDefault();
            chartBtnVal = this.value;
            categoryChart.destroy();
            if (chartBtnVal === 'line') {
              categoryChart = new Chart(ctx, {
                type: 'line',
                data: lineData,
                options: options
              });
            } else {
              categoryChart = new Chart(ctx, {
                type: 'bar',
                data: barData,
                options: options
              });
            }
          });
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

    ctx.onclick = function (evt) {
      var activePoints = categoryChart.getElementsAtEvent(evt);
      var firstPoint = activePoints[0];
      var label = categoryChart.data.labels[firstPoint._index];
      var value = categoryChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
      if (firstPoint !== undefined) window.location.href = window.location.href.split('?')[0] + '?month=' + label + '&year=' + year;
    };
  });
}
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
    if (amountInput.classList.contains('has-value')) {
      amountInput.parentElement.classList.add('active-element');
    }
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
        if (budgetSpentElement) {
          var budgetSpent = Number(budgetSpentElement.textContent.replace(/[^0-9\.-]+/g, ""));
          var budgetGoal = Number(detail.querySelector('.budget-goal').textContent.replace(/[^0-9\.-]+/g, ""));
          var budgetClass = budgetSpent > budgetGoal ? 'overspend' : 'underspend';
          budgetSpentElement.classList.add(budgetClass);
          parent.classList.add(budgetClass);
        }
      });
    }
  }

  changeBudgetColor();
})();