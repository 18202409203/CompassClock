/*
 * @Author: https://github.com/18202409203 
 * @Date: 2019-05-23 21:21:49 
 * @Last Modified by: https://github.com/18202409203
 * @Last Modified time: 2019-05-23 22:28:20
 */

function Clock(option) {
    var canvas = document.getElementById(option.containerId);
    var compass;
    var layers = option.layers || ['Year', 'Month', 'Day', 'Week', 'Hour', 'Minute', 'Second'];
    var width = canvas.offsetWidth;
    var height = canvas.offsetHeight;
    var center = {
        x: width / 2,
        y: height / 2
    };

    this.update = () => {
        var date = new Date();
        var Y = date.getFullYear()
        var M = date.getMonth()
        var D = date.getDate()
        var W = date.getDay()
        var h = date.getHours()
        var m = date.getMinutes()
        var s = date.getSeconds()

        var Year = [Y];
        var Month = new MyArray().genArray(12, d => d + 1).sliceArray(M).formatter(option.formatterMonth || (d => d)).array();
        var Day = new MyArray().genArray(31, d => d + 1).sliceArray(D - 1).formatter(option.formatterDay || (d => d)).array();
        var Week = new MyArray().genArray(7).sliceArray(W).formatter(option.formatterWeek || (d => d === 0 ? 7 : d)).array();
        var Hour = new MyArray().genArray(24).sliceArray(h).formatter(option.formatterHour || (d => d)).array();
        var Minute = new MyArray().genArray(60).sliceArray(m).formatter(option.formatterMinute || (d => d)).array();
        var Second = new MyArray().genArray(60).sliceArray(s).formatter(option.formatterSecond || (d => d)).array();

        this.allLayers = {
            'Year': Year,
            'Month': Month,
            'Day': Day,
            'Week': Week,
            'Hour': Hour,
            'Minute': Minute,
            'Second': Second
        }

        return this;
    }

    this.paint = () => {
        compass && compass.remove();
        compass = document.createElement("div");
        canvas.appendChild(compass);
        for (let i = 0, len = layers.length; i < len; i++) {
            paintCircle(i * (option.gap || 50), this.allLayers[layers[i]]);
        }
    }

    this.run = () => {
        var run = () => {
            this.update().paint()
        }
        window.setInterval(run, option.freshTime || 500)
    }

    // 绘制圆
    function paintCircle(r, eles) {
        var circle = document.createElement("div");
        var total = eles.length;
        for (let i = 0; i < total; i++) {
            var element = document.createElement("div");
            var radian = (i / total) * Math.PI * 2;
            var angle = (i / total) * 360;
            element.innerHTML = eles[i];
            element.style.position = "absolute";
            element.style.transform = option.rotateText ? `translate(${center.x}px, ${center.y}px) rotate(${angle}deg)` :
                `translate(${center.x}px, ${center.y}px)`
            element.style.top = Math.sin(radian) * r + 'px';
            element.style.left = Math.cos(radian) * r + 'px';
            if (i === 0) {
                element.style.color = option.currentColor || 'red';
            } else {
                option.randomColor && (element.style.color = randomRGB());
            }
            circle.appendChild(element);
        }
        compass.appendChild(circle);
    }

    // 用于生成数组
    function MyArray() {
        var array = [];
        this.genArray = (length, f) => {
            array = [];
            for (let i = 0; i < length; i++) {
                array.push(f ? f(i) : i);
            }
            return this;
        }
        this.sliceArray = (index) => {
            array = array.slice(index).concat(array.slice(0, index));
            return this;
        }
        this.formatter = (f) => {
            array = array.map(f)
            return this;
        }
        this.array = () => array;
    }

    function randomRGB() {
        var r = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }
}