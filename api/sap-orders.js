// Vercel Serverless Function - Purchase & Sales Orders
const purchaseOrders = require('./data/sap-data').purchaseOrders;
const salesOrders = require('./data/sap-data').salesOrders;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const type = req.query.type || 'purchase';
    
    if (type === 'sales') {
      return res.status(200).json({ data: salesOrders, count: salesOrders.length });
    } else {
      return res.status(200).json({ data: purchaseOrders, count: purchaseOrders.length });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
