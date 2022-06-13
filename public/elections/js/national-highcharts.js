//Tally Lok Sabha
Highcharts.chart('tally_lok_sabha', {
chart: {
    backgroundColor:'rgba(255, 255, 255, 0.0)',
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie'
  },	
  title: {
    text: '',
    align: 'center',
    verticalAlign: 'middle',
    y: 50
  },
  tooltip: {
    pointFormat: '<b>{point.percentage:.1f}</b>'
  },
  plotOptions: {
    pie: {
      dataLabels: {
        enabled: true,
        distance: -50,
        style: {
          fontWeight: 'bold',
          color: 'black'
        }
      },
      startAngle: -90,
      endAngle: 90,
      center: ['50%', '50%']
    }
  },
	
colors: ["#ff5429", "#41ac38", "#00311f", "#128548", "#0255c7", "#ff0000", "#9f0606", "#db7b03", "#27a4ff", "#8d8d8d"],
  series: [{
    type: 'pie',
    name: '',
    innerSize: '50%',
    data: [
      ['BJP', 35], ['Cong', 25], ['AITC', 15], ['BJD', 14], ['BSP', 20], ['CPI', 18], ['DMK', 11], ['NCP', 17], ['RJD', 16], ['Others', 10],	
    ]
  }]
});