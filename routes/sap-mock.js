const express = require('express');
const router = express.Router();

// Mock SAP ERP System for TDK Electronics Components
// Simulates SAP MM (Materials Management) module structure

// SAP-style Material Master Data (MARA table structure)
const materialMaster = [
  // Capacitors
  { materialNumber: 'TDK-CAP-001', description: 'Multilayer Ceramic Capacitor 100nF', materialGroup: 'MLCC', baseUnit: 'PC', plant: '1000', storageLocation: 'WH01', materialType: 'ROH' },
  { materialNumber: 'TDK-CAP-002', description: 'Aluminum Electrolytic Capacitor 470uF', materialGroup: 'ALEC', baseUnit: 'PC', plant: '1000', storageLocation: 'WH01', materialType: 'ROH' },
  { materialNumber: 'TDK-CAP-003', description: 'Film Capacitor 1uF 250V', materialGroup: 'FILM', baseUnit: 'PC', plant: '1000', storageLocation: 'WH02', materialType: 'ROH' },
  { materialNumber: 'TDK-CAP-004', description: 'Tantalum Capacitor 10uF 16V', materialGroup: 'TANT', baseUnit: 'PC', plant: '1000', storageLocation: 'WH01', materialType: 'ROH' },
  
  // Inductors
  { materialNumber: 'TDK-IND-001', description: 'Power Inductor 10uH 3A', materialGroup: 'PIND', baseUnit: 'PC', plant: '1000', storageLocation: 'WH02', materialType: 'ROH' },
  { materialNumber: 'TDK-IND-002', description: 'SMD Inductor 4.7uH', materialGroup: 'SMDI', baseUnit: 'PC', plant: '1000', storageLocation: 'WH02', materialType: 'ROH' },
  { materialNumber: 'TDK-IND-003', description: 'Common Mode Choke 100uH', materialGroup: 'CHOK', baseUnit: 'PC', plant: '1000', storageLocation: 'WH03', materialType: 'ROH' },
  
  // Ferrites
  { materialNumber: 'TDK-FER-001', description: 'Ferrite Bead 600ohm 100MHz', materialGroup: 'FERB', baseUnit: 'PC', plant: '1000', storageLocation: 'WH03', materialType: 'ROH' },
  { materialNumber: 'TDK-FER-002', description: 'Ferrite Core E25', materialGroup: 'FERC', baseUnit: 'PC', plant: '1000', storageLocation: 'WH03', materialType: 'ROH' },
  
  // Sensors
  { materialNumber: 'TDK-SEN-001', description: 'Temperature Sensor NTC 10K', materialGroup: 'TEMP', baseUnit: 'PC', plant: '1000', storageLocation: 'WH04', materialType: 'ROH' },
  { materialNumber: 'TDK-SEN-002', description: 'Pressure Sensor MEMS', materialGroup: 'PRES', baseUnit: 'PC', plant: '1000', storageLocation: 'WH04', materialType: 'ROH' },
  { materialNumber: 'TDK-SEN-003', description: 'Hall Effect Sensor', materialGroup: 'HALL', baseUnit: 'PC', plant: '1000', storageLocation: 'WH04', materialType: 'ROH' },
  
  // Transformers
  { materialNumber: 'TDK-TRF-001', description: 'Pulse Transformer 1:1', materialGroup: 'PULS', baseUnit: 'PC', plant: '1000', storageLocation: 'WH05', materialType: 'ROH' },
  { materialNumber: 'TDK-TRF-002', description: 'Power Transformer 12V 2A', materialGroup: 'POWR', baseUnit: 'PC', plant: '1000', storageLocation: 'WH05', materialType: 'ROH' },
  
  // Filters
  { materialNumber: 'TDK-FLT-001', description: 'EMI Filter 10A 250V', materialGroup: 'EMIF', baseUnit: 'PC', plant: '1000', storageLocation: 'WH05', materialType: 'ROH' },
  { materialNumber: 'TDK-FLT-002', description: 'LC Filter Module', materialGroup: 'LCFM', baseUnit: 'PC', plant: '1000', storageLocation: 'WH05', materialType: 'ROH' },
];

// SAP-style Stock Overview (MARD table - Stock per Storage Location)
let stockData = [
  // Capacitors - High volume items
  { materialNumber: 'TDK-CAP-001', plant: '1000', storageLocation: 'WH01', unrestrictedStock: 125000, qualityInspection: 5000, blocked: 0, inTransit: 15000, safetyStock: 50000, reorderPoint: 75000, maxStock: 200000 },
  { materialNumber: 'TDK-CAP-002', plant: '1000', storageLocation: 'WH01', unrestrictedStock: 45000, qualityInspection: 2000, blocked: 500, inTransit: 8000, safetyStock: 20000, reorderPoint: 35000, maxStock: 80000 },
  { materialNumber: 'TDK-CAP-003', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 18000, qualityInspection: 1000, blocked: 0, inTransit: 5000, safetyStock: 10000, reorderPoint: 15000, maxStock: 40000 },
  { materialNumber: 'TDK-CAP-004', plant: '1000', storageLocation: 'WH01', unrestrictedStock: 8500, qualityInspection: 500, blocked: 200, inTransit: 3000, safetyStock: 5000, reorderPoint: 8000, maxStock: 25000 },
  
  // Inductors
  { materialNumber: 'TDK-IND-001', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 32000, qualityInspection: 1500, blocked: 0, inTransit: 6000, safetyStock: 15000, reorderPoint: 25000, maxStock: 60000 },
  { materialNumber: 'TDK-IND-002', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 55000, qualityInspection: 2500, blocked: 0, inTransit: 10000, safetyStock: 25000, reorderPoint: 40000, maxStock: 100000 },
  { materialNumber: 'TDK-IND-003', plant: '1000', storageLocation: 'WH03', unrestrictedStock: 12000, qualityInspection: 800, blocked: 100, inTransit: 2500, safetyStock: 8000, reorderPoint: 12000, maxStock: 30000 },
  
  // Ferrites
  { materialNumber: 'TDK-FER-001', plant: '1000', storageLocation: 'WH03', unrestrictedStock: 78000, qualityInspection: 3000, blocked: 0, inTransit: 12000, safetyStock: 35000, reorderPoint: 55000, maxStock: 120000 },
  { materialNumber: 'TDK-FER-002', plant: '1000', storageLocation: 'WH03', unrestrictedStock: 4500, qualityInspection: 500, blocked: 0, inTransit: 2000, safetyStock: 3000, reorderPoint: 5000, maxStock: 15000 },
  
  // Sensors - Lower volume, higher value
  { materialNumber: 'TDK-SEN-001', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 15000, qualityInspection: 1000, blocked: 0, inTransit: 3000, safetyStock: 8000, reorderPoint: 12000, maxStock: 30000 },
  { materialNumber: 'TDK-SEN-002', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 2800, qualityInspection: 200, blocked: 50, inTransit: 800, safetyStock: 2000, reorderPoint: 3500, maxStock: 8000 },
  { materialNumber: 'TDK-SEN-003', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 6500, qualityInspection: 400, blocked: 0, inTransit: 1500, safetyStock: 4000, reorderPoint: 6000, maxStock: 15000 },
  
  // Transformers
  { materialNumber: 'TDK-TRF-001', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 3200, qualityInspection: 300, blocked: 0, inTransit: 800, safetyStock: 2000, reorderPoint: 3000, maxStock: 8000 },
  { materialNumber: 'TDK-TRF-002', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 1800, qualityInspection: 150, blocked: 0, inTransit: 500, safetyStock: 1200, reorderPoint: 2000, maxStock: 5000 },
  
  // Filters
  { materialNumber: 'TDK-FLT-001', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 4500, qualityInspection: 250, blocked: 0, inTransit: 1000, safetyStock: 2500, reorderPoint: 4000, maxStock: 10000 },
  { materialNumber: 'TDK-FLT-002', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 2200, qualityInspection: 100, blocked: 0, inTransit: 600, safetyStock: 1500, reorderPoint: 2500, maxStock: 6000 },
];


// SAP-style Purchase Orders (EKKO/EKPO tables)
const purchaseOrders = [
  { poNumber: '4500001234', vendor: 'V-10001', vendorName: 'Murata Manufacturing', materialNumber: 'TDK-CAP-001', quantity: 50000, unit: 'PC', deliveryDate: '2025-01-15', status: 'OPEN', plant: '1000' },
  { poNumber: '4500001235', vendor: 'V-10002', vendorName: 'Nichicon Corp', materialNumber: 'TDK-CAP-002', quantity: 20000, unit: 'PC', deliveryDate: '2025-01-10', status: 'PARTIALLY_DELIVERED', plant: '1000' },
  { poNumber: '4500001236', vendor: 'V-10003', vendorName: 'Vishay Intertechnology', materialNumber: 'TDK-IND-001', quantity: 15000, unit: 'PC', deliveryDate: '2025-01-20', status: 'OPEN', plant: '1000' },
  { poNumber: '4500001237', vendor: 'V-10004', vendorName: 'Bourns Inc', materialNumber: 'TDK-SEN-001', quantity: 8000, unit: 'PC', deliveryDate: '2025-01-08', status: 'OPEN', plant: '1000' },
  { poNumber: '4500001238', vendor: 'V-10005', vendorName: 'Würth Elektronik', materialNumber: 'TDK-FER-001', quantity: 30000, unit: 'PC', deliveryDate: '2025-01-25', status: 'OPEN', plant: '1000' },
];

// SAP-style Sales Orders / Demand (VBAK/VBAP tables)
const salesOrders = [
  { soNumber: '0010001001', customer: 'C-20001', customerName: 'Samsung Electronics', materialNumber: 'TDK-CAP-001', quantity: 80000, unit: 'PC', requestedDate: '2025-01-12', status: 'OPEN' },
  { soNumber: '0010001002', customer: 'C-20002', customerName: 'Apple Inc', materialNumber: 'TDK-CAP-001', quantity: 45000, unit: 'PC', requestedDate: '2025-01-18', status: 'OPEN' },
  { soNumber: '0010001003', customer: 'C-20003', customerName: 'Bosch Automotive', materialNumber: 'TDK-SEN-002', quantity: 5000, unit: 'PC', requestedDate: '2025-01-15', status: 'OPEN' },
  { soNumber: '0010001004', customer: 'C-20004', customerName: 'Continental AG', materialNumber: 'TDK-IND-001', quantity: 25000, unit: 'PC', requestedDate: '2025-01-20', status: 'OPEN' },
  { soNumber: '0010001005', customer: 'C-20001', customerName: 'Samsung Electronics', materialNumber: 'TDK-FER-001', quantity: 40000, unit: 'PC', requestedDate: '2025-01-22', status: 'OPEN' },
  { soNumber: '0010001006', customer: 'C-20005', customerName: 'Siemens AG', materialNumber: 'TDK-TRF-002', quantity: 2000, unit: 'PC', requestedDate: '2025-01-10', status: 'URGENT' },
  { soNumber: '0010001007', customer: 'C-20006', customerName: 'LG Electronics', materialNumber: 'TDK-CAP-002', quantity: 30000, unit: 'PC', requestedDate: '2025-01-14', status: 'OPEN' },
];

// SAP-style Movement History (MSEG table)
const movementHistory = [
  { documentNumber: '5000001001', movementType: '101', materialNumber: 'TDK-CAP-001', quantity: 25000, postingDate: '2024-12-20', plant: '1000', storageLocation: 'WH01', description: 'GR from PO' },
  { documentNumber: '5000001002', movementType: '261', materialNumber: 'TDK-CAP-001', quantity: -15000, postingDate: '2024-12-21', plant: '1000', storageLocation: 'WH01', description: 'Issue to Production' },
  { documentNumber: '5000001003', movementType: '601', materialNumber: 'TDK-CAP-001', quantity: -20000, postingDate: '2024-12-22', plant: '1000', storageLocation: 'WH01', description: 'Goods Issue - Delivery' },
  { documentNumber: '5000001004', movementType: '101', materialNumber: 'TDK-IND-001', quantity: 10000, postingDate: '2024-12-22', plant: '1000', storageLocation: 'WH02', description: 'GR from PO' },
  { documentNumber: '5000001005', movementType: '301', materialNumber: 'TDK-SEN-001', quantity: 2000, postingDate: '2024-12-23', plant: '1000', storageLocation: 'WH04', description: 'Transfer Posting' },
];

// SAP Plant/Warehouse Configuration
const plants = [
  { plant: '1000', name: 'TDK Philippines Main Plant', address: 'Laguna Technopark, Philippines', country: 'PH' },
  { plant: '2000', name: 'TDK Philippines Plant 2', address: 'Cavite Export Zone, Philippines', country: 'PH' },
];

const storageLocations = [
  { plant: '1000', storageLocation: 'WH01', description: 'Main Warehouse - Capacitors', capacity: 500000 },
  { plant: '1000', storageLocation: 'WH02', description: 'Inductors & Coils Warehouse', capacity: 300000 },
  { plant: '1000', storageLocation: 'WH03', description: 'Ferrite Products Warehouse', capacity: 250000 },
  { plant: '1000', storageLocation: 'WH04', description: 'Sensors & Precision Components', capacity: 100000 },
  { plant: '1000', storageLocation: 'WH05', description: 'Transformers & Filters', capacity: 150000 },
];

// Weather sensitivity mapping for electronics components
const weatherSensitivity = {
  'MLCC': { humiditySensitive: true, tempSensitive: true, maxHumidity: 60, optimalTemp: { min: 20, max: 25 } },
  'ALEC': { humiditySensitive: true, tempSensitive: true, maxHumidity: 65, optimalTemp: { min: 15, max: 30 } },
  'FILM': { humiditySensitive: false, tempSensitive: true, maxHumidity: 80, optimalTemp: { min: 10, max: 35 } },
  'TANT': { humiditySensitive: true, tempSensitive: true, maxHumidity: 55, optimalTemp: { min: 18, max: 28 } },
  'PIND': { humiditySensitive: false, tempSensitive: false, maxHumidity: 85, optimalTemp: { min: 5, max: 40 } },
  'SMDI': { humiditySensitive: true, tempSensitive: true, maxHumidity: 60, optimalTemp: { min: 20, max: 30 } },
  'CHOK': { humiditySensitive: false, tempSensitive: false, maxHumidity: 85, optimalTemp: { min: 5, max: 45 } },
  'FERB': { humiditySensitive: false, tempSensitive: true, maxHumidity: 80, optimalTemp: { min: 15, max: 35 } },
  'FERC': { humiditySensitive: false, tempSensitive: true, maxHumidity: 80, optimalTemp: { min: 15, max: 35 } },
  'TEMP': { humiditySensitive: true, tempSensitive: true, maxHumidity: 50, optimalTemp: { min: 20, max: 25 } },
  'PRES': { humiditySensitive: true, tempSensitive: true, maxHumidity: 45, optimalTemp: { min: 18, max: 28 } },
  'HALL': { humiditySensitive: true, tempSensitive: true, maxHumidity: 55, optimalTemp: { min: 15, max: 30 } },
  'PULS': { humiditySensitive: false, tempSensitive: false, maxHumidity: 85, optimalTemp: { min: 5, max: 45 } },
  'POWR': { humiditySensitive: false, tempSensitive: true, maxHumidity: 80, optimalTemp: { min: 10, max: 40 } },
  'EMIF': { humiditySensitive: false, tempSensitive: false, maxHumidity: 85, optimalTemp: { min: 5, max: 45 } },
  'LCFM': { humiditySensitive: true, tempSensitive: true, maxHumidity: 60, optimalTemp: { min: 18, max: 30 } },
};


// ============================================
// SAP RFC-style API Endpoints
// ============================================

// BAPI_MATERIAL_GETLIST - Get Material Master List
router.get('/materials', (req, res) => {
  const { materialGroup, plant, searchTerm } = req.query;
  
  let results = materialMaster.map(mat => {
    const stock = stockData.find(s => s.materialNumber === mat.materialNumber);
    const sensitivity = weatherSensitivity[mat.materialGroup] || {};
    return {
      ...mat,
      stockInfo: stock || null,
      weatherSensitivity: sensitivity
    };
  });

  if (materialGroup) {
    results = results.filter(m => m.materialGroup === materialGroup);
  }
  if (plant) {
    results = results.filter(m => m.plant === plant);
  }
  if (searchTerm) {
    results = results.filter(m => 
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.materialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  res.json({
    success: true,
    sapFunction: 'BAPI_MATERIAL_GETLIST',
    timestamp: new Date().toISOString(),
    count: results.length,
    data: results
  });
});

// BAPI_MATERIAL_GET_DETAIL - Get Single Material Detail
router.get('/materials/:materialNumber', (req, res) => {
  const material = materialMaster.find(m => m.materialNumber === req.params.materialNumber);
  
  if (!material) {
    return res.status(404).json({ 
      success: false, 
      error: 'Material not found',
      sapMessage: 'E: Material does not exist'
    });
  }

  const stock = stockData.find(s => s.materialNumber === material.materialNumber);
  const sensitivity = weatherSensitivity[material.materialGroup] || {};
  const relatedPOs = purchaseOrders.filter(po => po.materialNumber === material.materialNumber);
  const relatedSOs = salesOrders.filter(so => so.materialNumber === material.materialNumber);
  const movements = movementHistory.filter(m => m.materialNumber === material.materialNumber);

  res.json({
    success: true,
    sapFunction: 'BAPI_MATERIAL_GET_DETAIL',
    timestamp: new Date().toISOString(),
    data: {
      material,
      stock,
      weatherSensitivity: sensitivity,
      purchaseOrders: relatedPOs,
      salesOrders: relatedSOs,
      recentMovements: movements.slice(-10)
    }
  });
});

// MB52 - Warehouse Stock Overview
router.get('/stock', (req, res) => {
  const { plant, storageLocation, belowSafetyStock } = req.query;
  
  let results = stockData.map(stock => {
    const material = materialMaster.find(m => m.materialNumber === stock.materialNumber);
    const totalStock = stock.unrestrictedStock + stock.qualityInspection + stock.inTransit;
    const stockStatus = stock.unrestrictedStock <= stock.safetyStock ? 'CRITICAL' :
                       stock.unrestrictedStock <= stock.reorderPoint ? 'LOW' : 'OK';
    
    return {
      ...stock,
      materialDescription: material?.description,
      materialGroup: material?.materialGroup,
      totalStock,
      availableStock: stock.unrestrictedStock,
      stockStatus,
      coverageDays: Math.round(stock.unrestrictedStock / (stock.safetyStock / 30)), // Rough estimate
      weatherSensitivity: weatherSensitivity[material?.materialGroup] || null
    };
  });

  if (plant) {
    results = results.filter(s => s.plant === plant);
  }
  if (storageLocation) {
    results = results.filter(s => s.storageLocation === storageLocation);
  }
  if (belowSafetyStock === 'true') {
    results = results.filter(s => s.unrestrictedStock <= s.safetyStock);
  }

  // Summary statistics
  const summary = {
    totalMaterials: results.length,
    criticalItems: results.filter(r => r.stockStatus === 'CRITICAL').length,
    lowStockItems: results.filter(r => r.stockStatus === 'LOW').length,
    okItems: results.filter(r => r.stockStatus === 'OK').length,
    totalStockValue: results.reduce((sum, r) => sum + r.totalStock, 0),
    weatherSensitiveItems: results.filter(r => r.weatherSensitivity?.humiditySensitive || r.weatherSensitivity?.tempSensitive).length
  };

  res.json({
    success: true,
    sapTransaction: 'MB52',
    timestamp: new Date().toISOString(),
    summary,
    data: results
  });
});

// ME2M - Purchase Orders by Material
router.get('/purchase-orders', (req, res) => {
  const { materialNumber, status, vendor } = req.query;
  
  let results = [...purchaseOrders];

  if (materialNumber) {
    results = results.filter(po => po.materialNumber === materialNumber);
  }
  if (status) {
    results = results.filter(po => po.status === status);
  }
  if (vendor) {
    results = results.filter(po => po.vendor === vendor);
  }

  res.json({
    success: true,
    sapTransaction: 'ME2M',
    timestamp: new Date().toISOString(),
    count: results.length,
    data: results
  });
});

// VA05 - Sales Orders List
router.get('/sales-orders', (req, res) => {
  const { materialNumber, customer, status } = req.query;
  
  let results = [...salesOrders];

  if (materialNumber) {
    results = results.filter(so => so.materialNumber === materialNumber);
  }
  if (customer) {
    results = results.filter(so => so.customer === customer);
  }
  if (status) {
    results = results.filter(so => so.status === status);
  }

  // Calculate demand summary
  const demandByMaterial = {};
  results.forEach(so => {
    if (!demandByMaterial[so.materialNumber]) {
      demandByMaterial[so.materialNumber] = { totalDemand: 0, orderCount: 0 };
    }
    demandByMaterial[so.materialNumber].totalDemand += so.quantity;
    demandByMaterial[so.materialNumber].orderCount++;
  });

  res.json({
    success: true,
    sapTransaction: 'VA05',
    timestamp: new Date().toISOString(),
    count: results.length,
    demandSummary: demandByMaterial,
    data: results
  });
});

// MB51 - Material Document List (Movement History)
router.get('/movements', (req, res) => {
  const { materialNumber, movementType, dateFrom } = req.query;
  
  let results = [...movementHistory];

  if (materialNumber) {
    results = results.filter(m => m.materialNumber === materialNumber);
  }
  if (movementType) {
    results = results.filter(m => m.movementType === movementType);
  }

  res.json({
    success: true,
    sapTransaction: 'MB51',
    timestamp: new Date().toISOString(),
    count: results.length,
    data: results
  });
});

// Plant and Storage Location Configuration
router.get('/config/plants', (req, res) => {
  res.json({
    success: true,
    data: { plants, storageLocations }
  });
});

// MRP Analysis - Custom endpoint for AI integration
router.get('/mrp-analysis', (req, res) => {
  const analysis = stockData.map(stock => {
    const material = materialMaster.find(m => m.materialNumber === stock.materialNumber);
    const openPOs = purchaseOrders.filter(po => po.materialNumber === stock.materialNumber && po.status !== 'DELIVERED');
    const openSOs = salesOrders.filter(so => so.materialNumber === stock.materialNumber && so.status !== 'DELIVERED');
    
    const incomingQty = openPOs.reduce((sum, po) => sum + po.quantity, 0);
    const demandQty = openSOs.reduce((sum, so) => sum + so.quantity, 0);
    const projectedStock = stock.unrestrictedStock + incomingQty - demandQty;
    
    const sensitivity = weatherSensitivity[material?.materialGroup] || {};
    
    return {
      materialNumber: stock.materialNumber,
      description: material?.description,
      materialGroup: material?.materialGroup,
      currentStock: stock.unrestrictedStock,
      safetyStock: stock.safetyStock,
      reorderPoint: stock.reorderPoint,
      incomingSupply: incomingQty,
      openDemand: demandQty,
      projectedStock,
      stockCoverage: projectedStock > 0 ? Math.round(projectedStock / (stock.safetyStock / 30)) : 0,
      requiresAction: projectedStock < stock.safetyStock,
      weatherSensitive: sensitivity.humiditySensitive || sensitivity.tempSensitive,
      weatherConstraints: sensitivity,
      riskLevel: projectedStock < 0 ? 'CRITICAL' : 
                 projectedStock < stock.safetyStock ? 'HIGH' :
                 projectedStock < stock.reorderPoint ? 'MEDIUM' : 'LOW'
    };
  });

  const criticalItems = analysis.filter(a => a.riskLevel === 'CRITICAL' || a.riskLevel === 'HIGH');

  res.json({
    success: true,
    sapFunction: 'MD04_ANALYSIS',
    timestamp: new Date().toISOString(),
    summary: {
      totalMaterials: analysis.length,
      criticalRisk: analysis.filter(a => a.riskLevel === 'CRITICAL').length,
      highRisk: analysis.filter(a => a.riskLevel === 'HIGH').length,
      mediumRisk: analysis.filter(a => a.riskLevel === 'MEDIUM').length,
      lowRisk: analysis.filter(a => a.riskLevel === 'LOW').length,
      weatherSensitiveCount: analysis.filter(a => a.weatherSensitive).length
    },
    criticalItems,
    data: analysis
  });
});

// Goods Movement - Simulate stock changes
router.post('/goods-movement', (req, res) => {
  const { materialNumber, movementType, quantity, storageLocation } = req.body;
  
  const stockIndex = stockData.findIndex(s => s.materialNumber === materialNumber);
  if (stockIndex === -1) {
    return res.status(404).json({ success: false, error: 'Material not found' });
  }

  // Movement types: 101=GR, 201=GI, 301=Transfer, 601=Delivery
  switch (movementType) {
    case '101': // Goods Receipt
      stockData[stockIndex].unrestrictedStock += quantity;
      break;
    case '201': // Goods Issue
    case '601': // Delivery
      stockData[stockIndex].unrestrictedStock -= quantity;
      break;
  }

  // Add to movement history
  movementHistory.push({
    documentNumber: `500000${Date.now().toString().slice(-4)}`,
    movementType,
    materialNumber,
    quantity: movementType === '101' ? quantity : -quantity,
    postingDate: new Date().toISOString().split('T')[0],
    plant: '1000',
    storageLocation: storageLocation || stockData[stockIndex].storageLocation,
    description: `Movement Type ${movementType}`
  });

  res.json({
    success: true,
    message: 'Goods movement posted',
    newStock: stockData[stockIndex].unrestrictedStock
  });
});

// Simulation endpoint - Simulate real-time stock consumption
let simulationRunning = false;
router.post('/simulate/start', (req, res) => {
  if (simulationRunning) {
    return res.json({ success: false, message: 'Simulation already running' });
  }
  
  simulationRunning = true;
  
  // Simulate random stock consumption every 10 seconds
  const simulationInterval = setInterval(() => {
    if (!simulationRunning) {
      clearInterval(simulationInterval);
      return;
    }
    
    // Random material consumption
    const randomIndex = Math.floor(Math.random() * stockData.length);
    const consumptionRate = Math.floor(Math.random() * 2000) + 500; // 500-2500 units
    
    if (stockData[randomIndex].unrestrictedStock > consumptionRate) {
      stockData[randomIndex].unrestrictedStock -= consumptionRate;
      console.log(`[Simulation] ${stockData[randomIndex].materialNumber}: -${consumptionRate} units`);
    }
  }, 10000);
  
  res.json({ success: true, message: 'Stock simulation started' });
});

router.post('/simulate/stop', (req, res) => {
  simulationRunning = false;
  res.json({ success: true, message: 'Stock simulation stopped' });
});

router.post('/simulate/reset', (req, res) => {
  // Reset stock to original levels
  stockData[0].unrestrictedStock = 125000;
  stockData[1].unrestrictedStock = 45000;
  stockData[2].unrestrictedStock = 18000;
  stockData[3].unrestrictedStock = 8500;
  stockData[4].unrestrictedStock = 32000;
  stockData[5].unrestrictedStock = 55000;
  stockData[6].unrestrictedStock = 12000;
  stockData[7].unrestrictedStock = 78000;
  stockData[8].unrestrictedStock = 4500;
  stockData[9].unrestrictedStock = 15000;
  stockData[10].unrestrictedStock = 2800;
  stockData[11].unrestrictedStock = 6500;
  stockData[12].unrestrictedStock = 3200;
  stockData[13].unrestrictedStock = 1800;
  stockData[14].unrestrictedStock = 4500;
  stockData[15].unrestrictedStock = 2200;
  
  res.json({ success: true, message: 'Stock levels reset' });
});

module.exports = router;
