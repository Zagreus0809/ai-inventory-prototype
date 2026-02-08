# CSV Import - Quick Start Guide

## 🚀 Quick Steps

1. **Click "Import CSV"** button in the dashboard toolbar
2. **Download template** or use `sample_materials.csv`
3. **Drag & drop** your CSV file
4. **Click "Upload & Import"**
5. **Done!** Materials are imported and AI analysis runs automatically

## 📋 Minimum CSV Format

```csv
Material Number,Description,Current Stock
MAT-001,Product Name,1000
MAT-002,Another Product,2000
```

That's it! The system will auto-fill other fields with defaults.

## 🎯 Full Format (Recommended)

```csv
Material Number,Description,Material Group,Current Stock,Safety Stock,Reorder Point,Unit
MAT-CAP-001,MLCC Capacitor 10uF,CAPACITORS,15000,5000,7500,EA
MAT-SEN-001,Temperature Sensor,SENSORS,3500,2000,3000,EA
```

## 🌡️ Weather-Sensitive Materials

Add these columns for weather monitoring:

```csv
Material Number,Description,Humidity Sensitive,Temperature Sensitive,Max Humidity
MAT-CAP-004,Tantalum Capacitor,yes,yes,65
```

## ✅ What Happens After Import

1. ✅ Data validated automatically
2. ✅ Materials added to inventory
3. ✅ Dashboard refreshes
4. ✅ AI analysis runs on new materials
5. ✅ Alerts generated if needed

## 📁 Files Included

- `sample_materials.csv` - Ready-to-use example with 16 materials
- `CSV_IMPORT_GUIDE.md` - Detailed documentation
- Template available in Import modal

## 🔧 API Endpoints

```javascript
// Import CSV
POST /api/csv/import
Content-Type: multipart/form-data
Body: csvFile (file)

// Download template
GET /api/csv/template

// Import history
GET /api/csv/history
```

## 💡 Pro Tips

- Use the template to avoid format errors
- Test with `sample_materials.csv` first
- Keep backups of your CSV files
- Import in batches of < 1000 rows
- Check error details if import fails

## 🎓 For Your Thesis

This feature demonstrates:
- ✅ Bulk data import capability
- ✅ Data validation and error handling
- ✅ User-friendly interface
- ✅ Integration with AI analysis
- ✅ Real-world usability

Perfect for showing how the system handles real company data!

---

**Need help?** Check `CSV_IMPORT_GUIDE.md` for detailed documentation.
