// Vercel Serverless Function - Purchase & Sales Orders
const { purchaseOrders, salesOrders } = require('./data/sap-data');

module.exports = (req, res) => {
  const type = req.query.type || 'purchase';
  
  if (type === 'sales') {
    res.json({ data: salesOrders, count: salesOrders.length });
  } else {
    res.json({ data: purchaseOrders, count: purchaseOrders.length });
  }
};
