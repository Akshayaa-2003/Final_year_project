import axios from "axios";

export const getWeather = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  const res = await axios.get(url);

  const weather = res.data.current_weather;

  return {
    temperature: weather.temperature, // °C
    windSpeed: weather.windspeed,     // km/h
    weatherCode: weather.weathercode  // rain / clear / cloudy
  };
};
