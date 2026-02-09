const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const columnMappings = require('../config/column-mappings');
const router = express.Router();

// Configure multer for file upload
// Use /tmp for Vercel serverless, uploads/ for local
const uploadDir = process.env.VERCEL ? '/tmp' : 'uploads';

// Ensure upload directory exists (only for local)
if (!process.env.VERCEL && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ 
  dest: uploadDir,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  }
});

// Import CSV endpoint with auto-detection
router.post('/import', upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      error: 'No file uploaded' 
    });
  }

  const results = [];
  const errors = [];
  let rowNumber = 0;
  let detectedMapping = null;
  let headers = [];

  try {
    // First pass: detect headers and mapping
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('headers', (csvHeaders) => {
          headers = csvHeaders;
          // Auto-detect column mapping
          detectedMapping = columnMappings.autoDetectMapping(headers);
          console.log('[CSV Import] Detected columns:', headers);
          console.log('[CSV Import] Detected mapping:', detectedMapping);
        })
        .on('data', (data) => {
          rowNumber++;
          try {
            // Validate and transform data using detected mapping
            const material = validateAndTransformMaterial(data, rowNumber, detectedMapping);
            if (material.error) {
              errors.push({ row: rowNumber, error: material.error, data });
            } else {
              results.push(material);
            }
          } catch (error) {
            errors.push({ row: rowNumber, error: error.message, data });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Return results with detected mapping info
    res.json({
      success: true,
      imported: results.length,
      errors: errors.length,
      materials: results,
      errorDetails: errors,
      detectedColumns: headers,
      columnMapping: detectedMapping,
      message: `Successfully imported ${results.length} materials${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
      detectedFields: Object.keys(detectedMapping).filter(k => k !== 'customFields').length,
      customFields: detectedMapping.customFields || []
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to process CSV file',
      details: error.message
    });
  }
});

// Validate and transform CSV row to material object using detected mapping
function validateAndTransformMaterial(data, rowNumber, mapping) {
  // Helper function to get value from data using mapping
  const getValue = (field) => {
    const columnName = mapping[field];
    return columnName ? data[columnName] : null;
  };

  // Get values using detected mapping
  const materialNumber = getValue('materialNumber');
  const description = getValue('description');
  const materialGroup = getValue('materialGroup');
  const plant = getValue('plant') || '1000';
  const storageLocation = getValue('storageLocation');
  const currentStock = parseFloat(getValue('currentStock') || 0);
  const safetyStock = parseFloat(getValue('safetyStock') || 0);
  const reorderPoint = parseFloat(getValue('reorderPoint') || 0);
  const unitOfMeasure = getValue('unitOfMeasure') || 'EA';
  const price = parseFloat(getValue('price') || 0);
  const supplier = getValue('supplier');
  const leadTime = parseFloat(getValue('leadTime') || 0);

  // Validation
  if (!materialNumber) {
    return { error: 'Material Number is required' };
  }
  if (!description) {
    return { error: 'Description is required' };
  }
  if (isNaN(currentStock)) {
    return { error: 'Current Stock must be a number' };
  }

  // Weather sensitivity (optional)
  const humiditySensitive = (getValue('humiditySensitive') || '').toLowerCase() === 'yes';
  const tempSensitive = (getValue('tempSensitive') || '').toLowerCase() === 'yes';
  const maxHumidity = parseFloat(getValue('maxHumidity') || 70);
  const optimalTempMin = parseFloat(getValue('optimalTempMin') || 15);
  const optimalTempMax = parseFloat(getValue('optimalTempMax') || 30);

  // Collect custom fields (unmapped columns)
  const customFields = {};
  if (mapping.customFields) {
    mapping.customFields.forEach(field => {
      if (data[field]) {
        customFields[field] = data[field];
      }
    });
  }

  return {
    materialNumber: materialNumber.trim(),
    description: description.trim(),
    materialGroup: materialGroup || 'GENERAL',
    plant: plant.toString(),
    storageLocation: storageLocation || 'WH01',
    currentStock: currentStock,
    unrestrictedStock: currentStock,
    safetyStock: safetyStock || Math.round(currentStock * 0.2), // Default 20% of current
    reorderPoint: reorderPoint || Math.round(currentStock * 0.3), // Default 30% of current
    unitOfMeasure: unitOfMeasure,
    price: price || null,
    supplier: supplier || null,
    leadTime: leadTime || null,
    weatherSensitivity: (humiditySensitive || tempSensitive) ? {
      humiditySensitive,
      tempSensitive,
      maxHumidity,
      optimalTemp: { min: optimalTempMin, max: optimalTempMax }
    } : null,
    customFields: Object.keys(customFields).length > 0 ? customFields : null
  };
}

// Download CSV template
router.get('/template', (req, res) => {
  const template = `Material Number,Description,Material Group,Plant,Storage Location,Current Stock,Safety Stock,Reorder Point,Unit,Humidity Sensitive,Temperature Sensitive,Max Humidity,Optimal Temp Min,Optimal Temp Max
MAT-CAP-001,MLCC Capacitor 10uF,CAPACITORS,1000,WH01,15000,5000,7500,EA,yes,no,70,15,30
MAT-SEN-001,Temperature Sensor,SENSORS,1000,WH02,3500,2000,3000,EA,yes,yes,65,10,35
MAT-IND-001,Power Inductor 100uH,INDUCTORS,1000,WH01,12000,8000,10000,EA,no,no,80,0,50
MAT-RES-001,Resistor 10K Ohm,RESISTORS,1000,WH03,50000,20000,30000,EA,no,no,85,0,60`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=material_import_template.csv');
  res.send(template);
});

// Get import history/stats
router.get('/history', (req, res) => {
  // This would typically query a database
  // For now, return mock data
  res.json({
    success: true,
    imports: [
      {
        id: 1,
        filename: 'materials_2024.csv',
        imported: 16,
        errors: 0,
        timestamp: new Date().toISOString(),
        user: 'admin'
      }
    ]
  });
});

// Get available SAP system presets
router.get('/sap-presets', (req, res) => {
  res.json({
    success: true,
    presets: columnMappings.getAvailablePresets(),
    details: columnMappings.sapPresets
  });
});

// Preview CSV and detect columns (without importing)
router.post('/preview', upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      error: 'No file uploaded' 
    });
  }

  try {
    let headers = [];
    let sampleRows = [];
    let rowCount = 0;

    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('headers', (csvHeaders) => {
          headers = csvHeaders;
        })
        .on('data', (data) => {
          rowCount++;
          if (rowCount <= 5) { // Get first 5 rows as sample
            sampleRows.push(data);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Auto-detect mapping
    const detectedMapping = columnMappings.autoDetectMapping(headers);

    res.json({
      success: true,
      totalRows: rowCount,
      headers: headers,
      sampleData: sampleRows,
      detectedMapping: detectedMapping,
      detectedFields: Object.keys(detectedMapping).filter(k => k !== 'customFields'),
      customFields: detectedMapping.customFields || [],
      recommendations: generateMappingRecommendations(detectedMapping)
    });

  } catch (error) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to preview CSV file',
      details: error.message
    });
  }
});

// Generate mapping recommendations
function generateMappingRecommendations(mapping) {
  const recommendations = [];
  
  if (!mapping.materialNumber) {
    recommendations.push({
      type: 'error',
      message: 'Material Number column not detected - this is required'
    });
  }
  
  if (!mapping.description) {
    recommendations.push({
      type: 'error',
      message: 'Description column not detected - this is required'
    });
  }
  
  if (!mapping.currentStock) {
    recommendations.push({
      type: 'warning',
      message: 'Current Stock column not detected - will default to 0'
    });
  }
  
  if (!mapping.safetyStock) {
    recommendations.push({
      type: 'info',
      message: 'Safety Stock not detected - will auto-calculate as 20% of current stock'
    });
  }
  
  if (mapping.customFields && mapping.customFields.length > 0) {
    recommendations.push({
      type: 'info',
      message: `${mapping.customFields.length} custom fields detected: ${mapping.customFields.join(', ')}`
    });
  }
  
  return recommendations;
}

module.exports = router;
