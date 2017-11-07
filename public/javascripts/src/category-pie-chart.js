function monthGraphs(category, year = moment().startOf('year').format('YYYY')) {
axios.get(`/api/category/${category}/items?year=${year}`)
  .then(res => {
    const data = res.data;
    const labelsObj = Object.keys(data['sumByMonth'][year]);
    const labels = labelsObj.map((label) => {return label});

    const catMonth = document.querySelector('.datepicker .month').textContent;
    const catYear = document.querySelector('.datepicker .year').textContent;
    const queriedMonthData = data['sumByMonth'][moment().year(catYear).format("YYYY")][moment().month(catMonth).format("M")].items;
    const pieArr = [];
    queriedMonthData.map((item) => {
      pieArr.push(item.amount);
    })

    const labelArr = [];
    queriedMonthData.map((item) => {
      labelArr.push(item.title);
    })

    const budgeted = (data['sumByMonth']['budgeted'].toFixed(2));
    const label = `Amount Spent Per Month — Budget: $${budgeted}`;
    const ctx = document.getElementById("categoryPieChart");

    const backgroundColor = [];

    const pieData = {
      labels: labelArr,
      datasets: [{
        data: pieArr,
        borderColor: '#748386',
        backgroundColor: 'yellow',
        borderWidth: 1,
        fill: false
      }]
    }

    const options = {
      title: {
        display: true,
        fontSize: 18,
        text: `${category.charAt(0).toUpperCase() + category.slice(1)} Spending for ${catMonth} ${year}`
      },
      legend: {
        display: false,
        labels: {
          boxWidth: 0,
        }
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        displayColors: false,
        callbacks: {
          title: function(tooltipItem) { 
            return this._data.labels[tooltipItem[0].index];
          },
          label: function(tooltipItems, data) {
            return `$${(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]).toFixed(2)}`
          }
        }
      },
      hover: {
        onHover: function(e) {
          ctx.style.cursor = e[0] ? "pointer" : "default";
        }
      }
    }

    let categoryChart = new Chart(ctx, {
      type: 'pie',
      data: pieData,
      options
    });
  })
}
