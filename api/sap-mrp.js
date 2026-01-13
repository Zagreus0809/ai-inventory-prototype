// Vercel Serverless Function - MRP Analysis
const calculateMRP = require('./data/sap-data').calculateMRP;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const mrpData = calculateMRP();
    
    const summary = {
      totalMaterials: mrpData.length,
      criticalRisk: mrpData.filter(m => m.riskLevel === 'CRITICAL').length,
      highRisk: mrpData.filter(m => m.riskLevel === 'HIGH').length,
      mediumRisk: mrpData.filter(m => m.riskLevel === 'MEDIUM').length,
      lowRisk: mrpData.filter(m => m.riskLevel === 'LOW').length,
      weatherSensitiveCount: mrpData.filter(m => m.weatherSensitive).length
    };

    const criticalItems = mrpData.filter(m => m.riskLevel === 'CRITICAL' || m.riskLevel === 'HIGH');

    return res.status(200).json({ data: mrpData, summary, criticalItems });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
