// SAP Mock Data for Company A - Real Material List
const companyMaterials = [
  { materialNumber: 'XNM-AR-00007', description: '2HSEW-S 0.07 COPPER WIRE', materialGroup: 'RAW_MATERIALS', plant: '1000', storageLocation: 'WH01', unrestrictedStock: 150, safetyStock: 50, reorderPoint: 80, avgDailyUsage: 5, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01873', description: 'PCB S20_No buffing', materialGroup: 'PCB_BOARDS', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 320, safetyStock: 100, reorderPoint: 150, avgDailyUsage: 10, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } } },
  { materialNumber: 'XNM-AU-00900', description: 'FR-4/0.5mm THICK BOARD(PCB)', materialGroup: 'PCB_BOARDS', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 450, safetyStock: 120, reorderPoint: 180, avgDailyUsage: 12, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } } },
  { materialNumber: 'XNM-AU-00224', description: 'BMS Case Cover 12x12x74mm', materialGroup: 'ENCLOSURES', plant: '1000', storageLocation: 'WH03', unrestrictedStock: 580, safetyStock: 150, reorderPoint: 220, avgDailyUsage: 15, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01627', description: 'BMS Case Base 12X12mm Rev.3', materialGroup: 'ENCLOSURES', plant: '1000', storageLocation: 'WH03', unrestrictedStock: 620, safetyStock: 160, reorderPoint: 240, avgDailyUsage: 16, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01628', description: 'BMS Case Cover 12X12mm Rev.3', materialGroup: 'ENCLOSURES', plant: '1000', storageLocation: 'WH03', unrestrictedStock: 680, safetyStock: 170, reorderPoint: 260, avgDailyUsage: 17, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01943', description: 'Nivio Case Base ∅5', materialGroup: 'ENCLOSURES', plant: '1000', storageLocation: 'WH03', unrestrictedStock: 720, safetyStock: 180, reorderPoint: 280, avgDailyUsage: 18, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01944', description: 'Nivio Case Cover ∅5', materialGroup: 'ENCLOSURES', plant: '1000', storageLocation: 'WH03', unrestrictedStock: 800, safetyStock: 200, reorderPoint: 300, avgDailyUsage: 20, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01464', description: 'Nivio Bobbin (Groove)', materialGroup: 'COMPONENTS', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 960, safetyStock: 240, reorderPoint: 360, avgDailyUsage: 24, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AB-00005', description: 'Molding Resin Dowsil SE1816CV A', materialGroup: 'CHEMICALS', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 1120, safetyStock: 280, reorderPoint: 420, avgDailyUsage: 28, leadTimeDays: 28, weatherSensitivity: { humiditySensitive: true, maxHumidity: 60, tempSensitive: true, optimalTemp: { min: 10, max: 25 } } },
  { materialNumber: 'XNM-AB-00006', description: 'Molding Resin Dowsil SE1816CV B', materialGroup: 'CHEMICALS', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 1200, safetyStock: 300, reorderPoint: 450, avgDailyUsage: 30, leadTimeDays: 28, weatherSensitivity: { humiditySensitive: true, maxHumidity: 60, tempSensitive: true, optimalTemp: { min: 10, max: 25 } } },
  { materialNumber: 'XNM-AA-00004', description: 'UV resin U-422', materialGroup: 'CHEMICALS', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 1360, safetyStock: 340, reorderPoint: 510, avgDailyUsage: 34, leadTimeDays: 28, weatherSensitivity: { humiditySensitive: true, maxHumidity: 60, tempSensitive: true, optimalTemp: { min: 10, max: 25 } } },
  { materialNumber: 'XNM-AA-00006', description: 'Tempo casing', materialGroup: 'ENCLOSURES', plant: '1000', storageLocation: 'WH03', unrestrictedStock: 1440, safetyStock: 360, reorderPoint: 540, avgDailyUsage: 36, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AA-00013', description: 'Linqbond LE-4422/1KC', materialGroup: 'CHEMICALS', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 1520, safetyStock: 380, reorderPoint: 570, avgDailyUsage: 38, leadTimeDays: 28, weatherSensitivity: { humiditySensitive: true, maxHumidity: 60, tempSensitive: true, optimalTemp: { min: 10, max: 25 } } },
  { materialNumber: 'XNM-AU-02314', description: 'PC BOARD 20251104-MIG240501-3.2', materialGroup: 'PCB_BOARDS', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 1680, safetyStock: 420, reorderPoint: 630, avgDailyUsage: 42, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } } },
  { materialNumber: 'XNM-AU-01665', description: 'PCB MIG240501_3.1_2 Out coil', materialGroup: 'PCB_BOARDS', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 1760, safetyStock: 440, reorderPoint: 660, avgDailyUsage: 44, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } } },
  { materialNumber: 'XNM-AU-01664', description: 'PCB MIG240501_4.1 Thin Film', materialGroup: 'PCB_BOARDS', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 1840, safetyStock: 460, reorderPoint: 690, avgDailyUsage: 46, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } } },
  { materialNumber: 'XNM-AU-01663', description: 'PCB MIG240501_5.1', materialGroup: 'PCB_BOARDS', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 1920, safetyStock: 480, reorderPoint: 720, avgDailyUsage: 48, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } } },
  { materialNumber: 'XNM-AU-01909', description: 'PCB M1SP4P24A_00 1.2mm', materialGroup: 'PCB_BOARDS', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 2080, safetyStock: 520, reorderPoint: 780, avgDailyUsage: 52, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } } },
  { materialNumber: 'XNM-AU-01910', description: 'PCB M1SPDP24C_00 1.2mm', materialGroup: 'PCB_BOARDS', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 2160, safetyStock: 540, reorderPoint: 810, avgDailyUsage: 54, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } } },
  { materialNumber: 'XNM-AU-02313', description: 'PCB M1SPOC25B 9.5x9.5mm', materialGroup: 'PCB_BOARDS', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 2240, safetyStock: 560, reorderPoint: 840, avgDailyUsage: 56, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } } },
  { materialNumber: 'XNM-AU-02312', description: 'PCB M1SPTF25B 9.5x9.5mm', materialGroup: 'PCB_BOARDS', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 2480, safetyStock: 620, reorderPoint: 930, avgDailyUsage: 62, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } } },
  { materialNumber: 'XNM-AU-01940', description: 'PCB M1SPPE251', materialGroup: 'PCB_BOARDS', plant: '1000', storageLocation: 'WH02', unrestrictedStock: 3040, safetyStock: 760, reorderPoint: 1140, avgDailyUsage: 76, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 65, tempSensitive: true, optimalTemp: { min: 15, max: 30 } } },
  { materialNumber: 'XNM-AU-01783', description: 'Migne Bobbin longer pin 1.3mm', materialGroup: 'COMPONENTS', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 3120, safetyStock: 780, reorderPoint: 1170, avgDailyUsage: 78, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01579', description: 'ORP-30F 32AWGX3P Cable', materialGroup: 'CABLES', plant: '1000', storageLocation: 'WH06', unrestrictedStock: 3200, safetyStock: 800, reorderPoint: 1200, avgDailyUsage: 80, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01913', description: 'NSH Cable 1500MM M1SC15251', materialGroup: 'CABLES', plant: '1000', storageLocation: 'WH06', unrestrictedStock: 3280, safetyStock: 820, reorderPoint: 1230, avgDailyUsage: 82, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01573', description: 'BC030-06-A Pin Header 6w 1.0mm', materialGroup: 'CONNECTORS', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 3360, safetyStock: 840, reorderPoint: 1260, avgDailyUsage: 84, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01799', description: 'PIN HEADER PIN 2.0', materialGroup: 'CONNECTORS', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 3440, safetyStock: 860, reorderPoint: 1290, avgDailyUsage: 86, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-02271', description: 'MIGNE CASE 2.0 M1SHM425A rev.1', materialGroup: 'ENCLOSURES', plant: '1000', storageLocation: 'WH03', unrestrictedStock: 3520, safetyStock: 880, reorderPoint: 1320, avgDailyUsage: 88, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-02277', description: 'M1SHHC25A HORIZONTAL CASE', materialGroup: 'ENCLOSURES', plant: '1000', storageLocation: 'WH03', unrestrictedStock: 3600, safetyStock: 900, reorderPoint: 1350, avgDailyUsage: 90, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-02278', description: 'M1SHVC25A VERTICAL CASE', materialGroup: 'ENCLOSURES', plant: '1000', storageLocation: 'WH03', unrestrictedStock: 3680, safetyStock: 920, reorderPoint: 1380, avgDailyUsage: 92, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01429', description: 'Ferrite HR5-7 Mn-Zn Block 54x54x14', materialGroup: 'FERRITES', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 3920, safetyStock: 980, reorderPoint: 1470, avgDailyUsage: 98, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-00160', description: 'Solder ball 150μm', materialGroup: 'SOLDER', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 4240, safetyStock: 1060, reorderPoint: 1590, avgDailyUsage: 106, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 60, tempSensitive: true, optimalTemp: { min: 15, max: 25 } } },
  { materialNumber: 'XNM-AU-01368', description: '6-pin Nano-Fit Female Connector', materialGroup: 'CONNECTORS', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 4320, safetyStock: 1080, reorderPoint: 1620, avgDailyUsage: 108, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01321', description: '8-pin NANO-FIT FEMALE CONNECTOR', materialGroup: 'CONNECTORS', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 4400, safetyStock: 1100, reorderPoint: 1650, avgDailyUsage: 110, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01323', description: 'NANO-FIT CRIMP TERMINAL 24AWG', materialGroup: 'CONNECTORS', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 4480, safetyStock: 1120, reorderPoint: 1680, avgDailyUsage: 112, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-BL-00004', description: 'Heat Shrink Tubing 3.2mm', materialGroup: 'CABLES', plant: '1000', storageLocation: 'WH06', unrestrictedStock: 4560, safetyStock: 1140, reorderPoint: 1710, avgDailyUsage: 114, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-BL-00021', description: 'SHRINKABLE TUBE CD-12024-10', materialGroup: 'CABLES', plant: '1000', storageLocation: 'WH06', unrestrictedStock: 4720, safetyStock: 1180, reorderPoint: 1770, avgDailyUsage: 118, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-00350', description: 'Sumitube F2(Z) 7X0.25 x 50m', materialGroup: 'CABLES', plant: '1000', storageLocation: 'WH06', unrestrictedStock: 4800, safetyStock: 1200, reorderPoint: 1800, avgDailyUsage: 120, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-00330', description: 'Sumitube F2(Z)1x0.2-200 Small', materialGroup: 'CABLES', plant: '1000', storageLocation: 'WH06', unrestrictedStock: 4880, safetyStock: 1220, reorderPoint: 1830, avgDailyUsage: 122, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-01869', description: 'RMA98 SUPER P3 M705 D0.3 250G', materialGroup: 'SOLDER', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 5040, safetyStock: 1260, reorderPoint: 1890, avgDailyUsage: 126, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 60, tempSensitive: true, optimalTemp: { min: 15, max: 25 } } },
  { materialNumber: 'XNM-AB-00019', description: 'ECO SOLDER PASTE SHF M705', materialGroup: 'SOLDER', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 5120, safetyStock: 1280, reorderPoint: 1920, avgDailyUsage: 128, leadTimeDays: 21, weatherSensitivity: { humiditySensitive: true, maxHumidity: 60, tempSensitive: true, optimalTemp: { min: 15, max: 25 } } },
  { materialNumber: 'XNM-AB-001', description: 'Ambercut 389W', materialGroup: 'CHEMICALS', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 5280, safetyStock: 1320, reorderPoint: 1980, avgDailyUsage: 132, leadTimeDays: 28, weatherSensitivity: { humiditySensitive: true, maxHumidity: 60, tempSensitive: true, optimalTemp: { min: 10, max: 25 } } },
  { materialNumber: 'XNM-AB-00010', description: 'Mann Ease Release 200', materialGroup: 'CHEMICALS', plant: '1000', storageLocation: 'WH05', unrestrictedStock: 5760, safetyStock: 1440, reorderPoint: 2160, avgDailyUsage: 144, leadTimeDays: 28, weatherSensitivity: { humiditySensitive: true, maxHumidity: 60, tempSensitive: true, optimalTemp: { min: 10, max: 25 } } },
  { materialNumber: 'XNM-AU-02256', description: 'ESD Soft Tip Tweezer P-643-J', materialGroup: 'TOOLS', plant: '1000', storageLocation: 'WH07', unrestrictedStock: 128, safetyStock: 32, reorderPoint: 48, avgDailyUsage: 3, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-02257', description: 'SPRING UR3-15', materialGroup: 'COMPONENTS', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 784, safetyStock: 196, reorderPoint: 294, avgDailyUsage: 20, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-02258', description: 'SPRING UR5-15', materialGroup: 'COMPONENTS', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 544, safetyStock: 136, reorderPoint: 204, avgDailyUsage: 14, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-02259', description: 'SPRING UV8-25', materialGroup: 'COMPONENTS', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 800, safetyStock: 200, reorderPoint: 300, avgDailyUsage: 20, leadTimeDays: 14, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } },
  { materialNumber: 'XNM-AU-02043', description: '470kΩ Metal Film Resistor 0.25W', materialGroup: 'RESISTORS', plant: '1000', storageLocation: 'WH04', unrestrictedStock: 800, safetyStock: 200, reorderPoint: 300, avgDailyUsage: 20, leadTimeDays: 10, weatherSensitivity: { humiditySensitive: false, tempSensitive: false } }
];

const purchaseOrders = [
  { poNumber: '4500001234', vendor: 'Supplier A', materialNumber: 'XNM-AU-01873', quantity: 500, deliveryDate: '2026-01-20', status: 'CONFIRMED' },
  { poNumber: '4500001235', vendor: 'Supplier B', materialNumber: 'XNM-AU-00900', quantity: 600, deliveryDate: '2026-01-25', status: 'IN_TRANSIT' },
  { poNumber: '4500001236', vendor: 'Supplier C', materialNumber: 'XNM-AB-00005', quantity: 400, deliveryDate: '2026-02-01', status: 'CONFIRMED' },
  { poNumber: '4500001237', vendor: 'Supplier A', materialNumber: 'XNM-AU-01909', quantity: 800, deliveryDate: '2026-01-18', status: 'IN_TRANSIT' },
  { poNumber: '4500001238', vendor: 'Supplier D', materialNumber: 'XNM-AU-01368', quantity: 1000, deliveryDate: '2026-02-10', status: 'CONFIRMED' }
];

const salesOrders = [
  { soNumber: '0030001001', customer: 'Customer A', materialNumber: 'XNM-AU-01873', quantity: 250, requestedDate: '2026-01-15', status: 'OPEN' },
  { soNumber: '0030001002', customer: 'Customer B', materialNumber: 'XNM-AU-00900', quantity: 300, requestedDate: '2026-01-18', status: 'OPEN' },
  { soNumber: '0030001003', customer: 'Customer C', materialNumber: 'XNM-AU-01909', quantity: 400, requestedDate: '2026-01-20', status: 'OPEN' },
  { soNumber: '0030001004', customer: 'Customer D', materialNumber: 'XNM-AU-01368', quantity: 500, requestedDate: '2026-01-22', status: 'OPEN' },
  { soNumber: '0030001005', customer: 'Customer E', materialNumber: 'XNM-AU-02313', quantity: 600, requestedDate: '2026-01-25', status: 'OPEN' }
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
