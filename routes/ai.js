const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Analyze safety stock levels using Gemini AI - Enhanced for SAP integration
router.post('/analyze-safety-stock', async (req, res) => {
  try {
    const { inventoryItem, weatherData, sapData } = req.body;
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'paste_your_gemini_key_here') {
      // Enhanced mock response for SAP data
      return res.json({
        success: true,
        analysis: generateMockAnalysis(inventoryItem, weatherData, sapData),
        timestamp: new Date().toISOString(),
        inputData: { inventoryItem, weatherData, sapData },
        isMock: true
      });
    }

    // Initialize Gemini with the API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use gemini-2.0-flash (stable model)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = buildSAPAnalysisPrompt(inventoryItem, weatherData, sapData);

    console.log('[AI] Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();
    console.log('[AI] Gemini response received successfully');

    res.json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString(),
      inputData: { inventoryItem, weatherData, sapData },
      isMock: false
    });

  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    
    // Check if it's a rate limit error
    const isRateLimit = error.message?.includes('429') || error.message?.includes('quota');
    
    // Return mock analysis as fallback
    res.json({
      success: true,
      analysis: generateMockAnalysis(req.body.inventoryItem, req.body.weatherData, req.body.sapData),
      timestamp: new Date().toISOString(),
      error: isRateLimit ? 'API rate limit reached - using mock analysis' : error.message,
      isMock: true,
      fallbackReason: isRateLimit ? 
        'Gemini API quota exceeded. Try again in a few seconds or generate a new API key at https://aistudio.google.com/app/apikey' : 
        'Gemini API error - using mock analysis'
    });
  }
});

// Build comprehensive prompt for SAP data analysis
function buildSAPAnalysisPrompt(item, weather, sapData) {
  // Calculate key metrics for context
  const currentStock = item.unrestrictedStock || item.currentStock || 0;
  const safetyStock = item.safetyStock || 0;
  const reorderPoint = item.reorderPoint || 0;
  const stockRatio = safetyStock > 0 ? (currentStock / safetyStock).toFixed(2) : 0;
  const incomingSupply = sapData?.incomingSupply || 0;
  const openDemand = sapData?.openDemand || 0;
  const projectedStock = sapData?.projectedStock || (currentStock + incomingSupply - openDemand);
  
  // Determine current status
  let currentStatus = 'HEALTHY';
  if (currentStock <= safetyStock) currentStatus = 'CRITICAL - Below Safety Stock';
  else if (currentStock <= reorderPoint) currentStatus = 'LOW - At/Below Reorder Point';
  
  return `You are an expert inventory management analyst specializing in electronics manufacturing. Analyze this SAP ERP data and provide actionable safety stock recommendations.

## MATERIAL INFORMATION
- **Material:** ${item.materialNumber} - ${item.description || item.materialDescription}
- **Category:** ${item.materialGroup} (Electronics Component)
- **Location:** Plant ${item.plant}, Warehouse ${item.storageLocation}

## CURRENT INVENTORY STATUS
| Metric | Value | Status |
|--------|-------|--------|
| Current Available Stock | ${currentStock.toLocaleString()} units | ${currentStatus} |
| Safety Stock Level | ${safetyStock.toLocaleString()} units | Minimum buffer |
| Reorder Point | ${reorderPoint.toLocaleString()} units | Trigger for new orders |
| Stock-to-Safety Ratio | ${stockRatio}x | ${stockRatio < 1 ? '⚠️ CRITICAL' : stockRatio < 1.5 ? '⚠️ LOW' : '✓ OK'} |

## SUPPLY CHAIN DATA (MRP)
- **Incoming Supply (Open POs):** ${incomingSupply.toLocaleString()} units
- **Open Demand (Sales Orders):** ${openDemand.toLocaleString()} units  
- **Projected Stock After Fulfillment:** ${projectedStock.toLocaleString()} units
- **Days of Coverage:** ~${sapData?.stockCoverage || Math.round(projectedStock / (safetyStock / 30))} days

## ENVIRONMENTAL CONDITIONS (Philippines)
- **Temperature:** ${weather?.temperature || 28}°C
- **Humidity:** ${weather?.humidity || 75}%
- **Condition:** ${weather?.condition || 'Tropical'}
${item.weatherSensitivity ? `
### Component Sensitivity:
- Humidity Sensitive: ${item.weatherSensitivity.humiditySensitive ? 'YES - Max ' + item.weatherSensitivity.maxHumidity + '%' : 'NO'}
- Temperature Sensitive: ${item.weatherSensitivity.tempSensitive ? 'YES - Optimal ' + item.weatherSensitivity.optimalTemp?.min + '-' + item.weatherSensitivity.optimalTemp?.max + '°C' : 'NO'}
` : ''}

---

## REQUIRED ANALYSIS

Provide a comprehensive analysis with these sections:

### 1. SAFETY STOCK RECOMMENDATION
Calculate the optimal safety stock using this formula context:
- Current demand rate: ~${Math.round(openDemand / 30)} units/day (based on open orders)
- Lead time for electronics: typically 4-8 weeks
- Service level target: 95%

Provide:
- **Recommended Safety Stock:** [specific number] units
- **Change from Current:** [+/-X%]
- **Calculation Basis:** Explain your reasoning

### 2. STOCK STATUS ASSESSMENT  
- Is current stock (${currentStock.toLocaleString()}) adequate?
- Will projected stock (${projectedStock.toLocaleString()}) meet demand?
- Risk of stockout: [High/Medium/Low]

### 3. WEATHER IMPACT (for Philippines climate)
${item.weatherSensitivity?.humiditySensitive || item.weatherSensitivity?.tempSensitive ? 
`This component IS weather-sensitive. Assess:
- Current humidity (${weather?.humidity || 75}%) vs threshold (${item.weatherSensitivity?.maxHumidity || 70}%)
- Storage recommendations
- Monsoon season impact (June-November)` : 
'This component is NOT weather-sensitive. Standard storage applies.'}

### 4. RISK SCORE & FACTORS
- **Overall Risk Score:** [1-10]
- **Key Risk Factors:** List top 3
- **Mitigation Actions:** Specific steps

### 5. ACTION ITEMS
**Immediate (This Week):**
- [List specific actions based on status]

**Short-term (2-4 Weeks):**
- [Planning recommendations]

---
Format with clear headers (##), bullet points, and bold key numbers. Be specific and actionable.`;
}

// Generate mock analysis when API is unavailable
function generateMockAnalysis(item, weather, sapData) {
  const currentStock = item?.unrestrictedStock || item?.currentStock || 0;
  const safetyStock = item?.safetyStock || 0;
  const stockRatio = currentStock / safetyStock;
  
  const isWeatherSensitive = item?.weatherSensitivity?.humiditySensitive || 
                             item?.weatherSensitivity?.tempSensitive;
  const humidity = weather?.humidity || 75;
  const temp = weather?.temperature || 28;
  
  let riskLevel = 'LOW';
  let recommendedSafetyStock = safetyStock;
  let weatherRisk = 'Normal';
  
  // Calculate risk based on stock levels
  if (stockRatio < 1) {
    riskLevel = 'CRITICAL';
    recommendedSafetyStock = Math.round(safetyStock * 1.25);
  } else if (stockRatio < 1.5) {
    riskLevel = 'HIGH';
    recommendedSafetyStock = Math.round(safetyStock * 1.15);
  } else if (stockRatio < 2) {
    riskLevel = 'MEDIUM';
    recommendedSafetyStock = Math.round(safetyStock * 1.1);
  }
  
  // Weather impact for sensitive items
  if (isWeatherSensitive) {
    if (humidity > (item.weatherSensitivity?.maxHumidity || 70)) {
      weatherRisk = 'High - Humidity exceeds threshold';
      recommendedSafetyStock = Math.round(recommendedSafetyStock * 1.1);
    }
    if (temp > (item.weatherSensitivity?.optimalTemp?.max || 30)) {
      weatherRisk = 'High - Temperature above optimal range';
    }
  }

  return `
## Safety Stock Analysis Report
**Material:** ${item?.materialNumber || 'Unknown'} - ${item?.description || item?.materialDescription || 'N/A'}
**Analysis Date:** ${new Date().toLocaleString()}

---

### 1. SAFETY STOCK RECOMMENDATION

**Current Safety Stock:** ${safetyStock.toLocaleString()} units
**Recommended Safety Stock:** ${recommendedSafetyStock.toLocaleString()} units
**Change:** ${recommendedSafetyStock > safetyStock ? '+' : ''}${Math.round((recommendedSafetyStock - safetyStock) / safetyStock * 100)}%

**Justification:**
- Current stock-to-safety ratio: ${stockRatio.toFixed(2)}
- ${sapData?.openDemand ? `Open demand of ${sapData.openDemand.toLocaleString()} units requires buffer` : 'Demand patterns suggest current levels need adjustment'}
- Electronics component lead times typically 4-8 weeks

---

### 2. WEATHER IMPACT ASSESSMENT

**Weather Risk Level:** ${weatherRisk}
**Current Conditions:** ${temp}°C, ${humidity}% humidity

${isWeatherSensitive ? `
**Storage Recommendations:**
- Maintain climate-controlled storage
- Monitor humidity levels daily
- Consider desiccant packaging for sensitive components
- Philippines monsoon season (June-November) requires extra precaution
` : `
**Storage:** Standard warehouse conditions acceptable for this material group.
`}

---

### 3. MRP ANALYSIS

**Stock Situation:**
- Available Stock: ${currentStock.toLocaleString()} units
- Incoming (POs): ${sapData?.incomingSupply?.toLocaleString() || 'N/A'} units
- Open Demand: ${sapData?.openDemand?.toLocaleString() || 'N/A'} units
- Projected Stock: ${sapData?.projectedStock?.toLocaleString() || 'N/A'} units

**Assessment:** ${sapData?.projectedStock < safetyStock ? 
  'ATTENTION: Projected stock falls below safety stock level. Expedite purchase orders.' :
  'Stock levels adequate for current demand pipeline.'}

---

### 4. RISK ASSESSMENT

**Overall Risk Score:** ${riskLevel === 'CRITICAL' ? '9/10' : riskLevel === 'HIGH' ? '7/10' : riskLevel === 'MEDIUM' ? '5/10' : '3/10'}
**Risk Level:** ${riskLevel}

**Key Risk Factors:**
${stockRatio < 1.5 ? '- Stock below optimal buffer level\n' : ''}${isWeatherSensitive && humidity > 60 ? '- High humidity environment for sensitive components\n' : ''}${sapData?.openDemand > currentStock ? '- Open demand exceeds current stock\n' : ''}- Supply chain volatility in electronics sector
- Seasonal demand fluctuations

---

### 5. ACTION ITEMS

**Immediate (This Week):**
${riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 
  '- ⚠️ Create urgent purchase requisition\n- Contact suppliers for expedited delivery\n- Review allocation for critical customers' :
  '- Monitor stock levels daily\n- Review upcoming demand forecast'}

**Short-term (1-2 Weeks):**
- Update safety stock parameter in SAP MM to ${recommendedSafetyStock.toLocaleString()} units
- Review vendor lead times and adjust reorder point if needed
- Coordinate with production planning on demand changes

**Long-term Strategy:**
- Implement vendor-managed inventory for high-volume items
- Consider safety stock optimization based on service level targets
- Evaluate alternative suppliers for supply chain resilience

---
*This analysis is generated for academic thesis demonstration purposes.*
*Mock AI Analysis - Gemini API key not configured*
`;
}

// Get AI insights for dashboard - Enhanced for SAP
router.get('/insights', async (req, res) => {
  try {
    // Fetch SAP MRP data for insights
    const axios = require('axios');
    let sapAnalysis = null;
    
    try {
      const sapResponse = await axios.get(`http://localhost:${process.env.PORT || 3000}/api/sap/mrp-analysis`);
      sapAnalysis = sapResponse.data;
    } catch (e) {
      console.log('Could not fetch SAP data for insights');
    }

    const insights = {
      totalItems: sapAnalysis?.summary?.totalMaterials || 16,
      lowStockAlerts: (sapAnalysis?.summary?.criticalRisk || 0) + (sapAnalysis?.summary?.highRisk || 0),
      weatherImpactItems: sapAnalysis?.summary?.weatherSensitiveCount || 10,
      criticalItems: sapAnalysis?.criticalItems || [],
      aiRecommendations: generateInsightRecommendations(sapAnalysis),
      lastAnalysis: new Date().toISOString(),
      sapConnected: !!sapAnalysis
    };

    res.json(insights);
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

function generateInsightRecommendations(sapAnalysis) {
  if (!sapAnalysis?.criticalItems?.length) {
    return [
      { item: 'TDK-CAP-004', action: 'Review safety stock', reason: 'Tantalum capacitors showing low coverage', priority: 'High' },
      { item: 'TDK-SEN-002', action: 'Expedite PO', reason: 'MEMS sensors below reorder point', priority: 'High' },
      { item: 'TDK-FER-002', action: 'Monitor closely', reason: 'Ferrite cores approaching safety stock', priority: 'Medium' }
    ];
  }

  return sapAnalysis.criticalItems.slice(0, 5).map(item => ({
    item: item.materialNumber,
    action: item.riskLevel === 'CRITICAL' ? 'Urgent reorder required' : 'Increase safety stock',
    reason: `${item.description} - Projected stock: ${item.projectedStock?.toLocaleString() || 'N/A'}`,
    priority: item.riskLevel === 'CRITICAL' ? 'Critical' : 'High'
  }));
}

// ============================================
// COMPREHENSIVE DASHBOARD AI ANALYSIS
// Analyzes ALL inventory at once for dashboard
// ============================================
router.get('/dashboard-analysis', async (req, res) => {
  try {
    const axios = require('axios');
    const baseUrl = `http://localhost:${process.env.PORT || 3000}`;
    
    console.log('[AI] Dashboard analysis - fetching data from:', baseUrl);
    
    // Fetch all data with individual error handling
    let stockData = null, mrpData = null, weather = null, purchaseOrders = [], salesOrders = [];
    
    try {
      const stockRes = await axios.get(`${baseUrl}/api/sap/stock`);
      stockData = stockRes.data;
      console.log('[AI] Stock data fetched successfully');
    } catch (e) {
      console.log('[AI] Stock fetch failed:', e.message);
    }
    
    try {
      const mrpRes = await axios.get(`${baseUrl}/api/sap/mrp-analysis`);
      mrpData = mrpRes.data;
      console.log('[AI] MRP data fetched successfully');
    } catch (e) {
      console.log('[AI] MRP fetch failed:', e.message);
    }
    
    try {
      const weatherRes = await axios.get(`${baseUrl}/api/weather/current/Manila`);
      weather = weatherRes.data?.fallback || weatherRes.data;
      console.log('[AI] Weather data fetched successfully');
    } catch (e) {
      console.log('[AI] Weather fetch failed, using defaults');
      weather = { temperature: 28, humidity: 75, condition: 'Tropical' };
    }
    
    try {
      const poRes = await axios.get(`${baseUrl}/api/sap/purchase-orders`);
      purchaseOrders = poRes.data?.data || [];
      console.log('[AI] PO data fetched successfully');
    } catch (e) {
      console.log('[AI] PO fetch failed:', e.message);
    }
    
    try {
      const soRes = await axios.get(`${baseUrl}/api/sap/sales-orders`);
      salesOrders = soRes.data?.data || [];
      console.log('[AI] SO data fetched successfully');
    } catch (e) {
      console.log('[AI] SO fetch failed:', e.message);
    }
    
    // If we couldn't get MRP data, return mock analysis
    if (!mrpData) {
      console.log('[AI] No MRP data available, returning mock analysis');
      return res.json({
        success: true,
        analysis: generateMockDashboardAnalysis(stockData, mrpData, weather, purchaseOrders, salesOrders),
        timestamp: new Date().toISOString(),
        isMock: true,
        reason: 'Could not fetch SAP data'
      });
    }

    // Check if Gemini API is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'paste_your_gemini_key_here') {
      return res.json({
        success: true,
        analysis: generateMockDashboardAnalysis(stockData, mrpData, weather, purchaseOrders, salesOrders),
        timestamp: new Date().toISOString(),
        isMock: true
      });
    }

    // Build comprehensive prompt for full inventory analysis
    const prompt = buildDashboardAnalysisPrompt(stockData, mrpData, weather, purchaseOrders, salesOrders);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    console.log('[AI] Generating comprehensive dashboard analysis...');
    const result = await model.generateContent(prompt);
    const analysis = result.response.text();
    console.log('[AI] Dashboard analysis complete');

    res.json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString(),
      summary: mrpData.summary,
      isMock: false
    });

  } catch (error) {
    console.error('Dashboard Analysis Error:', error.message);
    res.json({
      success: true,
      analysis: generateMockDashboardAnalysis(null, null, null, null, null),
      timestamp: new Date().toISOString(),
      error: error.message,
      isMock: true
    });
  }
});

// Build prompt for comprehensive dashboard analysis
function buildDashboardAnalysisPrompt(stockData, mrpData, weather, purchaseOrders, salesOrders) {
  const summary = mrpData.summary;
  const criticalItems = mrpData.criticalItems || [];
  const allItems = mrpData.data || [];
  
  // Calculate totals
  const totalStock = allItems.reduce((sum, i) => sum + (i.currentStock || 0), 0);
  const totalDemand = allItems.reduce((sum, i) => sum + (i.openDemand || 0), 0);
  const totalIncoming = allItems.reduce((sum, i) => sum + (i.incomingSupply || 0), 0);
  const weatherSensitiveItems = allItems.filter(i => i.weatherSensitive);
  
  // Build critical items table
  const criticalTable = criticalItems.slice(0, 5).map(item => 
    `| ${item.materialNumber} | ${item.description?.substring(0, 25)} | ${item.currentStock?.toLocaleString()} | ${item.safetyStock?.toLocaleString()} | ${item.projectedStock?.toLocaleString()} | ${item.riskLevel} |`
  ).join('\n');

  return `You are the AI Inventory Management Advisor for TDK Philippines electronics manufacturing plant. 
Provide a comprehensive EXECUTIVE DASHBOARD ANALYSIS of the entire inventory situation.

## INVENTORY OVERVIEW
| Metric | Value |
|--------|-------|
| Total Materials | ${summary.totalMaterials} items |
| Total Current Stock | ${totalStock.toLocaleString()} units |
| Total Open Demand | ${totalDemand.toLocaleString()} units |
| Total Incoming Supply | ${totalIncoming.toLocaleString()} units |
| Critical Risk Items | ${summary.criticalRisk} items |
| High Risk Items | ${summary.highRisk} items |
| Medium Risk Items | ${summary.mediumRisk} items |
| Low Risk (Healthy) | ${summary.lowRisk} items |
| Weather-Sensitive Items | ${summary.weatherSensitiveCount} items |

## CRITICAL ITEMS REQUIRING IMMEDIATE ATTENTION
| Material | Description | Current | Safety | Projected | Risk |
|----------|-------------|---------|--------|-----------|------|
${criticalTable || '| None | All items healthy | - | - | - | - |'}

## CURRENT WEATHER CONDITIONS (Philippines)
- Temperature: ${weather?.temperature || 28}°C
- Humidity: ${weather?.humidity || 75}%
- Condition: ${weather?.condition || 'Tropical'}
- Weather-sensitive items at risk: ${weatherSensitiveItems.filter(i => 
    (weather?.humidity || 75) > (i.weatherConstraints?.maxHumidity || 70)
  ).length} items

## OPEN PURCHASE ORDERS
- Total Open POs: ${purchaseOrders?.length || 0}
- Expected incoming: ${totalIncoming.toLocaleString()} units

## OPEN SALES ORDERS (DEMAND)
- Total Open SOs: ${salesOrders?.length || 0}
- Total demand: ${totalDemand.toLocaleString()} units

---

## REQUIRED ANALYSIS - Provide ALL of the following:

### 1. EXECUTIVE SUMMARY (2-3 sentences)
Overall health of inventory. Key concern. Immediate priority.

### 2. RISK ASSESSMENT MATRIX
Rate overall inventory health: [CRITICAL/WARNING/STABLE/HEALTHY]
- Supply Risk: [High/Medium/Low] - Why?
- Demand Risk: [High/Medium/Low] - Why?
- Weather Risk: [High/Medium/Low] - Why?
- Overall Risk Score: [1-10]

### 3. TOP 5 PRIORITY ACTIONS
List the 5 most important actions to take TODAY, ranked by urgency:
1. [Action] - [Material] - [Reason]
2. ...

### 4. SAFETY STOCK RECOMMENDATIONS
For the critical items, recommend specific safety stock adjustments:
| Material | Current Safety | Recommended | Change | Reason |
|----------|---------------|-------------|--------|--------|

### 5. WEATHER IMPACT ANALYSIS
- Which items are at risk due to current humidity (${weather?.humidity || 75}%)?
- Storage recommendations
- Monsoon season preparedness (if applicable)

### 6. SUPPLY-DEMAND BALANCE
- Will incoming supply meet demand?
- Gap analysis
- Recommended purchase quantities

### 7. 7-DAY FORECAST & RECOMMENDATIONS
What should the inventory team focus on this week?

---
Format with clear headers, tables where appropriate, and bold key numbers.
Be specific, actionable, and prioritize by business impact.`;
}

// Generate mock dashboard analysis
function generateMockDashboardAnalysis(stockData, mrpData, weather, purchaseOrders, salesOrders) {
  const summary = mrpData?.summary || { totalMaterials: 16, criticalRisk: 2, highRisk: 3, mediumRisk: 4, lowRisk: 7 };
  const humidity = weather?.humidity || 75;
  
  return `## 📊 AI INVENTORY DASHBOARD ANALYSIS
**Analysis Date:** ${new Date().toLocaleString()}
**Plant:** TDK Philippines - Plant 1000

---

### 1. EXECUTIVE SUMMARY

⚠️ **Overall Status: WARNING** - Your inventory requires attention. ${summary.criticalRisk + summary.highRisk} items are at risk of stockout. Immediate action needed on critical items to prevent production delays. Weather conditions are within acceptable range but humidity should be monitored.

---

### 2. RISK ASSESSMENT MATRIX

| Risk Category | Level | Score | Details |
|--------------|-------|-------|---------|
| **Overall Health** | ⚠️ WARNING | 6/10 | ${summary.criticalRisk} critical + ${summary.highRisk} high risk items |
| Supply Risk | Medium | 5/10 | Open POs may not cover projected demand |
| Demand Risk | Medium | 6/10 | High demand on capacitors and sensors |
| Weather Risk | ${humidity > 70 ? 'Medium' : 'Low'} | ${humidity > 70 ? '5' : '3'}/10 | Humidity at ${humidity}% - monitor sensitive items |

---

### 3. 🚨 TOP 5 PRIORITY ACTIONS

| Priority | Action | Material | Urgency | Impact |
|----------|--------|----------|---------|--------|
| **1** | Create emergency PO | TDK-CAP-004 | 🔴 TODAY | Tantalum capacitors below safety stock |
| **2** | Expedite delivery | TDK-SEN-002 | 🔴 TODAY | MEMS sensors critical for customer orders |
| **3** | Review allocation | TDK-IND-003 | 🟡 This Week | Common mode chokes at reorder point |
| **4** | Increase safety stock | TDK-FER-002 | 🟡 This Week | Ferrite cores showing high demand |
| **5** | Monitor humidity | Weather-sensitive | 🟢 Ongoing | ${humidity}% humidity - check storage conditions |

---

### 4. SAFETY STOCK RECOMMENDATIONS

| Material | Current Safety | Recommended | Change | Reason |
|----------|---------------|-------------|--------|--------|
| TDK-CAP-004 | 5,000 | 6,250 | +25% | High demand, long lead time |
| TDK-SEN-002 | 2,000 | 2,400 | +20% | Critical for automotive customers |
| TDK-IND-003 | 8,000 | 9,200 | +15% | Increasing demand trend |
| TDK-FER-002 | 3,000 | 3,300 | +10% | Supply chain volatility |

**Total Investment Required:** ~15,000 additional units across critical items

---

### 5. WEATHER IMPACT ANALYSIS

**Current Conditions:** ${weather?.temperature || 28}°C, ${humidity}% humidity

${humidity > 70 ? `
⚠️ **WARNING: High Humidity Alert**
- Current humidity (${humidity}%) exceeds threshold for sensitive components
- **At-Risk Items:** MLCC Capacitors, Tantalum Capacitors, MEMS Sensors
- **Immediate Action:** Verify climate control in WH01 and WH04

**Storage Recommendations:**
- Activate dehumidifiers in sensitive storage areas
- Check desiccant packs in component packaging
- Increase inspection frequency for moisture-sensitive items
` : `
✅ **Weather Conditions: Acceptable**
- Humidity within safe range for all components
- Continue standard monitoring procedures
`}

**Monsoon Season Note:** June-November requires extra vigilance for humidity-sensitive items.

---

### 6. SUPPLY-DEMAND BALANCE

| Category | Supply | Demand | Balance | Status |
|----------|--------|--------|---------|--------|
| Capacitors | +73,000 | -155,000 | -82,000 | ⚠️ Shortage Risk |
| Inductors | +21,000 | -25,000 | -4,000 | ⚠️ Tight |
| Sensors | +11,800 | -5,000 | +6,800 | ✅ OK |
| Ferrites | +32,000 | -40,000 | -8,000 | ⚠️ Monitor |

**Gap Analysis:**
- **Critical Gap:** Capacitors - need additional 82,000 units to meet demand
- **Recommendation:** Issue PO for 100,000 units of high-demand capacitors

---

### 7. 📅 7-DAY ACTION PLAN

| Day | Focus Area | Actions |
|-----|------------|---------|
| **Mon** | Critical Items | Process emergency POs for TDK-CAP-004, TDK-SEN-002 |
| **Tue** | Supplier Contact | Follow up on pending deliveries, negotiate expedited shipping |
| **Wed** | Safety Stock | Update SAP MM parameters for recommended safety stock levels |
| **Thu** | Weather Check | Inspect climate control systems, verify humidity levels |
| **Fri** | Demand Review | Meet with sales team to validate demand forecast |
| **Weekend** | Monitoring | Automated alerts active for critical thresholds |

---

### 8. KEY METRICS TO WATCH

📈 **Improve These:**
- Inventory turnover ratio (currently below target)
- Safety stock coverage days
- Supplier on-time delivery rate

📉 **Reduce These:**
- Number of critical/high risk items
- Stockout incidents
- Emergency order frequency

---

*This analysis is automatically generated by AI based on current SAP data.*
*Refresh for updated analysis as inventory changes.*
*Mock Analysis Mode - Configure GEMINI_API_KEY for real AI insights*
`;
}

module.exports = router;
