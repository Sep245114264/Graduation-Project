class Window
{
  constructor(nodeName, config)
  {
    this.canvas = document.querySelector(nodeName);
    this.handleChart = {
      'temperature': null,
      'fah': null,
      'humidity': null,
      'lux': null,
    };
    this.dateList = {
      'temperature': ['4.1', '4.2', '4.3', '4.4', '4.5'],
      'fah': ['4.1', '4.2', '4.3', '4.4', '4.5'],
      'humidity': ['4.1', '4.2', '4.3', '4.4', '4.5'],
      'lux': ['4.1', '4.2', '4.3', '4.4', '4.5'],
    }
    this.data = {
      'temperature': ['12', '13', '10', '10', '13'],
      'fah': ['12', '13', '10', '10', '13'],
      'humidity': ['12', '13', '10', '10', '13'],
      'lux': ['12', '13', '10', '10', '13'],
    }
    this.config = config;
  }
  
  setUI(type)
  {
    let canvas = this.canvas;
    canvas.width = canvas.width;
    let context = canvas.getContext('2d'),
        config = this.config || {},
        dateList = this.dateList[type],
        data = this.data[type];
    this.handleChart[type] = new Chart(context, {
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
  _init(type)
  {
    let dateNode = document.querySelector(`#${type}-date`);
    dateNode.addEventListener('change', () => {
      this._apiData(type, dateNode.value);
    })
  }
  _apiData(type, date)
  {
    axios.post('/smartHome/api/query/', {
      type: type === 'fah' ? 'temperature' : type,
      date
    })
    .then( ( { request }) => {
      let response = JSON.parse(request.response),
          result = [],
          resultDate = [];
      for( let i = 0; i < 24; ++i )
      {
        result.push(this._calAverage(response.data, i).toFixed(2));
        resultDate.push(i);
      }
      this.data[type] = type === 'fah' ? result.map( item => (Number(item) * 1.8 + 32).toFixed(2) ) : result;
      this.dateList[type] = resultDate;
      this.handleChart[type].destroy();
      this.setUI(type);
    })
  }
  _calAverage(array, hour)
  {
    let arrayFilter = array.filter( (item) => {
          return Number(item.date.substr(11,2)) === hour;
        });
    if(arrayFilter.length === 0)
    {
      return 0
    }
    let arrayTotal = arrayFilter.reduce( (total, item) => {
          return total += Number(item.data);
        }, 0);
    return arrayTotal / arrayFilter.length;
  }
}

class Temperature extends Window
{
  constructor(nodeName, config)
  {
    super(nodeName, config);
    this.setUI('temperature');
    this._init('temperature');
  }
}

class Fah extends Window
{
  constructor(nodeName, config)
  {
    super(nodeName, config);
    this.setUI('fah');
    this._init('fah');
  }
}

class Humidity extends Window
{
  constructor(nodeName, config)
  {
    super(nodeName, config);
    this.setUI('humidity');
    this._init('humidity');
  }
}

class Lux extends Window
{
  constructor(nodeName, config)
  {
    super(nodeName, config);
    this.setUI('lux');
    this._init('lux');
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