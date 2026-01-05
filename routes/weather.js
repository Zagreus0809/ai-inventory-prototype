const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get current weather data
router.get('/current/:city?', async (req, res) => {
  try {
    const city = req.params.city || 'Manila'; // Default to Manila for Philippines
    
    if (!process.env.WEATHER_API_KEY) {
      // Mock weather data for prototype
      const mockWeather = {
        city: city,
        temperature: 28,
        condition: 'Partly Cloudy',
        humidity: 75,
        windSpeed: 12,
        forecast: 'Scattered thunderstorms expected over the next 3 days',
        timestamp: new Date().toISOString()
      };
      return res.json(mockWeather);
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const weatherData = {
      city: response.data.name,
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].main,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      timestamp: new Date().toISOString()
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error.message);
    // Return mock data with 200 status so it doesn't break other services
    res.json({
      city: req.params.city || 'Manila',
      temperature: 27,
      condition: 'Data Unavailable',
      humidity: 70,
      windSpeed: 10,
      timestamp: new Date().toISOString(),
      isMock: true
    });
  }
});

// Get weather forecast
router.get('/forecast/:city?', async (req, res) => {
  try {
    const city = req.params.city || 'Manila';
    
    // Mock forecast data for prototype
    const mockForecast = {
      city: city,
      forecast: [
        { date: '2024-01-01', temp: 29, condition: 'Sunny', rain: 0 },
        { date: '2024-01-02', temp: 31, condition: 'Partly Cloudy', rain: 20 },
        { date: '2024-01-03', temp: 26, condition: 'Thunderstorms', rain: 80 },
        { date: '2024-01-04', temp: 28, condition: 'Cloudy', rain: 40 },
        { date: '2024-01-05', temp: 30, condition: 'Sunny', rain: 10 }
      ],
      timestamp: new Date().toISOString()
    };

    res.json(mockForecast);
  } catch (error) {
    res.status(500).json({ error: 'Forecast data unavailable' });
  }
});

module.exports = router;