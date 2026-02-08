# Adaptive System Guide - Universal SAP Integration

## 🎯 Overview

This AI Inventory Management System is **fully adaptive** and can work with **ANY SAP system or ERP format**. It automatically detects your CSV column structure and adapts the display accordingly.

## ✨ Key Features

### 1. **Auto-Detection of Columns**
- System automatically recognizes column names from any format
- Supports 50+ different column name variations
- Works with SAP S/4HANA, SAP ECC, SAP Business One, ERPNext, Odoo, and custom formats

### 2. **Flexible Column Mapping**
- Material Number: Recognizes `Material`, `MaterialNumber`, `Item Code`, `SKU`, `Part Number`, etc.
- Description: Recognizes `Description`, `Name`, `Item Name`, `Product Name`, etc.
- Stock: Recognizes `Current Stock`, `Quantity`, `On Hand`, `Available Stock`, etc.

### 3. **Custom Fields Support**
- Any unmapped columns are preserved as custom fields
- Custom fields are stored with the material data
- Can be used for company-specific information

## 🔧 Supported SAP Systems

### SAP S/4HANA
```csv
Material,MaterialDescription,MaterialGroup,Plant,StorageLocation,MatlWrhsStkQtyInMatlBaseUnit,SafetyStock
```

### SAP ECC
```csv
MATNR,MAKTX,MATKL,WERKS,LGORT,LABST,EISBE,MEINS
```

### SAP Business One
```csv
ItemCode,ItemName,ItemGroup,Warehouse,OnHand,MinLevel,UOM
```

### ERPNext
```csv
item_code,item_name,item_group,warehouse,actual_qty,safety_stock,stock_uom
```

### Odoo
```csv
default_code,name,categ_id,warehouse_id,qty_available,reordering_min_qty,uom_id
```

### Custom/Generic
```csv
Material Number,Description,Current Stock,Safety Stock,Unit
```

## 📊 How It Works

### Step 1: Upload CSV
Upload any CSV file from your SAP system or ERP

### Step 2: Auto-Detection
System analyzes the headers and detects:
- Standard fields (Material Number, Description, Stock, etc.)
- Weather sensitivity fields (if present)
- Custom fields (company-specific columns)

### Step 3: Smart Mapping
System maps your columns to internal fields:
```
Your Column          →  Internal Field
─────────────────────────────────────────
Material             →  materialNumber
MATNR                →  materialNumber
item_code            →  materialNumber
ItemCode             →  materialNumber
SKU                  →  materialNumber
```

### Step 4: Import & Display
- Data is imported with detected mapping
- Display adapts to show your column names
- Custom fields are preserved and shown

## 🎨 Adaptive Display

The system automatically adjusts:

1. **Table Headers** - Shows your original column names
2. **Field Labels** - Uses your terminology
3. **Custom Columns** - Displays any extra fields you have
4. **Units** - Adapts to your unit of measure

## 📝 Example Scenarios

### Scenario 1: SAP S/4HANA Export
```csv
Material,MaterialDescription,MatlWrhsStkQtyInMatlBaseUnit
10001,Capacitor MLCC,15000
10002,Resistor 10K,50000
```
✅ System detects: Material → Material Number, MaterialDescription → Description, MatlWrhsStkQtyInMatlBaseUnit → Current Stock

### Scenario 2: Custom ERP with Extra Fields
```csv
SKU,Product Name,Qty,Supplier Code,Last Order Date
CAP-001,MLCC Capacitor,15000,SUP-123,2024-01-15
RES-001,Resistor 10K,50000,SUP-456,2024-01-20
```
✅ System detects: SKU → Material Number, Product Name → Description, Qty → Current Stock
✅ Custom fields preserved: Supplier Code, Last Order Date

### Scenario 3: ERPNext with Weather Data
```csv
item_code,item_name,actual_qty,humidity_sensitive,max_humidity
CAP-001,MLCC Capacitor,15000,yes,70
SEN-001,Temperature Sensor,3500,yes,65
```
✅ System detects all fields including weather sensitivity

## 🔍 Column Detection Details

### Recognized Variations

**Material Number:**
- Material Number, MaterialNumber, material_number
- Material, MATNR
- Item Code, ItemCode, item_code
- SKU, sku
- Part Number, PartNumber, part_number
- Product Code

**Description:**
- Description, MaterialDescription, description
- Name, Item Name, ItemName, item_name
- Product Name, ProductName
- MAKTX (SAP ECC)

**Current Stock:**
- Current Stock, CurrentStock, current_stock
- Stock, stock, Quantity, quantity, Qty, qty
- On Hand, OnHand, on_hand
- Available Stock, AvailableStock
- Unrestricted Stock, UnrestrictedStock
- MatlWrhsStkQtyInMatlBaseUnit (SAP S/4HANA)
- LABST (SAP ECC)
- actual_qty (ERPNext)
- qty_available (Odoo)

**And 40+ more field variations...**

## 🚀 Quick Start Examples

### Example 1: Minimal CSV (3 columns)
```csv
Material,Description,Stock
MAT-001,Product A,1000
MAT-002,Product B,2000
```
✅ Works! System auto-fills missing fields with defaults

### Example 2: Full SAP Export (15+ columns)
```csv
Material,MaterialDescription,MaterialGroup,Plant,StorageLocation,Stock,SafetyStock,ReorderPoint,Unit,Price,Supplier,LeadTime,LastPurchaseDate,ABC_Class,Criticality
```
✅ Works! System maps all standard fields and preserves custom ones

### Example 3: Mixed Format
```csv
SKU,Product Name,Qty,Category,WH,Min Stock,Custom Field 1,Custom Field 2
```
✅ Works! System detects standard fields and preserves custom fields

## 💡 Best Practices

### 1. Use Standard Column Names When Possible
While the system is flexible, using standard names ensures better detection:
- ✅ Good: `Material Number`, `Description`, `Current Stock`
- ⚠️ Works but less ideal: `Mat#`, `Desc`, `Stk`

### 2. Include Required Fields
Minimum required:
- Material Number (or equivalent)
- Description (or equivalent)
- Current Stock (or equivalent)

### 3. Test with Sample Data First
1. Export 5-10 rows from your SAP system
2. Import to test column detection
3. Verify mapping is correct
4. Then import full dataset

### 4. Keep Custom Fields Consistent
If you have custom fields, use the same column names across all imports

## 🔧 Advanced Configuration

### Manual Column Mapping (if needed)
If auto-detection doesn't work perfectly, you can:

1. Check detected mapping in import results
2. Adjust your CSV column names to match recognized variations
3. Or contact support to add your specific column names to the system

### Adding New Column Variations
Edit `config/column-mappings.js` to add your specific column names:

```javascript
materialNumber: [
  'Material Number',
  'Your Custom Column Name Here',  // Add this
  // ... existing variations
]
```

## 📊 Import Results

After import, you'll see:

```
✅ Successfully imported 16 materials

Detected Columns:
✓ 8 standard fields: materialNumber, description, currentStock, safetyStock, ...
✓ 3 custom fields: Supplier Code, Last Order Date, ABC Classification

Column Mapping:
Material → materialNumber
Product Name → description
Qty → currentStock
Supplier Code → customFields.supplierCode
```

## 🎓 For Your Thesis

This adaptive system demonstrates:

1. **Flexibility** - Works with any SAP system or ERP
2. **Intelligence** - Auto-detects column structure
3. **Scalability** - Handles custom fields and variations
4. **Real-world Applicability** - Can integrate with actual company systems
5. **User-Friendly** - No manual mapping required

## 🆘 Troubleshooting

### Issue: Column not detected
**Solution:** Check if your column name matches any variation in the mapping list. If not, rename the column or add the variation to the config.

### Issue: Custom fields not showing
**Solution:** Custom fields are preserved in the data but may not display in all views. Check the detailed material view.

### Issue: Wrong field mapping
**Solution:** Ensure your column names are clear and unambiguous. For example, use "Material Number" instead of just "Number".

## 📚 Sample Files Included

- `sample_materials.csv` - Generic format
- `sample_sap_s4hana.csv` - SAP S/4HANA format
- `sample_sap_ecc.csv` - SAP ECC format
- `sample_erpnext.csv` - ERPNext format

Try importing these to see how the system adapts!

## 🎯 Summary

**Your system is truly universal!** It can:
- ✅ Import from ANY SAP system
- ✅ Auto-detect column structure
- ✅ Adapt display to your format
- ✅ Preserve custom fields
- ✅ Work with minimal or extensive data

**No configuration needed** - just upload your CSV and the system adapts automatically!

---

**Questions?** The system will show you exactly what it detected after each import, so you can verify the mapping is correct.
