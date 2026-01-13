// Vercel Serverless Function - Weather Data
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Mock weather data for Philippines
  return res.status(200).json({
    city: 'Manila',
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 75,
    windSpeed: 12,
    timestamp: new Date().toISOString(),
    isMock: true
  });
}
