// Dynamic Column Mapping Configuration
// Supports multiple SAP systems and custom CSV formats

module.exports = {
  // Standard field mappings with multiple possible column names
  fieldMappings: {
    materialNumber: [
      'Material Number', 'MaterialNumber', 'material_number', 'Material', 
      'Item Code', 'ItemCode', 'item_code', 'SKU', 'sku',
      'Part Number', 'PartNumber', 'part_number', 'Product Code'
    ],
    description: [
      'Description', 'MaterialDescription', 'description', 'Name', 
      'Item Name', 'ItemName', 'item_name', 'Product Name', 'ProductName',
      'Material Description', 'Product Description'
    ],
    materialGroup: [
      'Material Group', 'MaterialGroup', 'material_group', 'Category',
      'Item Group', 'ItemGroup', 'item_group', 'Product Category',
      'Type', 'Classification'
    ],
    plant: [
      'Plant', 'plant', 'Site', 'site', 'Location', 'location',
      'Facility', 'facility', 'Plant Code'
    ],
    storageLocation: [
      'Storage Location', 'StorageLocation', 'storage_location', 'Warehouse',
      'warehouse', 'Storage', 'Bin', 'bin', 'Sloc', 'WH'
    ],
    currentStock: [
      'Current Stock', 'CurrentStock', 'current_stock', 'Stock', 'stock',
      'Quantity', 'quantity', 'Qty', 'qty', 'On Hand', 'OnHand', 'on_hand',
      'Available Stock', 'AvailableStock', 'Unrestricted Stock', 'UnrestrictedStock'
    ],
    safetyStock: [
      'Safety Stock', 'SafetyStock', 'safety_stock', 'Min Stock', 'MinStock',
      'Minimum Stock', 'MinimumStock', 'Buffer Stock', 'BufferStock'
    ],
    reorderPoint: [
      'Reorder Point', 'ReorderPoint', 'reorder_point', 'ROP', 'rop',
      'Reorder Level', 'ReorderLevel', 'Min Level', 'MinLevel'
    ],
    unitOfMeasure: [
      'Unit', 'unit', 'UOM', 'uom', 'Unit of Measure', 'UnitOfMeasure',
      'Base Unit', 'BaseUnit', 'Measurement Unit'
    ],
    price: [
      'Price', 'price', 'Unit Price', 'UnitPrice', 'unit_price',
      'Cost', 'cost', 'Standard Price', 'StandardPrice'
    ],
    supplier: [
      'Supplier', 'supplier', 'Vendor', 'vendor', 'Vendor Name', 'VendorName',
      'Supplier Name', 'SupplierName'
    ],
    leadTime: [
      'Lead Time', 'LeadTime', 'lead_time', 'Delivery Time', 'DeliveryTime',
      'Lead Time Days', 'LeadTimeDays'
    ]
  },

  // Weather sensitivity mappings
  weatherMappings: {
    humiditySensitive: [
      'Humidity Sensitive', 'HumiditySensitive', 'humidity_sensitive',
      'Moisture Sensitive', 'MoistureSensitive'
    ],
    tempSensitive: [
      'Temperature Sensitive', 'TemperatureSensitive', 'temp_sensitive',
      'Temp Sensitive', 'TempSensitive'
    ],
    maxHumidity: [
      'Max Humidity', 'MaxHumidity', 'max_humidity',
      'Maximum Humidity', 'MaximumHumidity'
    ],
    optimalTempMin: [
      'Optimal Temp Min', 'OptimalTempMin', 'optimal_temp_min',
      'Min Temperature', 'MinTemperature', 'Temp Min'
    ],
    optimalTempMax: [
      'Optimal Temp Max', 'OptimalTempMax', 'optimal_temp_max',
      'Max Temperature', 'MaxTemperature', 'Temp Max'
    ]
  },

  // SAP System Presets
  sapPresets: {
    'SAP S/4HANA': {
      materialNumber: 'Material',
      description: 'MaterialDescription',
      materialGroup: 'MaterialGroup',
      plant: 'Plant',
      storageLocation: 'StorageLocation',
      currentStock: 'MatlWrhsStkQtyInMatlBaseUnit',
      safetyStock: 'SafetyStock',
      unitOfMeasure: 'MaterialBaseUnit'
    },
    'SAP ECC': {
      materialNumber: 'MATNR',
      description: 'MAKTX',
      materialGroup: 'MATKL',
      plant: 'WERKS',
      storageLocation: 'LGORT',
      currentStock: 'LABST',
      safetyStock: 'EISBE',
      unitOfMeasure: 'MEINS'
    },
    'SAP Business One': {
      materialNumber: 'ItemCode',
      description: 'ItemName',
      materialGroup: 'ItemGroup',
      plant: 'Warehouse',
      currentStock: 'OnHand',
      safetyStock: 'MinLevel',
      unitOfMeasure: 'UOM'
    },
    'ERPNext': {
      materialNumber: 'item_code',
      description: 'item_name',
      materialGroup: 'item_group',
      plant: 'warehouse',
      currentStock: 'actual_qty',
      safetyStock: 'safety_stock',
      unitOfMeasure: 'stock_uom'
    },
    'Odoo': {
      materialNumber: 'default_code',
      description: 'name',
      materialGroup: 'categ_id',
      plant: 'warehouse_id',
      currentStock: 'qty_available',
      safetyStock: 'reordering_min_qty',
      unitOfMeasure: 'uom_id'
    },
    'Custom/Generic': {
      // Will auto-detect from CSV headers
      autoDetect: true
    }
  },

  // Find matching field from CSV headers
  findField(headers, fieldMappings) {
    for (const possibleName of fieldMappings) {
      const found = headers.find(h => 
        h.toLowerCase().trim() === possibleName.toLowerCase().trim()
      );
      if (found) return found;
    }
    return null;
  },

  // Auto-detect column mapping from CSV headers
  autoDetectMapping(headers) {
    const mapping = {};
    
    // Map standard fields
    for (const [field, possibleNames] of Object.entries(this.fieldMappings)) {
      const found = this.findField(headers, possibleNames);
      if (found) mapping[field] = found;
    }
    
    // Map weather fields
    for (const [field, possibleNames] of Object.entries(this.weatherMappings)) {
      const found = this.findField(headers, possibleNames);
      if (found) mapping[field] = found;
    }
    
    // Store unmapped columns as custom fields
    mapping.customFields = headers.filter(h => 
      !Object.values(mapping).includes(h)
    );
    
    return mapping;
  },

  // Get preset mapping for specific SAP system
  getPresetMapping(systemName) {
    return this.sapPresets[systemName] || this.sapPresets['Custom/Generic'];
  },

  // Get all available SAP system presets
  getAvailablePresets() {
    return Object.keys(this.sapPresets);
  }
};
