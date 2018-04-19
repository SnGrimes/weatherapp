'use strict'

window.onload = function () {
        document.getElementById('zipSubmit').addEventListener('click', function() {
        const zip = Number(document.getElementById("ZipCode").value);
        const url = "test.php"; //change before reuploading to live site
        const btn = document.getElementById('unit_switch');
        api.connection('POST', url, zip, 1);
        api.connection('POST', url, zip, 2);
        btn.addEventListener('click', api.toggleUnit, true);  
    }, true); 
     
} /** End of Onload sequence **/



var api = {
    Data: {},
    Forecast: {},
    setButton: function(letter) {
        const button = document.getElementById('unit_switch');
        button.value = letter;
    },
    connection: function (type, url, zipCode, dataSet) {
            const request = new XMLHttpRequest();
            const params = "zip=" + zipCode +"&dataset=" + dataSet;
            request.open(type, url, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.onreadystatechange = function() {
                if(request.readyState == 4 && request.status == 200) {
                    //Success
                     var data = JSON.parse(request.responseText);
                     
                     if (dataSet == 1) {
                        api.displayData(data);
                     }
                     else {
                         api.display5Day(data);
                     }
                }
            };
            request.onerror = function() {
                console.log('There was a connection error.')
            }
            request.send(params);        
    },
    setData: function(data) {
        this.Data = Object.assign({}, data);
    },
    getData: function() {
        return this.Data;
    },
    setForecast: function(data) {
        this.Forecast = Object.assign({}, data);
    },
    getForecast: function() {
        return this.Forecast;
    },
    convertUnit: function (value) {
            const currentUnit = document.getElementById('unit_switch').value;
            let new_temp;
            if (currentUnit == "F") {
                new_temp = value - 273.15;
            }
            else {
                new_temp = (value * (9/5)) - 459.67;
            } 
            return new_temp;
    },
    initUnit: function(value) {
        return (value * (9/5)) - 459.67;
    },
    changeUnitValues: function (main, high, low) {
        let dataDay = 1;
        let dataDate = 1;
        const fiveDay = document.getElementsByClassName('day_fill');
        const fiveDate = document.getElementsByClassName('date_fill');
        
        document.getElementById('temp_display').innerHTML = "<p>" + main.toPrecision(2) + "<p>";
        document.getElementById('temphi_display').innerHTML= "<p>" + high.toPrecision(2) + "<p>";
        document.getElementById('templo_display').innerHTML= "<p>" + low.toPrecision(2) + "<p>";

        
        for (let j = 0; j < fiveDay.length; j++) {
            fiveDay[j].textContent = this.convertUnit(this.Forecast.list[dataDay].main.temp).toPrecision(2);
            dataDay += 8;
        }

        for (let i = 0; i < fiveDate.length; i++) {
            fiveDate[i].textContent = this.dateFormat(this.Forecast.list[dataDate].dt_txt);
            dataDate += 8;
        }
    },
    toggleUnit: function() {
        let data = api.getData();
        let temp = 0;
        let hi = 0;
        let lo = 0;
        let temperature = parseInt(data.main.temp);
        let high = parseInt(data.main.temp_max);
        let low = parseInt(data.main.temp_min);
        let currentUnit = document.getElementById('unit_switch').value;

        if (currentUnit == "C" ) {
            temp = api.convertUnit(temperature);
            hi = api.convertUnit(high);
            lo = api.convertUnit(low);

            api.changeUnitValues(temp, hi, lo);
            api.setButton('F');
        }
        else {
            temp = api.convertUnit(temperature);
            hi = api.convertUnit(high);
            lo = api.convertUnit(low);
            
            api.changeUnitValues(temp, hi, lo);
            api.setButton('C');
        }
    },
    displayData: function(data){
        const weatherCity = data.name;
        const weatherId = data.weather[0].id;
        const weatherDesc = data.weather[0].description;
        const weatherParams = data.weather[0].main;
        const weatherTemp = parseInt(data.main.temp);
        const weatherHumid = data.main.humidity;
        const tempHigh = data.main.temp_max;
        const tempLow = data.main.temp_min;
        const wndSpd = data.wind.speed;
        const wndDeg = data.wind.deg;
        const weatherPress = data.main.pressure;

        document.getElementById('temp_display').innerHTML = "<p>" + this.initUnit(weatherTemp).toPrecision(2) + "&deg;</p>";
        document.getElementById('humidity_display').innerHTML= "<p>" + weatherHumid + " %</p>";
        document.getElementById('temphi_display').textContent = this.initUnit(tempHigh).toPrecision(2);
        document.getElementById('templo_display').textContent = this.initUnit(tempLow).toPrecision(2);
        document.getElementById('city_display').innerHTML= "<p>" + weatherCity + "</p>";
        document.getElementById('weather_display').innerHTML = this.weatherCodes(weatherId);
        document.getElementById('wind_spd').textContent = wndSpd + " m/h";
        document.getElementById('wind_dir').textContent = wndDeg + " deg";
        document.getElementById('pressure_display').textContent = weatherPress + " hPA";
        document.getElementById('desc_display').textContent = weatherDesc;
        this.setData(data);
    },
    display5Day: function (data) {
        const fiveIcon = document.getElementsByClassName('day_icon');
        const fiveDay = document.getElementsByClassName('day_fill');
        const fiveDate = document.getElementsByClassName('date_fill');
        let list = [];
        
        let dataDay = 1;
        for (var j = 0; j < fiveDay.length; j++) {
            fiveDay[j].textContent = this.initUnit(data.list[dataDay].main.temp).toPrecision(2); 
            fiveIcon[j].innerHTML = this.weatherCodes(data.list[dataDay].weather[0].id);
            dataDay += 8;
        }
        let dataDate = 1;
        for (var i = 0; i < fiveDate.length; i++) {
            fiveDate[i].textContent = this.dateFormat(data.list[dataDate].dt_txt);
            dataDate += 8;
        }
        this.setForecast(data);
        this.drawGraph(list);      
    },
    drawGraph: function () {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            let temps = []; 
            let count;
            let gridCol = 0;
            const HEIGHT = 105;//105; 
            const WIDTH = 100; //100;
            let dataDay = 1;

            ctx.canvas.width = innerWidth;
            ctx.canvas.height = innerHeight;
            
            for (let i = 0; i < 5; i++) {
                temps[i] = this.initUnit(this.Forecast.list[dataDay].main.temp).toPrecision(2);
                dataDay +=8;
            }            
        
            ctx.moveTo(0, HEIGHT - temps[0]);
            ctx.beginPath();
            for (count = 0; count < temps.length; count++) {
                ctx.lineTo(gridCol += WIDTH, HEIGHT - temps[count]);
                ctx.arc(gridCol, HEIGHT - temps[count],3, 0, Math.PI*2, true);
                ctx.fillText(temps[count].toString() + " F", gridCol, HEIGHT - temps[count] +20);
            }
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.font = "1.5em serif"
            ctx.stroke();
            
            function createPoint(ctx,x, y) {
                ctx.arc(x,y,3,0, Math.PI*2,true);
            }
    },
    dateFormat: function (info) {
        let manip = info.toString();
        let month;
        let monthNum = manip.substring(5,7);

        switch (monthNum) {
            case '01': 
                month = 'January';
                break;
            case '02':
                month = 'February';
                break;
            case '03': 
                month = 'March';
                break;
            case '04': 
                month = 'April';
                break;
            case '05':
                month = 'May';
                break;
            case '06':
                month = 'June';
                break;
            case '07':
                month = 'July';
                break;
            case '08':
                month = 'August';
                break;
            case '09':
                month = 'September';
                break;
            case '10':
                month = 'October';
                break;
            case '11':
                month = 'November';
                break;
            case '12':
                month = 'December';
                break;
        }
        let day = manip.substring(8,10);
        return month + " " + day;
    },
    weatherCodes: function(code){
        let display;
        const weatherBckgrd = document.getElementById('weather_main');
        const weatherIcon = document.getElementById('weather_display');
        if (code >= 200 && code <= 232 ) {
            // Thunderstorm
            display = "<img src=\"img/Thunderstorm.svg\" alt=\" Thunderstorm Icon\" height=\"50\">";
            weatherIcon.innerHTML = "<img src=\"img/Thunderstorm.png\" alt=\" Thunderstorm Icon\" height=\"150\">";
            //weatherBckgrd.style.backgroundColor = '#51594f';
        }
        else if (code >= 300 && code <= 321) {
            // Drizzle
            display = "<img src=\"img/Drizzle.svg\" alt=\" Drizzle Icon\" height=\"50\">";
            weatherIcon.innerHTML = "<img src=\"img/Drizzle.svg\" alt=\" Drizzle Icon\" height=\"150\">";
            //weatherBckgrd.style.backgroundColor = '#7e848c';
        }
        else if (code >= 500 && code <= 531) {
            // Rain
            display = "<img src=\"img/Rain.svg\" alt=\" Rain Icon\" height=\"50\">";
            weatherIcon.innerHTML = "<img src=\"img/Rain.svg\" alt=\" Rain Icon\" height=\"150\">";
            //weatherBckgrd.style.backgroundColor = '#7e848c';
        }
        else if (code >= 600 && code <= 622) {
            // Snow
            display = "<img src=\"img/Snow.svg\" alt=\" Snow Icon\" height=\"50\">";
            weatherIcon.innerHTML = "<img src=\"img/Snow.svg\" alt=\" Snow Icon\" height=\"150\">";
            //weatherBckgrd.style.backgroundColor = '#b1b7bf';
        }
        else if (code == 800) {
            // Sunny and clear
            display = "<img src=\"img/Sunny.svg\" alt=\" Sunny Icon\" height=\"50\">"; 
            weatherIcon.innerHTML = "<img src=\"img/Sunny.svg\" alt=\" Sunny Icon\" height=\"150\">";
            //weatherBckgrd.style.backgroundColor = '#b4d8ed';
        }
        else if (code >= 801 && code <= 804) {
            // Cloudy
            display = "<img src=\"img/Cloudy.svg\" alt=\" Cloudy Icon\" height=\"50\">";
            weatherIcon.innerHTML = "<img src=\"img/Cloudy.svg\" alt=\" Cloudy Icon\" height=\"150\">";
            //weatherBckgrd.style.backgroundColor = '#94989e';
        }
        else if (code >= 900 && code <= 906) { 
            display = "Omg! Weather!"; 
            //weatherBckgrd.style.backgroundColor = '#51594f';
        }
        return display;
    }
};
