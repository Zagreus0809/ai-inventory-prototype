const express = require('express');
const router = express.Router();

// Mock inventory data for prototype
let inventoryData = [
  {
    id: 1,
    name: 'Winter Jackets',
    category: 'Clothing',
    currentStock: 45,
    safetyStock: 20,
    reorderPoint: 30,
    weatherSensitive: true,
    seasonality: 'winter',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Umbrellas',
    category: 'Accessories',
    currentStock: 15,
    safetyStock: 25,
    reorderPoint: 35,
    weatherSensitive: true,
    seasonality: 'rainy',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Sunscreen',
    category: 'Health & Beauty',
    currentStock: 80,
    safetyStock: 30,
    reorderPoint: 40,
    weatherSensitive: true,
    seasonality: 'summer',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Basic T-Shirts',
    category: 'Clothing',
    currentStock: 120,
    safetyStock: 50,
    reorderPoint: 70,
    weatherSensitive: false,
    seasonality: 'all',
    lastUpdated: new Date().toISOString()
  }
];

// Get all inventory items
router.get('/', (req, res) => {
  res.json(inventoryData);
});

// Get specific inventory item
router.get('/:id', (req, res) => {
  const item = inventoryData.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

// Update inventory item
router.put('/:id', (req, res) => {
  const itemIndex = inventoryData.findIndex(i => i.id === parseInt(req.params.id));
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  inventoryData[itemIndex] = {
    ...inventoryData[itemIndex],
    ...req.body,
    lastUpdated: new Date().toISOString()
  };
  
  res.json(inventoryData[itemIndex]);
});

// Add new inventory item
router.post('/', (req, res) => {
  const newItem = {
    id: Math.max(...inventoryData.map(i => i.id)) + 1,
    ...req.body,
    lastUpdated: new Date().toISOString()
  };
  
  inventoryData.push(newItem);
  res.status(201).json(newItem);
});

module.exports = router;