'use strict'
var rawTemp;
var rawHigh;
var rawLow;

window.onload = function getLoc() {
    navigator.geolocation.getCurrentPosition(function(position){
        var userLat = position.coords.latitude;
        var userLong = position.coords.longitude;
        console.log('We got a location! Lat:' + userLat + ' Lon: ' + userLong);

        var request = new XMLHttpRequest();
        // Since open weather is an http you can use 'https://cors-anywhere.herokuapp.com/' right before url to get https for cross origin errors
request.open('GET', 'response.json', true);
//request.open('GET', 'http://api.openweathermap.org/data/2.5/weather?lat=' + userLat +'&lon=' + userLong +'&appid=549ea4e9fb7d89a512a515156a787ab8', true);
//City Dallas: 4684888
request.onload = function() {
    if(request.status >= 200 && request.status <400) {
        //Success
        var data = JSON.parse(request.responseText);
        displayData(data);
        rawTemp = data.main.temp;
        rawHigh = data.main.temp_max;
        rawLow = data.main.temp_min;
    } else {
        console.log('There was an error when returning the data.')
    }
};

request.onerror = function() {
    console.log('There was a connection error.')
}

request.send();

    });
}

function displayData (data) {
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
    weatherCodes(weatherId);
}

function weatherCodes (code) {
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

var FC = true;

function toggleUnit() {
    var temp = 0;
    var hi = 0;
    var lo = 0;
    var temperature = parseInt(rawTemp);
    var high = parseInt(rawHigh);
    var low = parseInt(rawLow);
    var button = document.getElementById('unit_switch');

    console.log(temperature);
    if (FC) {
        temp = (temperature * (9/5)) - 459.67;
        hi = (high * (9/5)) - 459.67;
        lo = (low * (9/5)) - 459.67;
        console.log(temp);
        document.getElementById('temp_display').innerHTML = "<p>" + temp.toPrecision(4) + "<p>";
        document.getElementById('temphi_display').innerHTML= "<p>" + hi.toPrecision(4) + "<p>";
        document.getElementById('templo_display').innerHTML= "<p>" + lo.toPrecision(4) + "<p>";
        FC = false; 
        button.value = 'F';
    }
    else {
        temp = temperature - 273.15;
        hi = high - 273.15;
        lo = low - 273.15;
        console.log(temp);
        document.getElementById('temp_display').innerHTML = "<p>" + temp.toPrecision(4) + "<p>";
        document.getElementById('temphi_display').innerHTML= "<p>" + hi.toPrecision(4) + "<p>";
        document.getElementById('templo_display').innerHTML= "<p>" + lo.toPrecision(4) + "<p>";
        FC = true;
        button.value = 'C';
    }
}