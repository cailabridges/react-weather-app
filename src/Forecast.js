import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";
import "./Weather.css";
import "bootstrap/dist/css/bootstrap.min.css";

const customIcons = {
  "clear sky": "CLEAR_DAY",
  "sky is clear": "CLEAR_DAY",
  "few clouds": "PARTLY_CLOUDY_DAY",
  "cloudy": "CLOUDY",
  "scattered clouds": "CLOUDY",
  "broken clouds": "CLOUDY",
  "overcast clouds": "CLOUDY",
  "shower rain": "RAIN",
  "rain": "RAIN",
  "light rain": "RAIN",
  "moderate rain": "RAIN",
  "heavy intensity rain": "RAIN",
  "thunderstorm": "THUNDER",
  "thunderstorm with rain": "THUNDER",
  "thunderstorm with heavy rain": "THUNDER",
  "snow": "SNOW",
  "light snow": "SNOW",
  "rain and snow": "SNOW",
  "mist": "FOG",
  "haze": "FOG",
  "fog": "FOG",
  "smoke": "FOG",
};

const Forecast = ({ temperatureUnit, city }) => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const apiKey = "241ff083e917bb12t439a7aco17d1be3";
    const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

    axios
      .get(apiUrl)
      .then((response) => {
        setForecastData(response.data.daily);
      })
      .catch((error) => {
        console.error("Error fetching forecast data:", error);
      });
  }, [city]);

  const getWeatherIcon = (description) => {
    const iconName = customIcons[description.toLowerCase()];
    if (iconName) {
      return iconName;
    }
    return "CLEAR_DAY";
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const convertTemperature = (temperature) => {
    if (temperatureUnit === "°C") {
      return Math.round(temperature);
    } else {
      return Math.round((temperature * 9) / 5 + 32);
    }
  };

  const renderForecast = () => {
    if (!Array.isArray(forecastData) || forecastData.length === 0) {
      return null;
    }

    return forecastData.slice(0, 5).map((day, index) => {
      const description = day.condition?.description || "";
      const maxTemp = convertTemperature(day.temperature.maximum);
      const minTemp = convertTemperature(day.temperature.minimum);
      const weatherIcon = getWeatherIcon(description);

      return (
        <div key={index} className="weather-forecast">
          <div className="col">
            <div className="weather-forecast-date">{formatDate(day.time)}</div>
            <div className="weather-forecast-icon">
              <ReactAnimatedWeather
                icon={weatherIcon}
                color="#000"
                size={40}
                animate={true}
              />
            </div>
            <div className="weather-forecast-temps">
              <span className="weather-forecast-temp-max">{maxTemp}&deg;</span>
              <span className="weather-forecast-temp-min">{minTemp}&deg;</span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div id="forecast" className="weather-forecast">
      {renderForecast()}
    </div>
  );
};

export default Forecast;
