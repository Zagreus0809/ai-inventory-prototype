// Vercel Serverless Function - MRP Analysis
const { calculateMRP } = require('./data/sap-data');

module.exports = (req, res) => {
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

  res.json({ data: mrpData, summary, criticalItems });
};
