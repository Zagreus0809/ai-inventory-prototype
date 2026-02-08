# CSV Import Guide

## Overview
The CSV Import feature allows you to bulk import material data into the AI Inventory Management System.

## How to Use

### Step 1: Prepare Your CSV File

You can either:
1. **Download the template** from the Import modal
2. **Use the sample file** included: `sample_materials.csv`
3. **Create your own** following the format below

### Step 2: Import Process

1. Click the **"Import CSV"** button in the toolbar
2. Drag and drop your CSV file or click "Browse Files"
3. Review the file details
4. Click **"Upload & Import"**
5. View import results and any errors

## CSV Format

### Required Columns

| Column Name | Description | Example |
|------------|-------------|---------|
| **Material Number** | Unique identifier | MAT-CAP-001 |
| **Description** | Material name/description | MLCC Capacitor 10uF |
| **Current Stock** | Current inventory quantity | 15000 |

### Optional Columns

| Column Name | Description | Default |
|------------|-------------|---------|
| Material Group | Category/type | GENERAL |
| Plant | Plant code | 1000 |
| Storage Location | Warehouse code | WH01 |
| Safety Stock | Minimum buffer stock | 20% of current |
| Reorder Point | Reorder trigger level | 30% of current |
| Unit | Unit of measure | EA |
| Humidity Sensitive | yes/no | no |
| Temperature Sensitive | yes/no | no |
| Max Humidity | Maximum humidity % | 70 |
| Optimal Temp Min | Min temperature °C | 15 |
| Optimal Temp Max | Max temperature °C | 30 |

## Column Name Variations

The system accepts multiple column name formats:

- **Material Number**: `Material Number`, `MaterialNumber`, `material_number`, `Material`
- **Description**: `Description`, `MaterialDescription`, `description`, `Name`
- **Current Stock**: `Current Stock`, `CurrentStock`, `current_stock`, `Stock`
- **Safety Stock**: `Safety Stock`, `SafetyStock`, `safety_stock`
- And so on...

## Example CSV

```csv
Material Number,Description,Material Group,Current Stock,Safety Stock,Unit
MAT-CAP-001,MLCC Capacitor 10uF,CAPACITORS,15000,5000,EA
MAT-SEN-001,Temperature Sensor,SENSORS,3500,2000,EA
MAT-IND-001,Power Inductor 100uH,INDUCTORS,12000,8000,EA
```

## Weather Sensitivity

For weather-sensitive materials, include these columns:

```csv
Material Number,Description,Humidity Sensitive,Temperature Sensitive,Max Humidity,Optimal Temp Min,Optimal Temp Max
MAT-CAP-004,Tantalum Capacitor,yes,yes,65,10,35
MAT-SEN-002,MEMS Sensor,yes,yes,60,15,30
```

## Import Results

After import, you'll see:
- ✅ **Number of materials imported successfully**
- ⚠️ **Number of errors** (if any)
- 📋 **Error details** with row numbers and reasons

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Material Number is required | Missing material number | Add material number to row |
| Description is required | Missing description | Add description to row |
| Current Stock must be a number | Invalid number format | Use numeric values only |
| Only CSV files are allowed | Wrong file type | Use .csv file format |

## Tips

1. **Use the template** - Download the template to ensure correct format
2. **Check your data** - Verify all required fields are filled
3. **Test with sample** - Try importing `sample_materials.csv` first
4. **Review errors** - If errors occur, check the error details table
5. **Backup first** - Keep a copy of your original data

## After Import

The system will:
1. ✅ Validate all data
2. ✅ Import valid materials
3. ✅ Show error details for invalid rows
4. ✅ Automatically refresh the dashboard
5. ✅ Trigger AI analysis for new materials

## API Endpoints

For developers:

- **Import CSV**: `POST /api/csv/import`
- **Download Template**: `GET /api/csv/template`
- **Import History**: `GET /api/csv/history`

## File Size Limits

- Maximum file size: 10 MB
- Recommended: < 1000 rows per import
- For larger imports, split into multiple files

## Supported Formats

- ✅ CSV (Comma-separated values)
- ✅ UTF-8 encoding
- ✅ Excel-exported CSV
- ❌ Excel files (.xlsx, .xls) - Convert to CSV first

## Need Help?

1. Download and review `sample_materials.csv`
2. Use the template from the Import modal
3. Check error messages for specific issues
4. Ensure all required columns are present

---

**Pro Tip**: After importing, the AI will automatically analyze the new materials and provide recommendations!
