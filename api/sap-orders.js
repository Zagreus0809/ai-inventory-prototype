// Vercel Serverless Function - Purchase & Sales Orders
const { purchaseOrders, salesOrders } = require('./data/sap-data');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const type = req.query.type || 'purchase';
  
  if (type === 'sales') {
    res.json({ data: salesOrders, count: salesOrders.length });
  } else {
    res.json({ data: purchaseOrders, count: purchaseOrders.length });
  }
};
