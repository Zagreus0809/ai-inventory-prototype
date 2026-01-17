// SAP Mock Data for Company A Electronics
const companyMaterials = [
  {
    materialNumber: 'MAT-CAP-001',
    description: 'MLCC Capacitor 100nF 50V X7R',
    materialGroup: 'CAPACITORS',
    plant: '1000',
    storageLocation: 'WH01',
    unrestrictedStock: 45000,
    safetyStock: 10000,
    reorderPoint: 15000,
    avgDailyUsage: 500,
    leadTimeDays: 14,
    weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } }
  },
  {
    materialNumber: 'MAT-CAP-002',
    description: 'MLCC Capacitor 10uF 25V X5R',
    materialGroup: 'CAPACITORS',
    plant: '1000',
    storageLocation: 'WH01',
    unrestrictedStock: 32000,
    safetyStock: 8000,
    reorderPoint: 12000,
    avgDailyUsage: 400,
    leadTimeDays: 14,
    weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } }
  },
  {
    materialNumber: 'MAT-CAP-003',
    description: 'Aluminum Electrolytic 470uF 35V',
    materialGroup: 'CAPACITORS',
    plant: '1000',
    storageLocation: 'WH01',
    unrestrictedStock: 18000,
    safetyStock: 5000,
    reorderPoint: 8000,
    avgDailyUsage: 200,
    leadTimeDays: 21,
    weatherSensitivity: { humiditySensitive: true, maxHumidity: 60, tempSensitive: true, optimalTemp: { min: 10, max: 35 } }
  },
  {
    materialNumber: 'MAT-CAP-004',
    description: 'Tantalum Capacitor 100uF 16V',
    materialGroup: 'CAPACITORS',
    plant: '1000',
    storageLocation: 'WH02',
    unrestrictedStock: 4500,
    safetyStock: 5000,
    reorderPoint: 7000,
    avgDailyUsage: 150,
    leadTimeDays: 28,
    weatherSensitivity: { humiditySensitive: true, maxHumidity: 55, tempSensitive: true, optimalTemp: { min: 15, max: 25 } }
  },
  {
    materialNumber: 'MAT-IND-001',
    description: 'Power Inductor 10uH 3A SMD',
    materialGroup: 'INDUCTORS',
    plant: '1000',
    storageLocation: 'WH02',
    unrestrictedStock: 25000,
    safetyStock: 6000,
    reorderPoint: 10000,
    avgDailyUsage: 300,
    leadTimeDays: 14,
    weatherSensitivity: { humiditySensitive: false, tempSensitive: false }
  },
  {
    materialNumber: 'MAT-IND-002',
    description: 'Chip Inductor 4.7uH 1A 0805',
    materialGroup: 'INDUCTORS',
    plant: '1000',
    storageLocation: 'WH02',
    unrestrictedStock: 55000,
    safetyStock: 12000,
    reorderPoint: 18000,
    avgDailyUsage: 600,
    leadTimeDays: 10,
    weatherSensitivity: { humiditySensitive: false, tempSensitive: false }
  },
  {
    materialNumber: 'MAT-IND-003',
    description: 'Common Mode Choke 100uH',
    materialGroup: 'INDUCTORS',
    plant: '1000',
    storageLocation: 'WH02',
    unrestrictedStock: 8500,
    safetyStock: 8000,
    reorderPoint: 12000,
    avgDailyUsage: 250,
    leadTimeDays: 21,
    weatherSensitivity: { humiditySensitive: false, tempSensitive: false }
  },
  {
    materialNumber: 'MAT-SEN-001',
    description: 'Temperature Sensor NTC 10K',
    materialGroup: 'SENSORS',
    plant: '1000',
    storageLocation: 'WH03',
    unrestrictedStock: 15000,
    safetyStock: 3000,
    reorderPoint: 5000,
    avgDailyUsage: 150,
    leadTimeDays: 14,
    weatherSensitivity: { humiditySensitive: true, maxHumidity: 70, tempSensitive: true, optimalTemp: { min: 10, max: 30 } }
  },
  {
    materialNumber: 'MAT-SEN-002',
    description: 'Pressure Sensor MEMS 0-10bar',
    materialGroup: 'SENSORS',
    plant: '1000',
    storageLocation: 'WH03',
    unrestrictedStock: 1800,
    safetyStock: 2000,
    reorderPoint: 3000,
    avgDailyUsage: 80,
    leadTimeDays: 35,
    weatherSensitivity: { humiditySensitive: true, maxHumidity: 60, tempSensitive: true, optimalTemp: { min: 15, max: 25 } }
  },
  {
    materialNumber: 'MAT-FER-001',
    description: 'Ferrite Core EE25 N87',
    materialGroup: 'FERRITES',
    plant: '1000',
    storageLocation: 'WH04',
    unrestrictedStock: 22000,
    safetyStock: 5000,
    reorderPoint: 8000,
    avgDailyUsage: 200,
    leadTimeDays: 21,
    weatherSensitivity: { humiditySensitive: false, tempSensitive: false }
  },
  {
    materialNumber: 'MAT-FER-002',
    description: 'Ferrite Bead 600ohm 0603',
    materialGroup: 'FERRITES',
    plant: '1000',
    storageLocation: 'WH04',
    unrestrictedStock: 85000,
    safetyStock: 20000,
    reorderPoint: 30000,
    avgDailyUsage: 1000,
    leadTimeDays: 10,
    weatherSensitivity: { humiditySensitive: false, tempSensitive: false }
  },
  {
    materialNumber: 'MAT-TRF-001',
    description: 'Transformer Flyback 24V 1A',
    materialGroup: 'TRANSFORMERS',
    plant: '1000',
    storageLocation: 'WH04',
    unrestrictedStock: 6000,
    safetyStock: 1500,
    reorderPoint: 2500,
    avgDailyUsage: 50,
    leadTimeDays: 28,
    weatherSensitivity: { humiditySensitive: true, maxHumidity: 70, tempSensitive: false }
  },
  {
    materialNumber: 'MAT-TRF-002',
    description: 'Power Transformer 12V 2A',
    materialGroup: 'TRANSFORMERS',
    plant: '1000',
    storageLocation: 'WH04',
    unrestrictedStock: 1000,
    safetyStock: 1200,
    reorderPoint: 2000,
    avgDailyUsage: 40,
    leadTimeDays: 35,
    weatherSensitivity: { humiditySensitive: true, maxHumidity: 70, tempSensitive: false }
  },
  {
    materialNumber: 'MAT-FIL-001',
    description: 'EMI Filter 10A 250VAC',
    materialGroup: 'FILTERS',
    plant: '1000',
    storageLocation: 'WH05',
    unrestrictedStock: 4500,
    safetyStock: 1000,
    reorderPoint: 1800,
    avgDailyUsage: 30,
    leadTimeDays: 21,
    weatherSensitivity: { humiditySensitive: false, tempSensitive: false }
  },
  {
    materialNumber: 'MAT-PIE-001',
    description: 'Piezo Element 27mm 4kHz',
    materialGroup: 'PIEZO',
    plant: '1000',
    storageLocation: 'WH05',
    unrestrictedStock: 12000,
    safetyStock: 2500,
    reorderPoint: 4000,
    avgDailyUsage: 100,
    leadTimeDays: 14,
    weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 10, max: 35 } }
  },
  {
    materialNumber: 'MAT-PIE-002',
    description: 'Ultrasonic Sensor 40kHz',
    materialGroup: 'PIEZO',
    plant: '1000',
    storageLocation: 'WH05',
    unrestrictedStock: 7500,
    safetyStock: 1500,
    reorderPoint: 2500,
    avgDailyUsage: 60,
    leadTimeDays: 21,
    weatherSensitivity: { humiditySensitive: true, maxHumidity: 60, tempSensitive: true, optimalTemp: { min: 15, max: 30 } }
  }
];

const purchaseOrders = [
  { poNumber: '4500001234', vendor: 'Murata Manufacturing', materialNumber: 'MAT-CAP-001', quantity: 50000, deliveryDate: '2026-01-20', status: 'CONFIRMED' },
  { poNumber: '4500001235', vendor: 'Nichicon Corp', materialNumber: 'MAT-CAP-003', quantity: 20000, deliveryDate: '2026-01-25', status: 'IN_TRANSIT' },
  { poNumber: '4500001236', vendor: 'Vishay', materialNumber: 'MAT-CAP-004', quantity: 15000, deliveryDate: '2026-02-01', status: 'CONFIRMED' },
  { poNumber: '4500001237', vendor: 'Supplier A', materialNumber: 'MAT-IND-001', quantity: 30000, deliveryDate: '2026-01-18', status: 'IN_TRANSIT' },
  { poNumber: '4500001238', vendor: 'Supplier A', materialNumber: 'MAT-SEN-002', quantity: 5000, deliveryDate: '2026-02-10', status: 'CONFIRMED' }
];

const salesOrders = [
  { soNumber: '0030001001', customer: 'Samsung Electronics', materialNumber: 'MAT-CAP-001', quantity: 25000, requestedDate: '2026-01-15', status: 'OPEN' },
  { soNumber: '0030001002', customer: 'Apple Inc', materialNumber: 'MAT-CAP-002', quantity: 15000, requestedDate: '2026-01-18', status: 'OPEN' },
  { soNumber: '0030001003', customer: 'Bosch', materialNumber: 'MAT-SEN-001', quantity: 8000, requestedDate: '2026-01-20', status: 'OPEN' },
  { soNumber: '0030001004', customer: 'Siemens', materialNumber: 'MAT-TRF-001', quantity: 2000, requestedDate: '2026-01-22', status: 'OPEN' },
  { soNumber: '0030001005', customer: 'LG Electronics', materialNumber: 'MAT-IND-002', quantity: 30000, requestedDate: '2026-01-25', status: 'OPEN' }
];

function getStockStatus(current, safety, reorder) {
  if (current <= safety) return 'CRITICAL';
  if (current <= reorder) return 'LOW';
  return 'OK';
}

function calculateMRP() {
  return companyMaterials.map(m => {
    const incomingSupply = purchaseOrders
      .filter(po => po.materialNumber === m.materialNumber)
      .reduce((sum, po) => sum + po.quantity, 0);
    const openDemand = salesOrders
      .filter(so => so.materialNumber === m.materialNumber)
      .reduce((sum, so) => sum + so.quantity, 0);
    const projectedStock = m.unrestrictedStock + incomingSupply - openDemand;
    
    let riskLevel = 'LOW';
    if (projectedStock < 0) riskLevel = 'CRITICAL';
    else if (projectedStock < m.safetyStock) riskLevel = 'HIGH';
    else if (projectedStock < m.reorderPoint) riskLevel = 'MEDIUM';

    return {
      materialNumber: m.materialNumber,
      description: m.description,
      currentStock: m.unrestrictedStock,
      safetyStock: m.safetyStock,
      incomingSupply,
      openDemand,
      projectedStock,
      riskLevel,
      weatherSensitive: m.weatherSensitivity?.humiditySensitive || false
    };
  });
}

module.exports = { companyMaterials, purchaseOrders, salesOrders, getStockStatus, calculateMRP };


