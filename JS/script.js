'use strict'

/**
 * Initializing function for the weather application. This function sets up the event listener
 * for the zip code field and will take the value that is entered. It is then sent to the api.php
 * file that will request the data from openweathermap and send it back to the application to be
 * displayed.
 */
window.onload = function () {
        document.getElementById('zipSubmit').addEventListener('click', function() {
        const zip = Number(document.getElementById("ZipCode").value);
        const url = "api.php";
        const btn = document.getElementById('unit_switch');
        api.connection('POST', url, zip, 1);
        api.connection('POST', url, zip, 2);
        btn.addEventListener('click', api.toggleUnit, true);  
    }, true); 
     
} /** End of Onload sequence **/

/**
 * The api object contains all the logic needed to display the weather data to the user.
 */

var api = {
    /**
     * The Data object holds the current weather data that is pulled from openweathermap.
     * @name Data
     */
    Data: {},
    /**
     * The Forecast object holds the weather data for the next 5 days.
     * @name Forecast
     */
    Forecast: {},
    /**
     * This function will change the value of the unit switch button.
     * @function
     * @name setButton
     * @param {string} letter - The letter to be displayed on the unit switch button: C or F.
     */
    setButton: function(letter) {
        const button = document.getElementById('unit_switch');
        button.value = letter;
    },
    /**
     * This function will call the api.php file which will request the weather data from openweathermap and then
     * return it to the api object.
     * @function
     * @name connection
     * @param {string} type - the type of request to be made. In this case it will be a POST request
     * @param {string} url - string version of the api.php to be called to make the data request
     * @param {string} zipCode - the zip code the user entered into the zip code text field
     * @param {number} dataSet - the number needed to let the function know which object to store the request 
     * data into
     * @throws Will throw an error message to the console if there is a connection error.
     */
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
    /**
     * This function will store the today's weather request data into the Data object.
     * @constructor
     * @name setData
     * @param {object} data - today's weather data that is returned from the api.php file.
     * @this api
     */
    setData: function(data) {
        this.Data = Object.assign({}, data);
    },
    /**
     * This function will return the Data object when it is called.
     * @function 
     * @name getData
     * @returns {object} Data object containing today's weather data.
     */
    getData: function() {
        return this.Data;
    },
    /**
     * This function will store the five day forecast data into the Forecast object.
     * @constructor
     * @name setForecast
     * @param {object} data - the five day forecast data that is returned from the api.php file.
     * @this api
     */
    setForecast: function(data) {
        this.Forecast = Object.assign({}, data);
    },
    /**
     * This function will return the Forecast object when it is called.
     * @function
     * @name getForecast
     * @returns {object} Data object containing five day forecast weather data.
     */
    getForecast: function() {
        return this.Forecast;
    },
    /**
     * This function will convert the give value to celcius or fahrenheit based on the value of the unit_switch button.
     * @function
     * @name convertUnit
     * @param {number} value - the temperature value to be converted to celcius or fahrenheit.
     * @returns {number} new_temp - the new converted value for the temperature.
     */
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
    /**
     * This function will set up the initial values for the temperature data in fahrenheit.
     * @function
     * @name initUnit
     * @param {number} value - the temperature value to be converted to fahrenheit.
     * @returns {number} - returns the temperature value in fahrenheit.
     */
    initUnit: function(value) {
        return (value * (9/5)) - 459.67;
    },
    /**
     * This function converts all of the given temperature values between fahrenheit and celcius when called.
     * @function
     * @name changeUnitValues 
     * @param {number} main - the main temperature for the day.
     * @param {number} high - the day's high temperature for the day.
     * @param {number} low - the day's low temperature for the day.
     */
    changeUnitValues: function (main, high, low) {
        let dataDay = 1;
        let dataDate = 1;
        const fiveDay = document.getElementsByClassName('day_fill');
        const fiveDate = document.getElementsByClassName('date_fill');
        
        document.getElementById('temp_display').innerHTML = "<p>" + main.toPrecision(2) + "<p>";
        document.getElementById('temphi_display').innerHTML= "<p>" + high.toPrecision(2) + "<p>";
        document.getElementById('templo_display').innerHTML= "<p>" + low.toPrecision(2) + "<p>";

        /**
         * These loops will set up the weather data to be displayed in the app. They will call the convertUnit 
         * function to convert the weather data and teh dateFormat function to convert the data info to the Month/Day
         * format. 
         */
        for (let j = 0; j < fiveDay.length; j++) {
            fiveDay[j].textContent = this.convertUnit(this.Forecast.list[dataDay].main.temp).toPrecision(2);
            dataDay += 8;
        }

        for (let i = 0; i < fiveDate.length; i++) {
            fiveDate[i].textContent = this.dateFormat(this.Forecast.list[dataDate].dt_txt);
            dataDate += 8;
        }
    },
    /**
     * This function will convert the temperature data between celcius and fahrenheit.
     * @function
     * @name toggleUnit
     */
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
    /**
     * This function will display all the data pull from the today's weather forecast data. It will also 
     * call the setData function to store the weather data into the Data object for later use.
     * @function
     * @name displayData
     * @param {object} data - the reponse data that contains today's weather forecast.
     * @this api
     */
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
    /**
     * This function will display all the 5 day forecast data. It will also call the setForecast function to store the 
     * forecast data into the Forecast object for later use. It will also call the drawGraph function to draw the 
     * weather line graph.
     * @function
     * @name display5Day
     * @param {object} data - the response data that contains the five day forecast data.
     * @this api
     */
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
    /**
     * This function will draw the line graph from the data contained in the Forecast data object.
     * @function 
     * @name drawGraph
     */
    drawGraph: function () {
            const canvas = document.getElementById('canvas');
            const container = document.querySelector('.graph');
            const ctx = canvas.getContext('2d');

            let temps = []; 
            let count;
            let gridCol = 0;
            const HEIGHT = container.offsetHeight;
            const WIDTH = container.offsetWidth;
            let dataDay = 1;
            let point = {x:0,y:0};
            const padding = 20;

            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            /**
             *  This loop will pull the 5 day weather data stored in the Forecast object and send it to the 
             *  initUnit function to be converted to fahrenheit for the initial information display
             */
            for (let i = 0; i < 5; i++) {
                temps[i] = this.initUnit(this.Forecast.list[dataDay].main.temp).toPrecision(2);
                dataDay +=8;
            }            
            /**
             * Sets the canvas context object at the correct position to start the path for the line graph
             */
            ctx.moveTo(0, HEIGHT - temps[0]);
            ctx.beginPath();
            /**
             *  This loop will draw the line for the graph
             */
            for (count = 0; count < temps.length; count++) {
                gridCol = padding + ((WIDTH - (padding * 2)) / (temps.length - 1)) * count;
                ctx.lineTo(gridCol, HEIGHT - temps[count]);
            }
            /** 
             * Styling for the path line
             */
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            /**
             * Reset the canvas context object in preparation to draw all of the points
             */
            ctx.beginPath();
            ctx.moveTo(0, HEIGHT - temps[0]);
            /**
             * This loop will draw the points for the graph along with the text for each temperature
             */
            for (count = 0; count < temps.length; count++) {
                gridCol = padding + ((WIDTH - (padding * 2)) / (temps.length - 1)) * count;
                ctx.lineTo(gridCol, HEIGHT - temps[count]);
                point.x = gridCol;
                point.y = HEIGHT - temps[count];
                draw(point);
                ctx.fillText(temps[count].toString() + " F", gridCol, HEIGHT - temps[count] +20);
            }
            ctx.font = "1.5em serif"
            /**
             * This function will create the point shape that will be drawn when it is called in the loop that 
             * will draw the points along the drawn path
             * @function 
             * @name draw 
             * @param {object} point - The point object to be drawn onto the canvas
             */
            function draw(point) {
                ctx.beginPath();
                ctx.arc(point.x,point.y,3,0, Math.PI*2, true);
                ctx.fillStyle = "white";
                ctx.fill();
              }
          
    },
    /**
     * This function will format the data information into human readable text.
     * @function
     * @name dateFormat
     * @param {string} info - the date object provided by the openweathermap api request.
     * @returns {string} - returns the month and day as a string to be displayed in the application.
     */
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
    /**
     * This function will take the weather code provided by the openweathermap api and will return the weather
     * icon to be displayed in the application.
     * @function
     * @name weatherCodes
     * @param {string} code - the weathercode used to determine which weather icon to display.
     * @returns {string} display - returns the html to display the correct icon for the provided weather code for today's
     * weather and the five day forecast.
     */
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
