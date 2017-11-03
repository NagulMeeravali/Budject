function loadAllItems(year = moment().startOf('year').format('YYYY')) {
axios.get(`/api/categories/items?year=${year}`)
  .then(res => {
    const data = res.data;
    const labels = Object.keys(data['sumByMonth'][year]);
    const values = Object.values(data['sumByMonth'][year]);
    const budgeted = data['sumByMonth']['totalBudget'];
    const ctx = document.getElementById("dashboardChart");
    const label = `Total Monthly Budget: $${budgeted}`;

    const backgroundColor = [];

    values.map((value) => {
      if (value <= budgeted) {
        backgroundColor.push('#17B890');
      } else {
        backgroundColor.push('#DB504A')
      }
    });

    const categoryChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label,
          data: values,
          backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 1
        }]
      },
      options: {
        title: {
          display: true,
          text: `Spending for ${year}`
        },
        legend: {
          labels: {
            boxWidth: 0,
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              callback: function(tick) {
                return moment(tick).format('MMM');
              }
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                  return '$' + value;
              }
            }
          }]
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            displayColors: false,
            callbacks: {
                title: function(tooltipItem) { 
                  return moment(this._data.labels[tooltipItem[0].index]).format('MMMM');
                },
                label: function(tooltipItems, data) { 
                  return `$${tooltipItems.yLabel}`;
                }
            }
        },
        hover: {
          onHover: function(e) {
            ctx.style.cursor = e[0] ? "pointer" : "default";
          }
        }
      }
    });

    ctx.onclick = function(evt){
      const activePoints = categoryChart.getElementsAtEvent(evt);
      const firstPoint = activePoints[0];
      const label = categoryChart.data.labels[firstPoint._index];
      const value = categoryChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
      if (firstPoint !== undefined)
        window.location.href = `${window.location.href.split('?')[0]}?month=${label}&year=${year}`
    };
  })
}

