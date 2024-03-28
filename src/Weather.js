import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";
import "./Weather.css";
import worldlyWeatherLogo from "./images/worldly-weather.svg";
import Forecast from "./Forecast";
import "bootstrap/dist/css/bootstrap.min.css";


const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [temperatureUnit, setTemperatureUnit] = useState("°C");
  const [city, setCity] = useState("Raleigh"); // Default city

  const customIcons = {
    "clear sky": "CLEAR_DAY",
    "sky is clear": "CLEAR_DAY",
    "few clouds": "PARTLY_CLOUDY_DAY",
    "scattered clouds": "CLOUDY",
    "broken clouds": "CLOUDY",
    "overcast clouds": "CLOUDY",
    "shower rain": "RAIN",
    rain: "RAIN",
    "light rain": "RAIN",
    "moderate rain": "RAIN",
    "heavy intensity rain": "RAIN",
    thunderstorm: "THUNDER",
    "thunderstorm with rain": "THUNDER",
    "thunderstorm with heavy rain": "THUNDER",
    snow: "SNOW",
    "light snow": "SNOW",
    "rain and snow": "SNOW",
    mist: "FOG",
    haze: "FOG",
    fog: "FOG",
    smoke: "FOG",
  };

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const formatDate = (date) => {
    let day = days[date.getDay()];
    let minutes = date.getMinutes();
    let hours = date.getHours();

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    if (hours < 10) {
      hours = `0${hours}`;
    }

    return `${day} ${hours}:${minutes}, `;
  };

  const getCurrentDate = () => {
    let now = new Date();
    return formatDate(now);
  };

  const searchCity = (city) => {
    const apiKey = "241ff083e917bb12t439a7aco17d1be3";
    const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
    axios.get(apiUrl).then(function (response) {
      setWeatherData(response.data);
      setCity(city);
    });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    let searchInput = document.querySelector("#search-input");
    searchCity(searchInput.value);
    let currentDateElement = document.querySelector("#current-date");
    currentDateElement.innerHTML = getCurrentDate();
  };

  useEffect(() => {
    searchCity(city); // Use the city state here
  }, [city]); // Trigger useEffect when city changes

  const getWeatherIcon = (description) => {
    const iconName = customIcons[description.toLowerCase()];
    const weatherIcon = iconName ? iconName : "CLEAR_DAY";
    return weatherIcon;
  };

  const toggleTemperatureUnit = (event) => {
    event.preventDefault();
    setTemperatureUnit((prevUnit) => (prevUnit === "°C" ? "°F" : "°C"));
  };

  const convertTemperature = (temperature) => {
    const unit = temperatureUnit === "°C" ? "C" : "F";
    if (unit === "C") {
      return Math.round(temperature);
    }
    return Math.round((temperature * 9) / 5 + 32);
  };

  function capitalizeFirstLetter(str) {
    let words = str.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(" ");
  }

  return (
    <div>
      <div className="logo">
        <img
          className="worldy-weather-logo"
          src={worldlyWeatherLogo}
          alt="Worldy Weather Logo"
        />
      </div>
      <div className="weather-app-container">
        
        <header >
          
          <form className="search-form" id="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Enter a city.."
              className="search-input"
              id="search-input"
              required
            />
            <input
              type="submit"
              value="Search"
              className="search-button"
              id="search-button"
            />
          </form>
          
        </header>
        
        <main>
          {weatherData && (
            <div className="current-weather-container">
              <div>
                <h1 className="current-city" id="current-city">
                  {weatherData.city}
                </h1>
                <p className="current-details">
                  <span className="current-date" id="current-date">
                    {getCurrentDate()}
                  </span>
                  <span id="description">
                    {capitalizeFirstLetter(weatherData.condition.description)}
                  </span>
                  <br />
                  Humidity:{" "}
                  <strong id="humidity">
                    {weatherData.temperature.humidity}%
                  </strong>
                  , Wind:{" "}
                  <strong id="wind-speed">
                    {Math.round(weatherData.wind.speed)}km/h
                  </strong>
                </p>
              </div>
              <div className="current-temperature-container">
                <div className="current-weather-icon">
                  <ReactAnimatedWeather
                    icon={getWeatherIcon(weatherData.condition.description)}
                    color="#000"
                    size={75}
                    animate={true}
                  />
                </div>
                <span className="current-temperature-value" id="current-temp">
                  {convertTemperature(weatherData.temperature.current)}
                </span>
                <span
                  className="current-temperature-unit"
                  id="current-temperature-unit"
                >
                  {temperatureUnit}
                </span>
                <span className="current-temp-divider">|</span>
                <a
                  id="temperature-unit-toggle"
                  className="temperature-unit-toggle"
                  href="#"
                  onClick={toggleTemperatureUnit}
                >
                  {temperatureUnit === "°C" ? "°F" : "°C"}
                </a>
              </div>
            </div>
          )}
          <div className="forecast-container">
            <Forecast temperatureUnit={temperatureUnit} city={city} />
          </div>
        </main>
        <footer>
          <p>
            This project was coded by{" "}
            <a href="https://github.com/cailabridges" target="_blank">
              Caila Bridges
            </a>{" "}
            and is{" "}
            <a
              href="https://github.com/cailabridges/weather-app"
              target="_blank"
            >
              {" "}
              open-sourced on GitHub
            </a>{" "}
            and{" "}
            <a href="https://worldlyweather.netlify.app/" target="_blank">
              hosted on Netlify
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Weather;
