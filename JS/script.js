'use strict'

window.onload = function getLoc() {
    navigator.geolocation.getCurrentPosition(function(position){
        var userLat = position.coords.latitude;
        var userLong = position.coords.longitude;
        console.log('We got a location! Lat:' + userLat + ' Lon: ' + userLong);

        api.connection('GET', 'response.json', 1);
        api.connection('GET', '5day_response.json', 2);    
    }); 
} /** End of Onload sequence **/


var api = {
    FC: true,
    set setFC (value) {
        this.FC = value;
    },
    get getFC() {
        return this.FC;
    },
    setButton: function(letter) {
        var button = document.getElementById('unit_switch');
        button.value = letter;
    },
    connection: function (type, url, dataSet) {
            var request = new XMLHttpRequest();
            request.open(type, url, true);

            request.onload = function() {
                if(request.status >= 200 && request.status <400) {
                    //Success
                     var data = JSON.parse(request.responseText);
                     if (dataSet == 1) {
                        api.displayData(data);
                     }
                     else {
                         api.display5Day(data);
                     }
                } else {
                    console.log('There was an error when trying to request OpenWeather api data.')
                }
            };
            request.onerror = function() {
                console.log('There was a connection error.')
            }

            request.send();        
    },
    Data: {},
    Forecast: {},
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
            var new_temp;
            if (this.FC) {
                new_temp = (value * (9/5)) - 459.67;
            }
            else {
                new_temp = value - 273.15;
            } 
            return new_temp;
    },
    toggleUnit: function() {
        var temp = 0;
        var hi = 0;
        var lo = 0;
        var fiveDay = [];
        var temperature = parseInt(this.Data.main.temp);
        var high = parseInt(this.Data.main.temp_max);
        var low = parseInt(this.Data.main.temp_min);
        var button = document.getElementById('unit_switch');

        if (this.FC) {
            //temp = (temperature * (9/5)) - 459.67;
            //hi = (high * (9/5)) - 459.67;
            //lo = (low * (9/5)) - 459.67;
            temp = this.convertUnit(temperature);
            hi = this.convertUnit(high);
            lo = this.convertUnit(low);

            document.getElementById('temp_display').innerHTML = "<p>" + temp.toPrecision(4) + "<p>";
            document.getElementById('temphi_display').innerHTML= "<p>" + hi.toPrecision(4) + "<p>";
            document.getElementById('templo_display').innerHTML= "<p>" + lo.toPrecision(4) + "<p>";
            
            var fiveDay = document.getElementsByClassName('day_fill');
            var fiveDate = document.getElementsByClassName('date_fill');
            
            var dataDay = 1;
            for (var j = 0; j < fiveDay.length; j++) {
                fiveDay[j].textContent = this.convertUnit(this.Forecast.list[dataDay].main.temp).toPrecision(4) + " " +  this.weatherCodes(this.Forecast.list[dataDay].weather[0].id);
                dataDay += 8;
            }
            var dataDate = 1;
            for (var i = 0; i < fiveDate.length; i++) {
                fiveDate[i].textContent = this.dateFormat(this.Forecast.list[dataDate].dt_txt);
                dataDate += 8;
            }
            this.FC = false; 
            button.value = 'F';
        }
        else {
            //temp = temperature - 273.15;
            //hi = high - 273.15;
            //lo = low - 273.15;
            temp = this.convertUnit(temperature);
            hi = this.convertUnit(high);
            lo = this.convertUnit(low);
            console.log(temp);
            document.getElementById('temp_display').innerHTML = "<p>" + temp.toPrecision(4) + "<p>";
            document.getElementById('temphi_display').innerHTML= "<p>" + hi.toPrecision(4) + "<p>";
            document.getElementById('templo_display').innerHTML= "<p>" + lo.toPrecision(4) + "<p>";

            var fiveDay = document.getElementsByClassName('day_fill');
            var fiveDate = document.getElementsByClassName('date_fill');
            
            var dataDay = 1;
            for (var j = 0; j < fiveDay.length; j++) {
                fiveDay[j].textContent = this.convertUnit(this.Forecast.list[dataDay].main.temp).toPrecision(4) + " " +  this.weatherCodes(this.Forecast.list[dataDay].weather[0].id);
                dataDay += 8;
            }
            var dataDate = 1;
            for (var i = 0; i < fiveDate.length; i++) {
                fiveDate[i].textContent = this.dateFormat(this.Forecast.list[dataDate].dt_txt);
                dataDate += 8;
            }

            this.FC = true;
            button.value = 'C';
        }
    },
    displayData: function(data){
        var weatherCity = data.name;
        var weatherId = data.weather[0].id;
        var weatherDesc = data.weather[0].description;
        var weatherParams = data.weather[0].main;
        var weatherTemp = data.main.temp;
        var weatherHumid = data.main.humidity;
        var tempHigh = data.main.temp_max;
        var tempLow = data.main.temp_min;
        var wndSpd = data.wind.speed;
        var wndDeg = data.wind.deg;

        document.getElementById('temp_display').innerHTML = "<p>" + this.convertUnit(weatherTemp).toPrecision(4) + "</p>";
        document.getElementById('humidity_display').innerHTML= "<p>" + weatherHumid + "</p>";
        document.getElementById('temphi_display').innerHTML= "<p>" + this.convertUnit(tempHigh).toPrecision(4) + "</p>";
        document.getElementById('templo_display').innerHTML= "<p>" + this.convertUnit(tempLow).toPrecision(4) + "</p>";
        document.getElementById('city_display').innerHTML= "<p>" + weatherCity + "</p>";
        document.getElementById('weather_display').textContent = this.weatherCodes(weatherId);
        document.getElementById('wind_spd').textContent = wndSpd;
        document.getElementById('wind_dir').textContent = wndDeg;
        this.setData(data);
    },
    display5Day: function (data) {
        //console.log(data);
        var fiveDay = document.getElementsByClassName('day_fill');
        var fiveDate = document.getElementsByClassName('date_fill');
        var list = [];
        
        var dataDay = 1;
        for (var j = 0; j < fiveDay.length; j++) {
            fiveDay[j].textContent = this.convertUnit(data.list[dataDay].main.temp).toPrecision(4) + " " +  this.weatherCodes(data.list[dataDay].weather[0].id);
            dataDay += 8;
        }
        var dataDate = 1;
        for (var i = 0; i < fiveDate.length; i++) {
            fiveDate[i].textContent = this.dateFormat(data.list[dataDate].dt_txt);
            dataDate += 8;
        }
        this.setForecast(data);
        this.drawGraph(list);
    },
    drawGraph: function () {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');

            var temps = []; 
            var count;
            var gridCol = 0;
            var HEIGHT = 105; 
            var WIDTH = 100;
            var dataDay = 1;
            

            for (var i = 0; i < 5; i++) {
                temps[i] = this.convertUnit(this.Forecast.list[dataDay].main.temp).toPrecision(4);
                dataDay +=8;
            }
            console.log(temps);
            
            
            ctx.moveTo(0, HEIGHT - temps[0]);
            ctx.beginPath();
            for (count = 0; count < temps.length; count++) {
                ctx.lineTo(gridCol += WIDTH, HEIGHT - temps[count]);
                ctx.arc(gridCol, HEIGHT - temps[count],3, 0, Math.PI*2, true);
            }
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            ctx.fill(arc);
            
            function createPoint(ctx,x, y) {
                ctx.arc(x,y,3,0, Math.PI*2,true);
            }
    },
    dateFormat: function (info) {
        var manip = info.toString();
        var month;
        var monthNum = manip.substring(5,7);

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
        var day = manip.substring(8,10);
        return month + " " + day;
    },
    weatherCodes: function(code){
        var display;
        var weatherBckgrd = document.getElementsByClassName('weather_temp');
        if (code >= 200 && code <= 232 ) {
            display = "This is a thunderstorm";
        }
        else if (code >= 300 && code <= 321) {
            display = "This is drizzle";
        }
        else if (code >= 500 && code <= 531) {
            display = "This is rain";
        }
        else if (code >= 600 && code <= 622) {
            display = "This is Snow";
        }
        else if (code == 800) {
            display = "This is a clear sky"; 
            weatherBckgrd.style.backgroundColor = 'blue';
        }
        else if (code >= 801 && code <= 804) {
            display = "It is cloudy"; 
        }
        else if (code >= 900 && code <= 906) { 
            display = "Omg! Weather!"; 
        }
        return display;
    }
};
