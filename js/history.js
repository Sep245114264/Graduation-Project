class Window
{
  constructor(nodeName, config)
  {
    this.canvas = document.querySelector(nodeName);
    this.dateList = ['4.1', '4.2', '4.3', '4.4', '4.5'];
    this.data = ['12', '13', '10', '10', '13'];
    this.config = config;
  }
  
  setUI()
  {
    let canvas = this.canvas,
        context = canvas.getContext('2d'),
        config = this.config || {},
        dateList = this.dateList,
        data = this.data;
    new Chart(context, {
      type: config.type || 'line',
      data: {
        labels: dateList,
        datasets: [{
          label: config.label || '曲线1',
          borderColor: config.borderColor || 'red',
          backgroundColor: config.backgroundColor || 'red',
          data: data,
          fill: config.isFill || false,
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              callback: function(value, index, values)
              {
                return value + config.unit || value;
              }
            },
          }]
        },
        title: {
          display: true,
          text: config.chartTitle || '历史曲线',
        },
        legend: {
          display: true,
          position: config.legendPosition || 'left',
        }
      }
    })
  }
}

class Temperature extends Window
{
  constructor(nodeName, config)
  {
    super(nodeName, config);
    this.setUI();
    this._init();
  }
  _init()
  {
    let dateNode = document.querySelector('#temperature-date');
    dateNode.addEventListener('change', () => {
      console.log(`post ${dateNode.value}`);
    })
  }
}

class Fah extends Window
{
  constructor(nodeName, config)
  {
    super(nodeName, config);
    this.setUI();
  }
}

class Humidity extends Window
{
  constructor(nodeName, config)
  {
    super(nodeName, config);
    this.setUI();
  }
}

class Lux extends Window
{
  constructor(nodeName, config)
  {
    super(nodeName, config);
    this.setUI();
  }
}

temperature = new Temperature('#history-temperature-canvas', {
  label: '摄氏度',
  borderColor: 'red',
  backgroundColor: 'red',
  unit: '°C',
  chartTitle: '摄氏度历史曲线',
})

fah = new Fah('#history-fah-canvas', {
  label: '华氏度',
  borderColor: 'orange',
  backgroundColor: 'orange',
  unit: '°F',
  chartTitle: '华氏度历史曲线'
})

humidity = new Humidity('#history-humidity-canvas', {
  label: '湿度',
  borderColor: 'blue',
  backgroundColor: 'blue',
  unit: '%',
  chartTitle: '湿度历史曲线',
})

lux = new Lux('#history-lux-canvas', {
  label: '光照度',
  borderColor: 'yellow',
  backgroundColor: 'yellow',
  chartTitle: '光照度历史曲线'
})