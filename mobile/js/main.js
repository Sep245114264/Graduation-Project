class Window
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
    }
}

class Temperature extends Window
{
    constructor(canvasWidth, canvasHeight, canvasID)
    {
        super(canvasWidth, canvasHeight);
        this.canvas = document.querySelector(canvasID);
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext('2d');
        this.cur = 0;
        this.CONFIG = this._setUIConfig();
        this.chart = null;
        this.data = {
            temperature:['23', '21', '22', '25', '23', '24'],
            fah: ['73.4', '69.8', '71.6', '77', '73.4', '75.2']
        };
        this.date = ['3.22', '3.23', '3.24', '3.25', '3.26', '3.27'];
        this._drawUI();
    }
    _setUIConfig()
    {
        let CANVAS_WIDTH = this.width,
            MARGIN_TOP = 20,
            MERCURY_LENGTH = 400,
            MERCURY_WIDTH = 20,
            SCALE_LENGTH = 14,
            SUB_SCALE_LENGTH = 8,
            CELSIUS_UNIT_OFFSET = {
                X: -75,
                Y: 30,
            },
            FAH_UNIT_OFFSET = {
                x: 50,
                y:30,
            },
            CELSIUS_GRADUATION_OFFSET = -10,
            FAH_GRADUATION_OFFSET = 10,
            GRADUATION_OFFSET = 20,
            CELSIUS_GRADUATION_NUMBER = 35,
            CELSIUS_GRADUATION_LENGTH = MERCURY_LENGTH - 50,
            FAH_GRADUATION_NUMBER = 65,
            FAH_GRADUATION_LENGTH = MERCURY_LENGTH - 40
        return {
            MERCURY_LENGTH: MERCURY_LENGTH,
            MERCURY_WIDTH: MERCURY_WIDTH,
            LIQUID_COLUMN: {
                LEFT: {
                    START: {
                        x: CANVAS_WIDTH / 2 - MERCURY_WIDTH / 2,
                        Y: MARGIN_TOP,
                    },
                    END: {
                        x: CANVAS_WIDTH / 2 - MERCURY_WIDTH / 2,
                        y: MARGIN_TOP + MERCURY_LENGTH,
                    },
                },
                RIGHT: {
                    START: {
                        x: CANVAS_WIDTH / 2 + MERCURY_WIDTH / 2,
                        Y: MARGIN_TOP,
                    },
                    END: {
                        x: CANVAS_WIDTH / 2 + MERCURY_WIDTH / 2,
                        y: MARGIN_TOP + MERCURY_LENGTH,
                    },
                },
            },
            CELSIUS: {
                UNIT: {
                    FONT: "20px Arial",
                    TEXT_BASELINE: "bottom",
                    TEXT_ALIGN: "start",
                    x: CANVAS_WIDTH / 2 - MERCURY_WIDTH / 2 - SCALE_LENGTH + CELSIUS_UNIT_OFFSET.X,
                    y: MARGIN_TOP + CELSIUS_UNIT_OFFSET.Y,
                },
                MERCURY: {
                    FONT: "20px Arial",
                    TEXT_BASELINE: "middle",
                    TEXT_ALIGN: "end",
                    x: CANVAS_WIDTH / 2 - MERCURY_WIDTH / 2 - SCALE_LENGTH + CELSIUS_GRADUATION_OFFSET,
                    y: MARGIN_TOP + GRADUATION_OFFSET,
                },
            },
            FAH: {
                UNIT: {
                    FONT: "20px Arial",
                    TEXT_BASELINE: "bottom",
                    TEXT_ALIGN: "start",
                    x: CANVAS_WIDTH / 2 + MERCURY_WIDTH / 2 + SCALE_LENGTH + FAH_UNIT_OFFSET.x,
                    y: MARGIN_TOP + FAH_UNIT_OFFSET.y,
                },
                MERCURY: {
                    FONT: "20px Arial",
                    TEXT_BASELINE: "middle",
                    TEXT_ALIGN: "start",
                    x: CANVAS_WIDTH / 2 + MERCURY_WIDTH / 2 + SCALE_LENGTH + FAH_GRADUATION_OFFSET,
                    y: MARGIN_TOP + GRADUATION_OFFSET,
                }
            },
            GRADUATION: {
                CELSIUS: {
                    TOTAL: CELSIUS_GRADUATION_NUMBER,
                    per: CELSIUS_GRADUATION_LENGTH / CELSIUS_GRADUATION_NUMBER,
                    SCALE_START: {
                        x: CANVAS_WIDTH / 2 - MERCURY_WIDTH / 2 - SCALE_LENGTH,
                        y: MARGIN_TOP + GRADUATION_OFFSET,
                    },
                    SUB_SCALE_START: {
                        x: CANVAS_WIDTH / 2 - MERCURY_WIDTH / 2 - SUB_SCALE_LENGTH,
                        y: MARGIN_TOP + GRADUATION_OFFSET,
                    },
                    END: {
                        x: CANVAS_WIDTH / 2 - MERCURY_WIDTH / 2,
                        y: MARGIN_TOP + GRADUATION_OFFSET,
                    }
                },
                FAH: {
                    TOTAL: FAH_GRADUATION_NUMBER,
                    per: FAH_GRADUATION_LENGTH / FAH_GRADUATION_NUMBER,
                    SCALE_START: {
                        x: CANVAS_WIDTH / 2 + MERCURY_WIDTH / 2 + SCALE_LENGTH,
                        y: MARGIN_TOP + GRADUATION_OFFSET,
                    },
                    SUB_SCALE_START: {
                        x: CANVAS_WIDTH / 2 + MERCURY_WIDTH / 2 + SUB_SCALE_LENGTH,
                        y: MARGIN_TOP + GRADUATION_OFFSET,
                    },
                    END: {
                        x: CANVAS_WIDTH / 2 + MERCURY_WIDTH / 2,
                        y: MARGIN_TOP + GRADUATION_OFFSET,
                    }
                }
            },
            BUBBLE: {
                START: {
                    x: CANVAS_WIDTH / 2 + MERCURY_WIDTH / 2,
                    y: MARGIN_TOP + MERCURY_LENGTH,
                },
                CIRCLE: {
                    CENTER: {
                        x: CANVAS_WIDTH / 2,
                        y: MARGIN_TOP + MERCURY_LENGTH + 20-3,
                    },
                    RAIDUS: 20,
                    STARTING_ANGLE: -1/3 * Math.PI,
                    END_ANGLE: 4/3 * Math.PI,
                },
            }
        }
    }
    _setFont(fontConfig)
    {
        let context = this.context;
        context.font = fontConfig.FONT;
        context.textBaseline = fontConfig.TEXT_BASELINE;
        context.textAlign = fontConfig.TEXT_ALIGN;
    }
    _drawUI()
    {
        let CONFIG = this.CONFIG,
            context = this.context,
            CELSIUS_MAX = 50,
            FAH_MAX = 120,
            counts = 0;

        // 液柱区域
        context.moveTo(CONFIG.LIQUID_COLUMN.LEFT.START.x, CONFIG.LIQUID_COLUMN.LEFT.START.Y);
        context.lineTo(CONFIG.LIQUID_COLUMN.LEFT.END.x, CONFIG.LIQUID_COLUMN.LEFT.END.y);
        context.moveTo(CONFIG.LIQUID_COLUMN.RIGHT.START.x, CONFIG.LIQUID_COLUMN.RIGHT.START.Y);
        context.lineTo(CONFIG.LIQUID_COLUMN.RIGHT.END.x, CONFIG.LIQUID_COLUMN.RIGHT.END.y);
        context.arc(CONFIG.BUBBLE.CIRCLE.CENTER.x, CONFIG.BUBBLE.CIRCLE.CENTER.y, CONFIG.BUBBLE.CIRCLE.RAIDUS, 
            CONFIG.BUBBLE.CIRCLE.STARTING_ANGLE, CONFIG.BUBBLE.CIRCLE.END_ANGLE);
        context.lineTo(CONFIG.LIQUID_COLUMN.RIGHT.END.x, CONFIG.LIQUID_COLUMN.RIGHT.END.y);
        // 摄氏
        this._setFont(CONFIG.CELSIUS.UNIT);
        context.fillText("°C", CONFIG.CELSIUS.UNIT.x, CONFIG.CELSIUS.UNIT.y);
        // 刻度
        this._setFont(CONFIG.CELSIUS.MERCURY);
        for (let i = 0, count = 0; i < CONFIG.GRADUATION.CELSIUS.TOTAL+1; ++i, ++count)
        {
            if (count % 5 == 0)
            {
                context.moveTo(CONFIG.GRADUATION.CELSIUS.SCALE_START.x, 
                    CONFIG.GRADUATION.CELSIUS.SCALE_START.y + i * CONFIG.GRADUATION.CELSIUS.per);
                context.fillText(CELSIUS_MAX - (counts++) * CONFIG.GRADUATION.CELSIUS.per, CONFIG.CELSIUS.MERCURY.x, 
                    CONFIG.CELSIUS.MERCURY.y + i * CONFIG.GRADUATION.CELSIUS.per);
            }
            else
            {
                context.moveTo(CONFIG.GRADUATION.CELSIUS.SUB_SCALE_START.x, 
                    CONFIG.GRADUATION.CELSIUS.SUB_SCALE_START.y + i * CONFIG.GRADUATION.CELSIUS.per);  
            }
            context.lineTo(CONFIG.GRADUATION.CELSIUS.END.x, CONFIG.GRADUATION.CELSIUS.END.y + i * CONFIG.GRADUATION.CELSIUS.per);  
        }

        // 华氏
        counts = 0;
        this._setFont(CONFIG.FAH.UNIT);
        context.fillText("°F", CONFIG.FAH.UNIT.x, CONFIG.FAH.UNIT.y);
        // 刻度
        this._setFont(CONFIG.FAH.MERCURY);
        for (let i = 0, count = 0; i < CONFIG.GRADUATION.FAH.TOTAL+1; ++i, ++count)
        {
            if ((count-1) % 5 == 0)
            {
                context.moveTo(CONFIG.GRADUATION.FAH.SCALE_START.x, CONFIG.GRADUATION.FAH.SCALE_START.y + i * CONFIG.GRADUATION.FAH.per);
                context.fillText(FAH_MAX - counts++ * 10, CONFIG.FAH.MERCURY.x, CONFIG.FAH.MERCURY.y + i * CONFIG.GRADUATION.FAH.per);
            }
            else
            {
                context.moveTo(CONFIG.GRADUATION.FAH.SUB_SCALE_START.x, CONFIG.GRADUATION.FAH.SUB_SCALE_START.y + i * CONFIG.GRADUATION.FAH.per);
            }
            context.lineTo(CONFIG.GRADUATION.FAH.END.x, CONFIG.GRADUATION.FAH.END.y + i * CONFIG.GRADUATION.FAH.per);
        }
        context.stroke();
        context.fillStyle = "red";
        context.fill();
    }
    drawMercury(yOffset)
    {
        let context = this.context,
            CONFIG = this.CONFIG,
            data = 5 * yOffset + 130,
            moveable = this.canvas.width - 85,
            perScale = moveable / 2 / 50;
        node.style.top = moveable / 2 - yOffset * perScale;
        if (this.cur != data)
        {
            context.clearRect(CONFIG.LIQUID_COLUMN.LEFT.START.x, CONFIG.LIQUID_COLUMN.LEFT.START.Y, CONFIG.MERCURY_WIDTH, CONFIG.MERCURY_LENGTH);
            context.fillRect(CONFIG.LIQUID_COLUMN.LEFT.END.x, CONFIG.LIQUID_COLUMN.LEFT.END.y - this.cur, CONFIG.MERCURY_WIDTH, this.cur);
            this.cur += (data - this.cur) / Math.abs((data - this.cur));
        }
    }
    setUI()
    {
        const canvas = document.querySelector('#temperature-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.width;
        let temperatureList = this.data.temperature,
            fahList = this.data.fah,
            dateList = this.date;
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dateList,
                datasets: [{
                    label: '摄氏度',
                    borderColor: 'red',
                    backgroundColor: 'red',
                    data: temperatureList,
                    fill: false,
                    yAxisID: "temperature-axis",
                }, {
                    label: '华氏度',
                    borderColor: 'blue',
                    backgroundColor: 'blue',
                    data: fahList,
                    fill: false,
                    yAxisID: "fahrenheit-axis"
                }],
            },
            options: {
                scales: {
                    yAxes: [{
                        id: "temperature-axis",
                        type: "linear",
                        position: "left",
                        ticks: {
                            suggestedMin: -20,
                            suggestedMax: 50,
                            callback: function(value, index, values)
                            {
                                return value + '°C';
                            }
                        },
                    }, {
                        id: "fahrenheit-axis",
                        type: "linear",
                        position: "right",
                        ticks: {
                            suggestedMin: -10,
                            suggestedMax: 120,
                            callback: function(value, index, values)
                            {
                                return value + '°F'
                            }
                        }
                    }]
                },
                title:{
                    display: true,
                    text: "温度实时变化曲线",
                },
                legend: {
                    display: true,
                    position: 'left',
                    onClick: (e, legendItem) => {
                        const chart = this.chart;
                        let index = legendItem.datasetIndex,
                            meta = chart.getDatasetMeta(index),
                            fahAxes = chart.options.scales.yAxes[1],
                            tempAxes = chart.options.scales.yAxes[0];
                        
                        meta.hidden = meta.hidden == null ? !chart.data.datasets[index].hidden : null;
                        meta.yAxisID === 'temperature-axis' ? tempAxes.display = !tempAxes.display : fahAxes.display = !fahAxes.display;
                        chart.update();
                    }
                }
            }
        })
        
    }
    display()
    {
        let node = document.querySelector('#temperature-canvas');
        closeCanvas();
        node.style.display = 'block';
    }
    _addTemperature(data)
    {
        const chart = this.chart;
        this.data.temperature.push(temperatureData);
    }
    _addFah(data)
    {
        const chart = this.chart;
        this.data.fah.push(data);
    }
    _addDate(date)
    {
        const chart = this.chart;
        this.date.push(date);
    }
    _clearData()
    {
        this.date.shift();
        this.data.temperature.shift();
        this.data.fah.shift();
        this.setUI();
    }
    updateChart(temp, fah, date)
    {
        const len = this.date.length;
        len === 10 && this._clearData();
        this._addTemperature(temp);
        this._addFah(fah);
        this._addDate(date);
    }
}

class Humidity extends Window
{
    constructor(canvasWidth, canvasHeight, canvasID)
    {
        super(canvasWidth, canvasHeight);
        this.canvas = document.querySelector(canvasID);
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext('2d');
        this.speed = 0.04;
        this.xOffset = 0;
        this.cur = 0;
        this.chart = null;
        this.data = ['56', '57', '58', '59', '60', '61'];
        this.date = ['3.22', '3.23', '3.24', '3.25', '3.26', '3.27'];
        this.CONFIG = this._setUIConfig();
    }

    setUI()
    {   
        const canvas = document.querySelector('#humidity-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.width;
        let humidityList = this.data,
            dateList = this.date;
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dateList,
                datasets: [{
                    label: '湿度',
                    borderColor: 'blue',
                    backgroundColor: 'blue',
                    data: humidityList,
                    fill: false,
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 100,
                            callback: function(value, index, values)
                            {
                                return value + '%';
                            }
                        },
                    }]
                },
                title: {
                    display: true,
                    text: '湿度实时变化曲线',
                },
                legend: {
                    display: true,
                    position: 'left',
                }
            }
        })
    }

    display()
    {
        let node = document.querySelector('#humidity-canvas');
        closeCanvas();
        node.style.display = 'block';
    }

    _setUIConfig()
    {
        let CANVAS_WIDTH = this.width,
            MARGIN_TOP = 80,
            CUT_OFF_POINT = { 
                DX: 86.6, // 50√3
                DY: 150,
            },
            TOP_TO_CENTER = 200,
            RADIUS = 100,
            PI = Math.PI
        return {
            MARGIN_TOP: MARGIN_TOP,
            START: {
                X: CANVAS_WIDTH / 2,
                Y: MARGIN_TOP,
            },
            LINE_END: {
                X: CANVAS_WIDTH / 2 + CUT_OFF_POINT.DX,
                Y: MARGIN_TOP + CUT_OFF_POINT.DY,
            },
            CIRCLE: {
                CENTER: {
                    X: CANVAS_WIDTH / 2,
                    Y: MARGIN_TOP + TOP_TO_CENTER,
                },
                RADIUS: RADIUS,
                STARTING_ANGLE: 11/6 * PI,
                END_ANGLE: 7/6 * PI,
            },
            WAVE: {
                WIDTH_COEFFICIENT: 0.015,
                HEIGHT_COEFFICIENT: 6,
            }
        }
    }
    
    _drawDrop()
    {
        let context =  this.context,
            CONFIG = this.CONFIG,
            BORDER_WIDTH = 20;
        // 内边框
        context.beginPath();
        context.moveTo(CONFIG.START.X, CONFIG.START.Y);
        context.lineTo(CONFIG.LINE_END.X, CONFIG.LINE_END.Y);
        context.arc(CONFIG.CIRCLE.CENTER.X, CONFIG.CIRCLE.CENTER.Y, CONFIG.CIRCLE.RADIUS, CONFIG.CIRCLE.STARTING_ANGLE, CONFIG.CIRCLE.END_ANGLE);
        context.closePath();
        context.stroke();
        context.fillStyle = 'white';
        context.fill();
        context.globalCompositeOperation = "source-atop" 
    }
    
    _drawSin(xOffset, yOffset)
    {
        let context = this.context,
            MARGIN_TOP = this.CONFIG.marginTop,
            CONFIG = this.CONFIG,
            y = 0;
        context.beginPath();
        context.moveTo(0, CONFIG.CIRCLE.CENTER.Y + CONFIG.CIRCLE.RADIUS - yOffset);
        for (let x = 0; x < this.width; x += 20 / this.width)
        {
            y = Math.sin(x * CONFIG.WAVE.WIDTH_COEFFICIENT + xOffset);
            context.lineTo(x, CONFIG.WAVE.HEIGHT_COEFFICIENT * y + CONFIG.CIRCLE.CENTER.Y + CONFIG.CIRCLE.RADIUS - yOffset);
        }
        context.lineTo(this.width, this.height);
        context.lineTo(0, this.height);
        context.closePath();
        context.stroke();
        context.fillStyle = "#1c86d1";
        context.fill();
        context.globalCompositeOperation = "destination-over";
    }

    _drawOuter()
    {
        let context =  this.context,
            CONFIG = this.CONFIG,
            BORDER_WIDTH = 30;
        // 外边框
        context.beginPath();
        context.moveTo(CONFIG.START.X, CONFIG.START.Y - BORDER_WIDTH);
        context.lineTo(CONFIG.LINE_END.X, CONFIG.LINE_END.Y-40);
        context.arc(CONFIG.CIRCLE.CENTER.X, CONFIG.CIRCLE.CENTER.Y, CONFIG.CIRCLE.RADIUS+20, CONFIG.CIRCLE.STARTING_ANGLE, 
            CONFIG.CIRCLE.END_ANGLE);
        context.closePath();
        context.fillStyle="black";
        context.stroke();
        context.fill();
        context.globalCompositeOperation = "source-over";
    }

    _drawText(percentage)
    {
        let context = this.context;

        context.font = 40 + 'px Microsoft Yahei';
        context.textAlign = 'center';
        context.fillStyle = "rgba(06, 85, 128, 0.8)";
        context.fillText(percentage + '%', this.width / 2, 270);
    }

    render(percentage)
    {
        let context = this.context,
            CONFIG = this.CONFIG,
            yOffset = 0,
            cur = this.cur;

        this.canvas.height = this.height;
        this._drawDrop();
        if( cur !== percentage )
        {
            this.cur += (percentage - cur) / Math.abs(percentage - cur);
        }
        yOffset = (CONFIG.CIRCLE.CENTER.Y + CONFIG.CIRCLE.RADIUS - CONFIG.MARGIN_TOP) * (cur / 100);
        this._drawSin(this.xOffset, yOffset);
        this._drawOuter();
        this._drawText(cur);
        this.xOffset += this.speed;
    }
    _addData(hum)
    {
        this.data.push(hum);
    }
    _addDate(date)
    {
        this.date.push(date);
    }
    _clearData()
    {
        //this.date = [];
        //this.data = [];
        this.setUI();
    }
    updateChart(hum, date)
    {
        const len = this.date.length;
        len === 10 && this._clearData();
        this._addData(hum);
        this._addDate(date);
    }
}

class Lux extends Window
{
    constructor(canvasWidth, canvasHeight, canvasID)
    {
        super(canvasWidth, canvasHeight);
        this.canvas = document.querySelector(canvasID);
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.cur = 0;
        this.context = this.canvas.getContext('2d');
        this.CONFIG = this._setUIConfig();
        this.chart = null;
        this.data = ['100', '93', '100', '98', '101', '104'];
        this.date = ['3.22', '3.23', '3.24', '3.25', '3.26', '3.27'];
        //this._drawBulb();
    }

    setUI()
    {
        const canvas = document.querySelector('#lux-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.width;
        let luxList = this.data,
            dateList = this.date;
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dateList,
                datasets: [{
                    label: '光照度',
                    borderColor: 'orange',
                    backgroundColor: 'orange',
                    data: luxList,
                    fill: false,
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 100,
                        }
                    }]
                },
                title: {
                    display: true,
                    text: '光照度实时变化曲线',
                },
                legend: {
                    display: true,
                    position: 'left',
                }
            }
        })
    }

    display()
    {
        let node = document.querySelector('#lux-canvas');
        closeCanvas();
        node.style.display = 'block';
    }

    _setUIConfig()
    {
        let CANVAS_WIDTH = this.width,
            CANVAS_HEIGHT = this.height,
            BUBBLE_CENTER = {
                x: CANVAS_WIDTH / 2,
                Y: 190,
            },
            BUBBLE_OFFSET = {
                X: 50,
                Y: 86.6,
            },
            PI = Math.PI,
            BUBBLE_BOTTOM = {
                HEIGHT: 30,
                WIDTH: 100,
            },
            BUBBLE_BOTTOM_RADIUS = 10,
            FILAMENT_OFFSET = {
                X1: 30,
                Y1: 60,
                X2: 50,
                Y2: 10,
            },
            BUBBLE_BASE_OFFSET = {
                X1: 40,
                Y1: 34,
                X2: 38, 
                Y2: 54,
                X3: 36,
                Y3: 74,
            },
            BUBBLE_BASE_SIZE = {
                WIDTH1: 90,
                HEIGHT1: 20,
                WIDTH2: 86,
                HEIGHT2: 20,
            },
            BUBBLE_BASE_BOTTOM_OFFSET = 11.6
        return {
            BUBBLE: {
                START: {
                    x: BUBBLE_CENTER.x + BUBBLE_OFFSET.X,
                    y: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y,
                },
                CENTER: {
                    x: BUBBLE_CENTER.x,
                    Y: BUBBLE_CENTER.Y,
                },
                RADIUS: 100,
                STARTING_ANGLE: 1/3 * PI,
                END_ANGLE: 2/3 * PI,
                BOTTOM: {
                    VERTICAL: {
                        x: BUBBLE_CENTER.x - BUBBLE_OFFSET.X,
                        y: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y + BUBBLE_BOTTOM.HEIGHT - BUBBLE_BOTTOM_RADIUS,
                        ARC: {
                            x1: BUBBLE_CENTER.x - BUBBLE_OFFSET.X,
                            y1: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y + BUBBLE_BOTTOM.HEIGHT,
                            x2: BUBBLE_CENTER.x - BUBBLE_OFFSET.X + BUBBLE_BOTTOM_RADIUS,
                            y2: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y + BUBBLE_BOTTOM.HEIGHT,
                        },
                    },
                    HORIZONTAL: {
                        x: BUBBLE_CENTER.x + BUBBLE_OFFSET.X - BUBBLE_BOTTOM_RADIUS,
                        y: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y + BUBBLE_BOTTOM.HEIGHT,
                        ARC: {
                            x1: BUBBLE_CENTER.x + BUBBLE_OFFSET.X,
                            y1: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y + BUBBLE_BOTTOM.HEIGHT,
                            x2: BUBBLE_CENTER.x + BUBBLE_OFFSET.X,
                            y2: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y + BUBBLE_BOTTOM.HEIGHT - BUBBLE_BOTTOM_RADIUS,
                        },
                    },
                    BOTTOM_RADIUS: BUBBLE_BOTTOM_RADIUS,
                },
                BASE: {
                    FIRST: {
                        x: BUBBLE_CENTER.x - BUBBLE_BASE_OFFSET.X1,
                        y: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y + BUBBLE_BASE_OFFSET.Y1,
                        WIDTH: BUBBLE_BASE_SIZE.WIDTH1,
                        HEIGHT: BUBBLE_BASE_SIZE.HEIGHT1,
                        BORDER_RADIUS: 5,
                    },
                    SECOND: {
                        x: BUBBLE_CENTER.x - BUBBLE_BASE_OFFSET.X2,
                        y: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y + BUBBLE_BASE_OFFSET.Y2,
                        WIDTH: BUBBLE_BASE_SIZE.WIDTH2,
                        HEIGHT: BUBBLE_BASE_SIZE.HEIGHT2,
                        BORDER_RADIUS: 5,
                    },
                    THIRD: {
                        x: BUBBLE_CENTER.x - BUBBLE_BASE_OFFSET.X3,
                        y: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y + BUBBLE_BASE_OFFSET.Y3,
                        CENTER: {
                            x: BUBBLE_CENTER.x,
                            y: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y + BUBBLE_BASE_BOTTOM_OFFSET,
                        },
                        RADIUS: 72,
                        START_ANGLE: 2/3 * PI,
                        END_ANGLE: 1/3 * PI,
                    }
                },
                FILAMENT: {
                    x1: BUBBLE_CENTER.x - FILAMENT_OFFSET.X2,
                    x2: BUBBLE_CENTER.x + FILAMENT_OFFSET.X2,
                    width: 2 * FILAMENT_OFFSET.X2,
                    WAVE_WIDTH_COEFFICIENT: 0.5,
                    WAVE_HEIGHT_COEFFICIENT: 10,
                    waveOffset: BUBBLE_CENTER.Y + 10,
                    LEFT: {
                        START: {
                            x: BUBBLE_CENTER.x - FILAMENT_OFFSET.X1,
                            y: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y + BUBBLE_BOTTOM.HEIGHT,
                        },
                        TARGET1: {
                            x: BUBBLE_CENTER.x - FILAMENT_OFFSET.X1,
                            y: BUBBLE_CENTER.Y + FILAMENT_OFFSET.Y1,
                        },
                        TARGET2: {
                            x: BUBBLE_CENTER.x - FILAMENT_OFFSET.X2,
                            y: BUBBLE_CENTER.y + FILAMENT_OFFSET.Y2,
                        }
                    },
                    RIGHT: {
                        TARGET1: {
                            x: BUBBLE_CENTER.x + FILAMENT_OFFSET.X1,
                            y: BUBBLE_CENTER.Y + FILAMENT_OFFSET.Y1,
                        },
                        TARGET2: {
                            x: BUBBLE_CENTER.x + FILAMENT_OFFSET.X1,
                            y: BUBBLE_CENTER.Y + BUBBLE_OFFSET.Y + BUBBLE_BOTTOM.HEIGHT,
                        }
                    }
                }
            }
        }
    }

    _drawRoundRect(x, y, width, height, radius)
    {
        let context = this.context;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + width - 2 * radius, y);
        context.arcTo(x + width - radius, y, x + width - radius, y + radius, radius);
        context.lineTo(x + width - radius, y + height - 2 * radius);
        context.arcTo(x + width - radius, y + height- radius, x + width - 2 * radius, y + height - radius, radius);
        context.lineTo(x, y + height - radius);
        context.arcTo(x - radius, y + height - radius, x - radius, y + height - 2 * radius, radius);
        context.lineTo(x - radius, y + radius);
        context.arcTo(x - radius, y, x, y, radius);
        context.closePath();
        context.stroke();
    }

    _drawBulb(lux)
    {
        let context = this.context,
            CONFIG = this.CONFIG,
            LINEAR_END = CONFIG.BUBBLE.CENTER.x+10,
            length = CONFIG.BUBBLE.FILAMENT.width + CONFIG.BUBBLE.FILAMENT.x1;

        //context.fillStyle = "white";
        context.beginPath();
        context.moveTo(CONFIG.BUBBLE.START.x, CONFIG.BUBBLE.START.y);
        context.arc(CONFIG.BUBBLE.CENTER.x, CONFIG.BUBBLE.CENTER.Y, CONFIG.BUBBLE.RADIUS, CONFIG.BUBBLE.STARTING_ANGLE, CONFIG.BUBBLE.END_ANGLE, true);
        context.lineTo(CONFIG.BUBBLE.BOTTOM.VERTICAL.X, CONFIG.BUBBLE.BOTTOM.VERTICAL.y);
        context.arcTo(CONFIG.BUBBLE.BOTTOM.VERTICAL.ARC.x1, CONFIG.BUBBLE.BOTTOM.VERTICAL.ARC.y1,
            CONFIG.BUBBLE.BOTTOM.VERTICAL.ARC.x2, CONFIG.BUBBLE.BOTTOM.VERTICAL.ARC.y2, CONFIG.BUBBLE.BOTTOM.BOTTOM_RADIUS);
        context.lineTo(CONFIG.BUBBLE.BOTTOM.HORIZONTAL.x, CONFIG.BUBBLE.BOTTOM.HORIZONTAL.y);
        context.arcTo(CONFIG.BUBBLE.BOTTOM.HORIZONTAL.ARC.x1, CONFIG.BUBBLE.BOTTOM.HORIZONTAL.ARC.y1,
            CONFIG.BUBBLE.BOTTOM.HORIZONTAL.ARC.x2, CONFIG.BUBBLE.BOTTOM.HORIZONTAL.ARC.y2, CONFIG.BUBBLE.BOTTOM.BOTTOM_RADIUS);
        context.closePath();
        context.stroke();

        this._drawLight(lux);

        context.beginPath();
        context.moveTo(CONFIG.BUBBLE.FILAMENT.LEFT.START.x, CONFIG.BUBBLE.FILAMENT.LEFT.START.y);
        context.lineTo(CONFIG.BUBBLE.FILAMENT.LEFT.TARGET1.x, CONFIG.BUBBLE.FILAMENT.LEFT.TARGET1.y);
        context.lineTo(CONFIG.BUBBLE.FILAMENT.LEFT.TARGET2.x, CONFIG.BUBBLE.FILAMENT.LEFT.TARGET2.y); 
        for( let x= CONFIG.BUBBLE.FILAMENT.x1; x < length; x += 20/100 )
        {
            let y = Math.sin(CONFIG.BUBBLE.FILAMENT.WAVE_WIDTH_COEFFICIENT * x);
            context.lineTo(x, CONFIG.BUBBLE.FILAMENT.WAVE_HEIGHT_COEFFICIENT * y + CONFIG.BUBBLE.FILAMENT.waveOffset);
        }
        context.lineTo(CONFIG.BUBBLE.FILAMENT.RIGHT.TARGET1.x, CONFIG.BUBBLE.FILAMENT.RIGHT.TARGET1.y);
        context.lineTo(CONFIG.BUBBLE.FILAMENT.RIGHT.TARGET2.x, CONFIG.BUBBLE.FILAMENT.RIGHT.TARGET2.y);
        context.stroke();
        let grd = context.createLinearGradient(0, 0, LINEAR_END, 0);
        grd.addColorStop(0, "white");
        grd.addColorStop(1, "black");
        context.fillStyle = grd;
        this._drawRoundRect(CONFIG.BUBBLE.BASE.FIRST.x, CONFIG.BUBBLE.BASE.FIRST.y, CONFIG.BUBBLE.BASE.FIRST.WIDTH,
            CONFIG.BUBBLE.BASE.FIRST.HEIGHT, CONFIG.BUBBLE.BASE.FIRST.BORDER_RADIUS);
        context.fill();
        context.fillStyle = grd;
        this._drawRoundRect(CONFIG.BUBBLE.BASE.SECOND.x, CONFIG.BUBBLE.BASE.SECOND.y, CONFIG.BUBBLE.BASE.SECOND.WIDTH,
            CONFIG.BUBBLE.BASE.SECOND.HEIGHT, CONFIG.BUBBLE.BASE.SECOND.BORDER_RADIUS);
        context.fill();
        context.beginPath();
        context.moveTo(CONFIG.BUBBLE.BASE.THIRD.x, CONFIG.BUBBLE.BASE.THIRD.y);
        context.arc(CONFIG.BUBBLE.BASE.THIRD.CENTER.x, CONFIG.BUBBLE.BASE.THIRD.CENTER.y, CONFIG.BUBBLE.BASE.THIRD.RADIUS,
            CONFIG.BUBBLE.BASE.THIRD.START_ANGLE, CONFIG.BUBBLE.BASE.THIRD.END_ANGLE, true);
        context.closePath();
        context.fill();
        context.stroke();
    }

    _drawLight(lux)
    {
        let context = this.context,
            CONFIG = this.CONFIG,
            grd = context.createRadialGradient(CONFIG.BUBBLE.CENTER.x, CONFIG.BUBBLE.CENTER.Y + 10,  lux + 40, 
                CONFIG.BUBBLE.CENTER.x, CONFIG.BUBBLE.CENTER.Y + 10, lux);
        grd.addColorStop(0, "white");
        grd.addColorStop(1, "yellow");

        context.fillStyle = grd;
        context.fill()
    }

    render(lux)
    {
        let context = this.context,
            cur = this.cur;
        if( cur != lux )
        {
            this.cur += (lux - cur) / Math.abs((lux - cur));
        }
        //context.clearRect(0, 0, this.width, this.height);
        this.canvas.height = this.height;
        this._drawBulb(cur);
    }
    _addData(lux)
    {
        this.data.push(lux);
    }
    _addDate(date)
    {
        this.date.push(date);
    }
    _clearData()
    {
        this.data.shift();
        this.date.shift();
        this.setUI();
    }
    updateChart(lux, date)
    {
        const len = this.date.length;
        len === 10 && this._clearData();
        this._addData(lux);
        this._addDate(date);
    }
}

/**
 * websock连接成功后，服务器从数据库中读取最新的一条数据 
 * 并把这条数据的值保存在全局变量中，同时服务器上的websocket
 * 每隔1s,读取全局变量里的值，并把它们发送到网页上
 * 三组数据分别为温度，湿度和光照度，时间也由服务器传递
 * 温度还包含华氏摄氏，同样在服务器上计算完成
 */

draw = true
temperatureData = 30;
humidityData = 80;
luxData = 50;
openWindow = '';
turn = 0;

/**
 * 满10组数据清空一次
 */

let height = document.body.offsetHeight- 60;
document.querySelector('#content').style.height = height + 'px';

//per = 70;
let node = document.querySelector('.content-window'),
    canvasWidth = node.offsetWidth,
    canvasHeight = height - 140;//node.offsetHeight;
let temperature = new Temperature(canvasWidth, canvasHeight, '#temperature-animate'),
    humidity = new Humidity(canvasWidth, canvasHeight, '#humidity-animate'),
    lux = new Lux(canvasWidth, canvasHeight, '#lux-animate');
    //humidityEx = new HumidityEx(canvasWidth, canvasHeight, '#humidity-data');

function render()
{
    temperature.drawMercury(temperatureData);
    humidity.render(humidityData);
    lux.render(luxData);
    requestAnimationFrame(render);
}
function initEvent()
{
    function createTime(element, times)
    {
        let e = element;
        setTimeout(() => {
            e.style.display = 'none';
        }, times);
    }
    let windowNode = document.getElementsByClassName('content-window'),
        close = document.querySelector('.close'),
        modal = document.querySelector('.modal'),
        modalMask = document.querySelector('.modal-mask'),
        modalContent = document.querySelector('.modal-content'),
        startX = 0,
        wrapNode = document.querySelector('.wrap');
    document.addEventListener('touchstart', (event) => {
        startX = event.changedTouches[0].pageX; })
    document.addEventListener('touchend', (event) => {
        let distance = event.changedTouches[0].pageX - startX;
        if( distance > 100 )
        {
            wrapNode.style.transform = `rotateY(${(++turn) * 120}deg)`;
        }
        else if (distance < -100)
        {
            wrapNode.style.transform = `rotateY(${(--turn) * 120}deg)`;
        }
    })
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    closeCanvas();
                    
    for(let item of windowNode)
    {
        item.addEventListener('click', (e) => {
            openWindow = e.currentTarget.id;
            document.querySelector('#' + openWindow).style.display = "block";
            temperature.setUI();
            humidity.setUI();
            lux.setUI();
            switch(openWindow)
            {
                case "temperature-window":
                    temperature.display();
                    break;
                case "humidity-window":
                    humidity.display();
                    break;
                case "lux-window":
                    lux.display();
                    break;
                default: 
                    closeCanvas(); 
                    break;
            }
            modal.style.display = "block";
            modalMask.style.display = "block";
            //modalContent.style.display = "block"
            modalContent.classList.remove('fadeOutModal');
            modalContent.classList.add('fadeInModal');
            modalMask.classList.remove('fadeOutMask');
            modalMask.classList.add('fadeInMask');
        });
    }
   modal.addEventListener('click', (e) => {
        modalContent.classList.remove('fadeInModal');
        modalContent.classList.add('fadeOutModal');
        modalMask.classList.remove('fadeInMask');
        modalMask.classList.add('fadeOutMask');
        createTime(modal, 550);
        //createTime(modalContent, 600);
        createTime(modalMask, 600);
        e.stopPropagation();
    });
    close.addEventListener('click', (e) => {
        modalContent.classList.remove('fadeInModal');
        modalContent.classList.add('fadeOutModal');
        modalMask.classList.remove('fadeInMask');
        modalMask.classList.add('fadeOutMask');
        createTime(modal, 550);
        //createTime(modalContent, 600);
        createTime(modalMask, 600);
    });

}
function closeCanvas() {
    document.querySelector('#temperature-canvas').style.display = 'none';
    document.querySelector('#humidity-canvas').style.display = 'none';
    document.querySelector('#lux-canvas').style.display = 'none';
}

/**
 * data: {
 *     temp: 
 *     fah:
 *     humidity:
 *     lux: 
 *     date:
 *     time:
 * }
 */
function update({temp, fah, hum, luxs, date, time})
{
    temperatureData = Number(temp);
    humidityData = Number(hum);
    luxData = Number(luxs);
    temperature.updateChart(temp, fah, time);
    humidity.updateChart(hum, time);
    lux.updateChart(luxs, time);
    switch(openWindow)
    {
        case "temperature-window":
            temperature.chart.update();
            break;
        case "humidity-window":
            humidity.chart.update();
            break;
        case "lux-window":
            lux.chart.update();
            break;
    }
}

initEvent();
render();