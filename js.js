const key = '35fb68b7709beb3e39a474e03949e3cd';
const openWeatherApi = 'https://api.openweathermap.org/data/2.5';

function GetCurrentDate() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    return `${day}-${month}-${year}`;
}

function CheckWeatherImage(weather) {
    weatherImage = '';
    switch(weather) {
        case 'Clear': weatherImage = './images/Clear'; break;
        case 'Clouds': weatherImage =  './images/Clouds'; break;
        case 'Drizzle': weatherImage = './images/Drizzle'; break;
        case 'Fog': return './images/Fog.png';
        case 'Rain': weatherImage = './images/Rain'; break;
        case 'Snow': weatherImage = './images/Snow'; break;
        case 'Thunderstorm': weatherImage = './images/Thunderstorm'; break;
        default: return './images/Wind.png';
    }
    return weatherImage += ".png";
}

const directions = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
function GetDirection(angle) {
	let section = parseInt( angle / 22.5 + 0.5 );
	section = section % 16;
	return directions[section];
}

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function GetMonthByDate(date) {
    const d = new Date(date);
    return month[d.getMonth()].slice(0, 3).toUpperCase()
}

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function GetWeekDayByDate(date) {
    const d = new Date(date);
    return weekday[d.getDay()];
}

function GetDayByDate(date) {
    const d = new Date(date);
    return d.getDate()
}

function CurrentWeather(city) {
    fetch(openWeatherApi + '/weather?q=' + city + '&appid=' + key + '&units=metric').then(response => response.json()).then(json => {
        console.log(json);

        const currentDate = document.getElementById('current-date');
        currentDate.innerHTML = GetCurrentDate();

        const imageWeather = document.getElementById('img-weather');
        let mainWeather = json.weather[0].main;
        imageWeather.src = CheckWeatherImage(mainWeather);

        const weather = document.getElementById('weather');
        weather.innerHTML = mainWeather;

        const mainTemp = document.getElementById('main-temp');
        mainTemp.innerHTML = Math.round(json.main.temp) + '°C';

        const realFeel = document.getElementById('real-feel');
        realFeel.innerHTML = "Real Feel " + Math.round(json.main.feels_like) + '°C';

        const sunrise = document.getElementById('sunrise');
        sunrise.innerHTML = window.moment(json.sys.sunrise * 1000).format("HH:mm");

        const sunset = document.getElementById('sunset');
        sunset.innerHTML = window.moment(json.sys.sunset * 1000).format("HH:mm");

        const duration = document.getElementById('duration');
        let tmp = json.sys.sunset - json.sys.sunrise;
        duration.innerHTML = window.moment(tmp * 1000).format("HH:mm")

        NearbyWeather(json.coord.lat, json.coord.lon)
    })
}

function HourlyWeather(city) {
    fetch(openWeatherApi + '/forecast?q=' + city + '&appid=' + key + '&units=metric').then(response => response.json()).then(json => {
        console.log(json.list);
        HourlyWeatherPrint(json.list, 0, new Date());
    })
}

function HourlyWeatherPrint(json, index, date){
    let hourlyContainer = document.getElementById('hourly-container');
    hourlyContainer.innerHTML = `   <div>
                                        <h3>${GetWeekDayByDate(date)}</h3>
                                        <p class="m-auto">Forecast</p>
                                        <hr>
                                        <p>Temp(°C)</p>
                                        <hr>
                                        <p>Real Feel</p>
                                        <hr>
                                        <p>Wind(km/h)</p>
                                    </div>`;

    for (let i = index; i < index + 7; i++) {
        hourlyContainer.innerHTML += `
        <div>
            <p>${json[i].dt_txt.split(' ')[1].slice(0, -3)}</p>
            <div class="hourly-img">
                <img src="${CheckWeatherImage(json[i].weather[0].main)}" alt="">
            </div>
            <p class="m-auto">${json[i].weather[0].main}</p>
            <hr>
            <p>${Math.round(json[i].main.temp)}°</p>
            <hr>
            <p>${Math.round(json[i].main.feels_like)}°</p>
            <hr>
            <p>${Math.round(json[i].wind.speed)} ${GetDirection(json[i].wind.deg)}</p>
        </div>`
    }
}

function NearbyWeather(lat, lon) {
    let nearbyWeather = document.getElementById('nearby-weather');
    nearbyWeather.innerHTML = '';
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat + Math.random(1)}&lon=${lon}&appid=${key}&units=metric`).then(response => response.json()).then(json => {NearbyWeatherPrint(json)});
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat - Math.random(1)}&lon=${lon}&appid=${key}&units=metric`).then(response => response.json()).then(json => {NearbyWeatherPrint(json)});
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon + Math.random(1)}&appid=${key}&units=metric`).then(response => response.json()).then(json => {NearbyWeatherPrint(json)});
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon - Math.random(1)}&appid=${key}&units=metric`).then(response => response.json()).then(json => {NearbyWeatherPrint(json)});
}

function NearbyWeatherPrint(json) {
    let nearbyWeather = document.getElementById('nearby-weather');
        nearbyWeather.innerHTML += `<div>
                                        <h3>${json.name}</h3>
                                        <div class="small-nearby-img"><img src="${CheckWeatherImage(json.weather[0].main)}" alt=""></div>
                                        <p>${Math.round(json.main.temp) + '°C'}</p>
                                    </div>`
}

function FiveDayForecast(city) {
    fetch(openWeatherApi + '/forecast?q=' + city + '&appid=' + key + '&units=metric').then(response => response.json()).then(json => {
        console.log(json.list);

        let fiveDayContainer = document.getElementById('five-day-container');
        fiveDayContainer.innerHTML = '';

        let date = json.list[0].dt_txt.split(' ')[0];

            fiveDayContainer.innerHTML += `
            <div id="0">
                <h3>today</h3>
                <p class="day-week">${GetMonthByDate(date)} ${GetDayByDate(date)}</p>
                <div><img src="${CheckWeatherImage(json.list[0].weather[0].main)}" alt=""></div>
                <strong>${Math.round(json.list[0].main.temp)}°C</strong>
                <p class="weather-week">${json.list[0].weather[0].main}</p>
            </div>`;
        for (let i = 8, j = 1; i < json.list.length; i+=8, j++) {
            date = json.list[i].dt_txt.split(' ')[0];

            fiveDayContainer.innerHTML += `
            <div id="${i}">
                <h3>${GetWeekDayByDate(date)}</h3>
                <p class="day-week">${GetMonthByDate(date)} ${GetDayByDate(date)}</p>
                <div><img src="${CheckWeatherImage(json.list[i].weather[0].main)}" alt=""></div>
                <strong>${Math.round(json.list[i].main.temp)}°C</strong>
                <p class="weather-week">${json.list[i].weather[0].main}</p>
            </div>`;
        }
        $('#five-day-container').on('click', 'div', function(evt) {
            let id = Number(this.id);
        
            console.log(json.list);
            console.log(id);
        
            console.log(json.list.slice[id]);
        
            HourlyWeatherPrint(json.list, id, json.list[id].dt_txt.split(' ')[0]);
        })
        
    })
}



const searchBtn = document.getElementById('search-btn');
const searchTxt = document.getElementById('search-txt');
const todayBtn = document.getElementById('today-btn');
const _5DayBtn = document.getElementById('5-day-btn');

const main = document.getElementById('main-today');
const currentWeather = document.getElementById('current-weather');
const fiveDayForecast = document.getElementById('five-day-forecast');
const nearbyPlaces = document.getElementById('nearby-places');


searchBtn.onclick = (e) => {
    e.preventDefault();
    console.log(searchTxt.value);
    CurrentWeather(searchTxt.value);
    HourlyWeather(searchTxt.value, 0, new Date());
    FiveDayForecast(searchTxt.value);
}

_5DayBtn.onclick = (e) => {
    e.preventDefault();
    currentWeather.classList.add('hidden');
    nearbyPlaces.classList.add('hidden');
    fiveDayForecast.classList.remove('hidden');
}

todayBtn.onclick = (e) => {
    e.preventDefault();
    currentWeather.classList.remove('hidden');
    fiveDayForecast.classList.add('hidden');
    nearbyPlaces.classList.remove('hidden');
    HourlyWeather(searchTxt.value, 0, new Date());
}