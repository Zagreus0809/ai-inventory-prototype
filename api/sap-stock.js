// Vercel Serverless Function - SAP Stock Data
const tdkMaterials = require('./data/sap-data').tdkMaterials;
const getStockStatus = require('./data/sap-data').getStockStatus;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const stockData = tdkMaterials.map(m => ({
      materialNumber: m.materialNumber,
      materialDescription: m.description,
      materialGroup: m.materialGroup,
      plant: m.plant,
      storageLocation: m.storageLocation,
      unrestrictedStock: m.unrestrictedStock,
      safetyStock: m.safetyStock,
      reorderPoint: m.reorderPoint,
      stockStatus: getStockStatus(m.unrestrictedStock, m.safetyStock, m.reorderPoint),
      weatherSensitivity: m.weatherSensitivity
    }));

    const summary = {
      totalMaterials: stockData.length,
      criticalItems: stockData.filter(s => s.stockStatus === 'CRITICAL').length,
      lowStockItems: stockData.filter(s => s.stockStatus === 'LOW').length,
      okItems: stockData.filter(s => s.stockStatus === 'OK').length,
      weatherSensitiveItems: stockData.filter(s => s.weatherSensitivity?.humiditySensitive).length
    };

    return res.status(200).json({ data: stockData, summary });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
