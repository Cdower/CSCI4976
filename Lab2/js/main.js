var FORECAST_API_KEY = "866ec33ce121141836664b2aa7406940";
var url = 'https://api.forecast.io/forecast/';
var skycons = new Skycons({"color": "black"});
var day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getGeoLocation () {
 	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocalForecast);
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
 }

function handleIcons(weather, elementName) {
    ", clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night"
    if(weather == "clear-day"){
        skycons.add(elementName, Skycons.CLEAR_DAY);
    }
    else if (weather == "clear-night") {
        skycons.add(elementName, Skycons.CLEAR_NIGHT);
    }
    else if(weather == "rain"){
        skycons.add(elementName, Skycons.RAIN);
    }
    else if(weather == "snow"){
        skycons.add(elementName, Skycons.SNOW);
    }
    else if(weather == "sleet"){
        skycons.add(elementName, Skycons.SLEET);
    }
    else if(weather == "wind"){
        skycons.add(elementName, Skycons.WIND);
    }
    else if(weather == "fog"){
        skycons.add(elementName, Skycons.FOG);
    }
    else if(weather == "cloudy"){
        skycons.add(elementName, Skycons.CLOUDY);
    }
    else if(weather == "partly-cloudy-day"){
        skycons.add(elementName, Skycons.PARTLY_CLOUDY_DAY);
    }
    else if (weather == "partly-cloudy-night") {
        skycons.add(elementName, Skycons.PARTLY_CLOUDY_NIGHT);
    }
}

function showLocalForecast (position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    $.getJSON(url+FORECAST_API_KEY+"/" + latitude +',' + longitude + "?callback=?", function(data) {
        //console.log(data);
        $('#curr_weather').append(
            '<ul id="seperateContent">' + 
            '<li>' +  '<canvas id="today" height="64" width="64"></canvas><h2>' + 
            Math.ceil(data.currently.temperature) + '&deg\t </h2> </li>' +
            '<li>' + 
            '<p>' + "Today" + '</p>' +
            '<p>' + data.currently.summary + '</p>' +
            '<h4>Wind Speed: ' + Math.round(data.currently.windSpeed, 0) + ' MPH</h4>' + 
            '<h4>Humidity: ' + Math.ceil(data.currently.humidity * 100) + '%</h4>' + '</li>' +
            '</ul>'
            );
        handleIcons(data.currently.icon, "today");
        currentDate = new Date();
        for (var i = 0; i < data.daily.data.length; i++) {
            currentDate.setTime(data.daily.data[i].time * 1000);
            $('#fiveDay').append(
                '<div class=five_day_forecast id="five_day_forecast">' +
                '<ul id="seperateContent">' + 
                '<li>' +  '<canvas id="day'+i+'" height="64" width="64"></canvas><h2>' + 
                Math.ceil(data.daily.data[i].temperatureMax) + '&deg/' + Math.ceil(data.daily.data[i].temperatureMin) + '&deg\t </h2>' + 
                '<p id="five_day_forecast">High/Low</p>' +
                '</li>' +
                '<li>' +
                '<p>' + day[currentDate.getDay()] + ' - ' + (currentDate.getMonth() + 1) + '/' + currentDate.getDate().toString() + '</p>' +
                '<p>' + data.daily.data[i].summary + 
                '<h4>Wind Speed: ' + Math.round(data.daily.data[i].windSpeed, 0) + ' MPH</h4>' +
                '</p><h4>Humidity: ' + Math.ceil(data.daily.data[i].humidity * 100) + '%</h4>' + '</li>' +
                '</ul>' + 
                '</div>'
            );
            if(i==0){
                $(".five_day_forecast").addClass("highlight");
                console.log("highlighted");
            }
            handleIcons(data.daily.data[i].icon, "day"+i);
        };
    })
}

/*function changeHighlight(){
    if($(".five_day_forecast.highlight").is(":last"))
    {
        $(".highlight").removeClass("highlight");
        $(".five_day_forecast").first().addClass("highlight");
        console.log("success");
    }
    else{
        $(".highlight").removeClass("highlight").next().addClass("highlight");
    }
}*/

function changeDisplay() {
    var forecasts = $(".five_day_forecast");
    var length = forecasts.length;
    console.log(length);
    forecasts.each(function(i, ele){
        console.log(ele);
        if($(ele).hasClass("highlight")){
            $(ele).removeClass("highlight");

            if(i < (length-1) ){
                $(forecasts[i+1]).addClass("highlight");
            }
            else{
                $(forecasts[0]).addClass("highlight");
            }
            return false;
        }
    });
}

$(document).ready(function () {
    getGeoLocation();
    
    setInterval(changeDisplay, 2000);
    //setInterval(changeHighlight
});

skycons.play();