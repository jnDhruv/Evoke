// backend/services/weatherService.js
const axios = require("axios");
require("dotenv").config();

// Pincode to city mapping for OpenWeatherMap
const pincodeCityMap = {
  400051: "Mumbai",
  411001: "Pune",
  226001: "Lucknow",
  110001: "Delhi",
  560001: "Bangalore",
  600001: "Chennai",
  390001: "Vadodara",
};

function rainScore(rain_mm) {
  if (!rain_mm) return 0;
  if (rain_mm < 2) return 0.1;
  if (rain_mm < 7) return 0.2;
  return 0.3;
}

function tempScore(temp) {
  if (temp >= 20 && temp <= 30) return 0;
  if (temp > 30 && temp <= 38) return 0.08;
  if (temp > 38) return 0.15;
  if (temp < 10) return 0.1;
  return 0;
}

function windScore(kmh) {
  if (kmh < 10) return 0;
  if (kmh < 25) return 0.05;
  if (kmh < 40) return 0.1;
  return 0.15;
}

function visibilityScore(vis) {
  if (vis > 8000) return 0;
  if (vis > 4000) return 0.05;
  if (vis > 1000) return 0.1;
  return 0.15;
}

function extremeScore(weatherMain) {
  if (!weatherMain) return 0;
  if (weatherMain.includes("Thunderstorm")) return 0.1;
  if (weatherMain.includes("Extreme")) return 0.15;
  return 0;
}

async function getWeatherScore(pincode) {
  try {
    const city = pincodeCityMap[pincode] || "Mumbai";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_KEY}&units=metric`;
    const res = await axios.get(url);
    const d = res.data;

    const rain = d.rain ? d.rain["1h"] : 0;
    const temp = d.main.temp;
    const wind = d.wind.speed * 3.6; // m/s to km/h
    const vis = d.visibility || 10000;
    const weatherMain = d.weather[0]?.main || "";

    const score = Math.min(
      rainScore(rain) +
        tempScore(temp) +
        windScore(wind) +
        visibilityScore(vis) +
        extremeScore(weatherMain),
      1.0,
    );

    return {
      score: parseFloat(score.toFixed(2)),
      raw: { rain, temp, wind, vis, weatherMain, city },
    };
  } catch (err) {
    console.error("Weather API error:", err.message);
    return { score: 0.1, raw: {} };
  }
}

module.exports = { getWeatherScore };
