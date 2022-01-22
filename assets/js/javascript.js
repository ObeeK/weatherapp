// var cityName = document.querySelector
var citySearch = document.querySelector("#weather-search")
var searchButton = document.querySelector("#searchButton")
var forecast = document.querySelector("#forecast")
// var day2 = document.querySelector("#day2")
// var day3 = document.querySelector("#day3")
// var day4 = document.querySelector("#day4")
// var day5 = document.querySelector("#day5")
var cityList = JSON.parse(localStorage.getItem("cityList"))?JSON.parse(localStorage.getItem("cityList")):[]
console.log(citySearch);
// Call current weather API for lat/lon
var weatherFunction = function (cityName) {
    var currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=6b0fd80c9b010dcae0fa3214c8f86510&units=imperial`
    fetch(currentWeatherApiUrl)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;
            var oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=6b0fd80c9b010dcae0fa3214c8f86510&units=imperial`
            fetch(oneCallApiUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (oneCallData) {
                    console.log(oneCallData)
                    renderItems(oneCallData)
                    // this is where we'll display weather info on page

                    // use bootstrap button for UV index
                })

        })
        .catch(function(error) {
            console.log("Could not find city", cityName)
        })
};

// capture user input when search button is clicked
var cityName; 
searchButton.addEventListener("click", function(event) {
console.log(citySearch.value);
cityName = citySearch.value;
if(cityList.indexOf(cityName) === -1) {
    cityList.push(cityName)
    saveCity(cityList)
    searchHistory()
}
weatherFunction(cityName);
})

var renderItems = function(data){
    // render Current Weather
    renderCurrent(data.current)
    
    renderForecast(data.daily, data.timezone)
}

var renderForecast = function(dailyForecast, timeZone) {
    forecast.innerHTML=" "
    for(var i = 1; i < 6; i++) {
        var col = document.createElement("div")
        var card = document.createElement("div")
        var cardBody = document.createElement("div")
        var icon = document.createElement("img")
        var tempEl = document.createElement("p")
        var windEl = document.createElement("p")
        var humidityEl = document.createElement("p")
        var cardTitle = document.createElement("h5")

        col.append(card)
        card.append(cardBody)
        cardBody.append(cardTitle, icon, tempEl, windEl, humidityEl)

        col.setAttribute("class", "col-md")
        col.classList.add("fiveDayCard")
        card.setAttribute("class", "card bg-primary h-100 text-white")
        cardBody.setAttribute("class", "card-body p-2")
        cardTitle.classList.add("card-title")
        tempEl.classList.add("card-text")
        windEl.classList.add("card-text")
        humidityEl.classList.add("card-text")
        
        var currentDate = dayjs().add(i, "day").format('MM/DD/YYYY');
        cardTitle.innerHTML = currentDate

        var temp = dailyForecast[i].temp.day
        tempEl.innerHTML = "Temp: " + temp;

        humidityEl.innerHTML = "Humidity " + dailyForecast[i].humidity
        windEl.innerHTML = "Wind: " + dailyForecast[i].wind_speed + "mph"
        icon.setAttribute("src", "http://openweathermap.org/img/wn/"+dailyForecast[i].weather[0].icon+"@2x.png")
        forecast.append(col)
        
    }
}

//localStorage

function saveCity(cityList) {
    localStorage.setItem('cityList', JSON.stringify(cityList))
}


// localStorage/previously searched cities
// function saveCityToLocalStorage(city) {
//     var localStorageString = localStorage.getItem("cityNames");
//     console.info("localStorageString: ", localStorageString);
//     var searchedCities = JSON.parse(localStorage.getItem("cityNames"));
//     console.info("searchedCities: ", searchedCities);
//     var trueOrFalse = searchedCities.includes(city);
//     console.info("trueOrFalse: ", trueOrFalse);
//     if (searchedCities.includes(city)) {
//       $("#lastSearchedCity").append(city);
  
//       console.log("take out the first one and append new city", true);
//     } else {
//       if (searchedCities.length >= 5) {
//         console.log("append city", false);
//         searchedCities[0].remove();
//         // Remove the first one
//         // add the new city
//         $("#lastSearchedCity").append(city);
//       } else {
//         // add the new city
//       }
//     }
// }
function renderCurrent(data) {
    document.querySelector('#citySearched').innerHTML = "City: " + cityName + " " + "Date: "+dayjs().format('MM/DD/YY');
    document.querySelector('#wind').innerHTML = "Wind: " + data.wind_speed + "mph"
    document.querySelector('#temp').innerHTML = "Temp: " + data.temp + " degrees"
    document.querySelector('#humidity').innerHTML = "Humidity: " + data.humidity
    document.querySelector('#uvIndex').innerHTML = "UV Index: " + data.uvi
    document.querySelector('#wIcon').setAttribute("src", "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png")

}

function searchHistory() {
    document.querySelector('#searchedCities').innerHTML = ""
    for(var i = 0; i < cityList.length; i++) {
        var historyButton = document.createElement("button")
        historyButton.innerHTML = cityList[i];
    historyButton.classList.add('history')
        historyButton.addEventListener("click", function(event) {
            var historyCity = event.target.innerHTML
            cityName = historyCity
            weatherFunction(historyCity)
        })

        document.querySelector('#searchedCities').append(historyButton);
    }
    

}

searchHistory()
// when previous cities are clicked, how do we search it?