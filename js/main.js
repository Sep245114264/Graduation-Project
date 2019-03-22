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
            data = 5 * yOffset + 130;
        if (this.cur != data)
        {
            context.clearRect(CONFIG.LIQUID_COLUMN.LEFT.START.x, CONFIG.LIQUID_COLUMN.LEFT.START.Y, CONFIG.MERCURY_WIDTH, CONFIG.MERCURY_LENGTH);
            context.fillRect(CONFIG.LIQUID_COLUMN.LEFT.END.x, CONFIG.LIQUID_COLUMN.LEFT.END.y - this.cur, CONFIG.MERCURY_WIDTH, this.cur);
            this.cur += (data - this.cur) / Math.abs((data - this.cur));
        }
    }
    setUI(temperature, fah, date)
    {
        const ctx = document.querySelector('.canvas').getContext('2d');
        let temperatureList = temperature,
            fahList = fah,
            dateList = date;
        let chart = new Chart(ctx, {
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
                }
            }
        })
        
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
        this.CONFIG = this._setUIConfig();
        
    }

    setUI(humidity, date)
    {   
        const ctx = document.querySelector('.canvas').getContext('2d');
        let humidityList = humidity,
            dateList = date;
        let chart = new Chart(ctx, {
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
        //this._drawBulb();
    }

    setUI(lux, date)
    {
        const ctx = document.querySelector('.canvas').getContext('2d');
        let luxList = lux,
            dateList = date;
        let chart = new Chart(ctx, {
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
}

class HumidityEx extends Window
{
    constructor(canvasWidth, canvasHeight, canvasID)
    {
        super(canvasWidth, canvasHeight);
        this.canvas = document.querySelector(canvasID);
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext('2d');
        this.cur = 0;
    }
    
    _drawOuter()
    {
        let context = this.context,
            PI = Math.PI,
            MARGIN_TOP = 250,
            OUTER_OFFSET = 150,
            START_ANGLE = PI,
            END_ANGLE = 0 * PI,
            OUTER_RADIUS = OUTER_OFFSET,
            WIDTH = 70;
        context.beginPath();
        context.lineWidth = 60;
        let grd = context.createLinearGradient(this.width/2-OUTER_OFFSET+35, 0,this.width/2+OUTER_OFFSET-35, 0);
        grd.addColorStop("0", "rgb(243,153,0");
        grd.addColorStop("0.5", "rgb(87,250,255)");
        grd.addColorStop("1.0", "blue");
        context.strokeStyle = grd;
        context.moveTo(this.width / 2 - OUTER_OFFSET+35, MARGIN_TOP);
        context.arc(this.width / 2, MARGIN_TOP, OUTER_RADIUS-35, START_ANGLE, END_ANGLE);
        context.stroke();
    }

    _drawScale()
    {
        let context = this.context,
            MARGIN_TOP = 250,
            OUTER_OFFSET = 150 - 64;
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.font = "20px Arial";
        for (let i = 1; i < 10; ++i)
        {
            context.save();
            context.translate(this.width / 2, MARGIN_TOP);
            context.rotate(i / 10 * Math.PI);
            context.beginPath();
            context.moveTo(0 - OUTER_OFFSET, 0);
            context.lineTo(0 - OUTER_OFFSET - 10, 0);
            context.stroke();
            if (i % 2 == 0)
            {
                context.save();
                context.translate(0 - OUTER_OFFSET+20, 0);
                context.rotate(-i / 10 * Math.PI);
                context.fillText(i * 10, -12, 2);
                context.restore();
            }
            context.restore();
        }
    }

    _drawPointerBase()
    {
        let context = this.context,
            PI = Math.PI,
            MARGIN_TOP = 250,
            RADIUS = 10,
            START_ANGLE = 0,
            END_ANGLE = 2 * PI
        context.strokeStyle ="#594c3c";
        context.save();
        context.translate(this.width / 2, MARGIN_TOP);
        context.beginPath();
        context.moveTo(0 + RADIUS, 0);
        context.arc(0, 0, RADIUS, START_ANGLE, END_ANGLE);
        context.stroke();
        context.fillStyle = "#594c3c";
        context.fill();
        context.restore();
    }

    _drawPointer(per)
    {
        let context = this.context,
            PI = Math.PI,
            MARGIN_TOP = 250,
            RADIUS = 10,
            triangleHeight = 80
        context.fillStyle = "#594c3c";
        context.strokeStyle = "#594c3c";
        context.save();
        context.translate(this.width / 2, MARGIN_TOP);
        context.beginPath();
        context.rotate(per * PI/100);
        context.moveTo(0, 0 + RADIUS);
        context.lineTo(0, 0 - RADIUS);
        context.lineTo(0 - triangleHeight, 0);
        context.closePath();
        context.stroke();
        context.fill();
        context.restore();
    }

    _drawAreaText()
    {
        let context = this.context,
            MARGIN_TOP = 250
        context.save();
        context.translate(this.width / 2, MARGIN_TOP);
        context.fillText('干燥', 0 - 150 - 30, 0 - 60);
        context.fillText('舒适', 0 - 20, 0 - 160);
        context.fillText('潮湿', 0 + 150 - 10, 0 - 60);
        context.restore();
    }

    _drawDrop()
    {
        let context =  this.context,
            MARGIN_TOP = 250,
            PI = Math.PI
        context.save();
        context.translate(this.width / 2 - 80, MARGIN_TOP + 70);
        context.beginPath();
        context.rotate(-1/3*PI);
        context.moveTo(0, 0);
        context.lineTo(0 - 17.3, 0);
        context.rotate(1/3*PI);
        context.arc(0, 40, 20, 7/6*PI, 11/6*PI, true);
        context.closePath();
        context.stroke();
        context.fillStyle = "#4bbaef";
        context.fill();
        let grd = context.createRadialGradient(0, 40, 20, -10, 50, 10);
        grd.addColorStop("0.0", "#4bbaef");
        grd.addColorStop("1.0", "#86d0f1");
        context.fillStyle = grd;
        context.fill();
        context.restore();
    }

    _drawPercent(per)
    {
        let context = this.context,
            MARGIN_TOP = 250
        context.save();
        context.translate(this.width / 2 - 30, MARGIN_TOP + 120);
        context.font = "60px Arial";
        context.fillText(per + '%', 0, 0);
        context.restore();
    }

    render(per)
    {
        let context = this.context,
            canvas = this.canvas,
            cur = this.cur

        canvas.height = canvas.height;
        this._drawOuter();
        this._drawScale();
        this._drawPointerBase();
        this._drawAreaText();
        this._drawDrop();
        if (cur != per)
        {
            this.cur += (per - cur) / Math.abs(per - cur);
        }
        this._drawPercent(cur);
        this._drawPointer(cur);
    }
}

draw = true
data = 30;
dy = 80;
luxs = 50;
//per = 70;
let node = document.querySelector('.inner'),
    canvasWidth = node.offsetWidth,
    canvasHeight = node.offsetHeight;
let temperature = new Temperature(canvasWidth, canvasHeight, '#temperature-animate'),
    humidity = new Humidity(canvasWidth, canvasHeight, '#humidity-animate'),
    lux = new Lux(canvasWidth, canvasHeight, '#lux-animate');
    humidityEx = new HumidityEx(canvasWidth, canvasHeight, '#humidity-data');

function render()
{
    temperature.drawMercury(data);
    humidity.render(dy);
    lux.render(luxs);
    humidityEx.render(dy);
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
        modalContent = document.querySelector('.modal-content');
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    for(let item of windowNode)
    {
        item.addEventListener('click', (e) => {
            const id = e.currentTarget.id;
            document.querySelector('#' + id).style.display = "block";
            switch(id)
            {
                case "temperature-window":
                    temperature.setUI(
                        ['23', '21', '22', '25', '23', '24'], 
                        ['73.4', '69.8', '71.6', '77', '73.4', '75.2'],
                        ['3.22', '3.23', '3.24', '3.25', '3.26', '3.27']);
                    break;
                case "humidity-window":
                    humidity.setUI(
                        ['56', '57', '58', '59', '60', '61'],
                        ['3.22', '3.23', '3.24', '3.25', '3.26', '3.27']);
                    break;
                case "lux-window":
                    lux.setUI(
                        ['100', '100', '100', '100', '100', '100'],
                        ['3.22', '3.23', '3.24', '3.25', '3.26', '3.27']
                    );
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
initEvent();
render();