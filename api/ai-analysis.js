// Vercel Serverless Function - AI Dashboard Analysis
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { tdkMaterials, purchaseOrders, salesOrders, calculateMRP, getStockStatus } = require('./data/sap-data');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get all data
    const mrpData = calculateMRP();
    const weather = { temperature: 28, humidity: 75, condition: 'Partly Cloudy' };
    
    const summary = {
      totalMaterials: mrpData.length,
      criticalRisk: mrpData.filter(m => m.riskLevel === 'CRITICAL').length,
      highRisk: mrpData.filter(m => m.riskLevel === 'HIGH').length,
      mediumRisk: mrpData.filter(m => m.riskLevel === 'MEDIUM').length,
      lowRisk: mrpData.filter(m => m.riskLevel === 'LOW').length,
      weatherSensitiveCount: mrpData.filter(m => m.weatherSensitive).length
    };

    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        analysis: generateMockAnalysis(summary, mrpData, weather),
        timestamp: new Date().toISOString(),
        summary,
        isMock: true,
        reason: 'GEMINI_API_KEY not configured'
      });
    }

    // Build prompt
    const criticalItems = mrpData.filter(m => m.riskLevel === 'CRITICAL' || m.riskLevel === 'HIGH');
    const totalStock = mrpData.reduce((sum, i) => sum + i.currentStock, 0);
    const totalDemand = mrpData.reduce((sum, i) => sum + i.openDemand, 0);
    const totalIncoming = mrpData.reduce((sum, i) => sum + i.incomingSupply, 0);

    const criticalTable = criticalItems.slice(0, 5).map(item => 
      `| ${item.materialNumber} | ${item.description?.substring(0, 25)} | ${item.currentStock?.toLocaleString()} | ${item.safetyStock?.toLocaleString()} | ${item.projectedStock?.toLocaleString()} | ${item.riskLevel} |`
    ).join('\n');

    const prompt = `You are the AI Inventory Management Advisor for TDK Philippines electronics manufacturing plant.
Provide a comprehensive EXECUTIVE DASHBOARD ANALYSIS.

## INVENTORY OVERVIEW
| Metric | Value |
|--------|-------|
| Total Materials | ${summary.totalMaterials} items |
| Total Current Stock | ${totalStock.toLocaleString()} units |
| Total Open Demand | ${totalDemand.toLocaleString()} units |
| Total Incoming Supply | ${totalIncoming.toLocaleString()} units |
| Critical Risk Items | ${summary.criticalRisk} items |
| High Risk Items | ${summary.highRisk} items |
| Weather-Sensitive Items | ${summary.weatherSensitiveCount} items |

## CRITICAL ITEMS
| Material | Description | Current | Safety | Projected | Risk |
|----------|-------------|---------|--------|-----------|------|
${criticalTable || '| None | All items healthy | - | - | - | - |'}

## WEATHER (Philippines)
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%

Provide:
1. EXECUTIVE SUMMARY (2-3 sentences)
2. RISK MATRIX (Supply/Demand/Weather risks rated High/Medium/Low)
3. TOP 5 PRIORITY ACTIONS
4. SAFETY STOCK RECOMMENDATIONS (table format)
5. 7-DAY ACTION PLAN

Be specific and actionable. Format with markdown headers and tables.`;

    // Call Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
      summary,
      isMock: false
    });

  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    
    const mrpData = calculateMRP();
    const summary = {
      totalMaterials: mrpData.length,
      criticalRisk: mrpData.filter(m => m.riskLevel === 'CRITICAL').length,
      highRisk: mrpData.filter(m => m.riskLevel === 'HIGH').length,
      mediumRisk: mrpData.filter(m => m.riskLevel === 'MEDIUM').length,
      lowRisk: mrpData.filter(m => m.riskLevel === 'LOW').length
    };

    res.json({
      success: true,
      analysis: generateMockAnalysis(summary, mrpData, { temperature: 28, humidity: 75 }),
      timestamp: new Date().toISOString(),
      summary,
      isMock: true,
      error: error.message
    });
  }
};

function generateMockAnalysis(summary, mrpData, weather) {
  return `## 📊 AI INVENTORY DASHBOARD ANALYSIS
**Analysis Date:** ${new Date().toLocaleString()}
**Plant:** TDK Philippines - Plant 1000

---

### 1. EXECUTIVE SUMMARY

⚠️ **Overall Status: WARNING** - ${summary.criticalRisk + summary.highRisk} items require attention. Immediate action needed on critical items to prevent production delays.

---

### 2. RISK ASSESSMENT

| Risk Category | Level | Details |
|--------------|-------|---------|
| **Overall Health** | ⚠️ WARNING | ${summary.criticalRisk} critical + ${summary.highRisk} high risk items |
| Supply Risk | Medium | Open POs may not cover projected demand |
| Demand Risk | Medium | High demand on capacitors and sensors |
| Weather Risk | ${weather.humidity > 70 ? 'Medium' : 'Low'} | Humidity at ${weather.humidity}% |

---

### 3. 🚨 TOP 5 PRIORITY ACTIONS

| Priority | Action | Material | Urgency |
|----------|--------|----------|---------|
| **1** | Create emergency PO | TDK-CAP-004 | 🔴 TODAY |
| **2** | Expedite delivery | TDK-SEN-002 | 🔴 TODAY |
| **3** | Review allocation | TDK-IND-003 | 🟡 This Week |
| **4** | Increase safety stock | TDK-FER-002 | 🟡 This Week |
| **5** | Monitor humidity | Weather-sensitive | 🟢 Ongoing |

---

### 4. SAFETY STOCK RECOMMENDATIONS

| Material | Current | Recommended | Change |
|----------|---------|-------------|--------|
| TDK-CAP-004 | 5,000 | 6,250 | +25% |
| TDK-SEN-002 | 2,000 | 2,400 | +20% |
| TDK-IND-003 | 8,000 | 9,200 | +15% |

---

### 5. 📅 7-DAY ACTION PLAN

| Day | Focus | Actions |
|-----|-------|---------|
| Mon | Critical Items | Process emergency POs |
| Tue | Suppliers | Follow up on deliveries |
| Wed | Safety Stock | Update SAP parameters |
| Thu | Weather | Check storage conditions |
| Fri | Demand | Review forecast with sales |

---
*Demo Mode - Configure GEMINI_API_KEY for real AI analysis*`;
}
