// Vercel Serverless Function - SAP MRP Analysis
const { calculateMRP } = require('./data/sap-data');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const mrpData = calculateMRP();
    
    // Calculate summary statistics
    const summary = {
      totalMaterials: mrpData.length,
      criticalRisk: mrpData.filter(m => m.riskLevel === 'CRITICAL').length,
      highRisk: mrpData.filter(m => m.riskLevel === 'HIGH').length,
      mediumRisk: mrpData.filter(m => m.riskLevel === 'MEDIUM').length,
      lowRisk: mrpData.filter(m => m.riskLevel === 'LOW').length,
      weatherSensitiveCount: mrpData.filter(m => m.weatherSensitive).length
    };

    // Get critical items
    const criticalItems = mrpData
      .filter(m => m.riskLevel === 'CRITICAL' || m.riskLevel === 'HIGH')
      .sort((a, b) => {
        const riskOrder = { 'CRITICAL': 0, 'HIGH': 1 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      });

    res.json({
      success: true,
      data: mrpData,
      summary,
      criticalItems,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('MRP Analysis Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate MRP analysis',
      details: error.message
    });
  }
};
