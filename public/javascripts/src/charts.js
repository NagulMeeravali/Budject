function loadItems(category, year = moment().startOf('year').format('YYYY')) {
  axios.get(`/api/category/${category}?year=${year}`)
    .then(res => {
      const data = res.data;
      console.log(data['sumByMonth'][year])
      const labels = Object.keys(data['sumByMonth'][year]);
      const values = Object.values(data['sumByMonth'][year]);
      const budgeted = data['sumByMonth']['budgeted'];

      const ctx = document.getElementById("categoryChart");

      const backgroundColor = [];

      values.map((value) => {
        if (value <= budgeted) {
          backgroundColor.push('#17B890');
        } else {
          backgroundColor.push('#DB504A')
        }
      })

      const categoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Amount Spent Per Month',
            data: values,
            backgroundColor,
            borderColor: backgroundColor,
            borderWidth: 1
          }]
        },
        options: {
          title: {
            display: true,
            text: `${category.charAt(0).toUpperCase() + category.slice(1)} Spending for ${year}`
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                callback: function(value, index, values) {
                    return '$' + value;
                }
              }
            }]
          }
        }
      });
    })
  }

  
