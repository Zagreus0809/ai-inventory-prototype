// Vercel Serverless Function - Weather Data
module.exports = (req, res) => {
  // Mock weather data for Philippines
  res.json({
    city: 'Manila',
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 75,
    windSpeed: 12,
    timestamp: new Date().toISOString(),
    isMock: true
  });
};
