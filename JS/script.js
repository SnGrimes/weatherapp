'use strict'

window.onload = function getLoc() {
    navigator.geolocation.getCurrentPosition(function(position){
        var userLat = position.coords.latitude;
        var userLong = position.coords.longitude;
        console.log('We got a location! Lat:' + userLat + ' Lon: ' + userLong);

        api.connection('GET', 'response.json');
        api.displayData();
    
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
    connection: function (type, url) {
            var request = new XMLHttpRequest();
            request.open(type, url, true);

            request.onload = function() {
                if(request.status >= 200 && request.status <400) {
                    //Success
                     var data = JSON.parse(request.responseText);
                     api.displayData(data);
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
    setData: function(data) {
        this.Data = Object.assign({}, data);
    },
    getData: function() {
        return this.Data;
    },
    convertUnit: function () {
            var new_temp;
            if (FC) {
                new_temp = (temperature * (9/5)) - 459.67;
                api.setFC = false;
                api.setButton('F');
            }
            else {
                new_temp = temperature - 273.15;
                api.setFC = true;
                api.setButton('C');
            } 
            return new_temp;
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

        var initialTemp = (weatherTemp * (9/5)) - 459.67;
        var initialHigh = (tempHigh * (9/5)) - 459.67;
        var initialLow = (tempLow * (9/5)) - 459.67;

        document.getElementById('temp_display').innerHTML = "<p>" + initialTemp.toPrecision(4) + "<p>";
        document.getElementById('humidity_display').innerHTML= "<p>" + weatherHumid + "<p>";
        document.getElementById('temphi_display').innerHTML= "<p>" + initialHigh.toPrecision(4) + "<p>";
        document.getElementById('templo_display').innerHTML= "<p>" + initialLow.toPrecision(4) + "<p>";
        document.getElementById('city_display').innerHTML= "<p>" + weatherCity + "<p>";
        this.weatherCodes(weatherId);
    },
    weatherCodes: function(code){
        var display = document.getElementById('weather_display');
        if (code >= 200 && code <= 232 ) {
            display.innerHTML = "<p>This is a thunderstorm</p>";
        }
        else if (code >= 300 && code <= 321) {
            display.innerHTML = "<p>This is drizzle</p>";
        }
        else if (code >= 500 && code <= 531) {
            display.innerHTML = "<p>This is rain</p>";
        }
        else if (code >= 600 && code <= 622) {
            display.innerHTML = "<p>This is Snow</p>";
        }
        else if (code == 800) {
            display.innerHTML = "<p>This is clear sky</p>"; 
        }
        else if (code >= 801 && code <= 804) {
            display.innerHTML = "<p>It is cloudy</p>"; 
        }
        else if (code >= 900 && code <= 906) {
            display.innerHTML = "<p>Omg! Weather!</p>"; 
        }
    }
};
