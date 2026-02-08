// Vercel Serverless Function - AI Dashboard Analysis
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { companyMaterials, purchaseOrders, salesOrders, calculateMRP, getStockStatus } = require('./data/sap-data');

module.exports = async function handler(req, res) {
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

    const prompt = `You are the AI Inventory Management Advisor for Company A electronics manufacturing plant.
Provide a comprehensive EXECUTIVE DASHBOARD ANALYSIS aligned with inventory management best practices.

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

## CRITICAL ITEMS REQUIRING ATTENTION
| Material | Description | Current | Safety | Projected | Risk |
|----------|-------------|---------|--------|-----------|------|
${criticalTable || '| None | All items healthy | - | - | - | - |'}

## ENVIRONMENTAL CONDITIONS (Philippines)
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Impact: ${weather.humidity > 70 ? 'HIGH - Monitor weather-sensitive materials' : 'NORMAL'}

Provide a comprehensive analysis with these sections:

1. **EXECUTIVE SUMMARY** (2-3 sentences on overall inventory health and urgency level)

2. **AI-POWERED INSIGHTS**
   - Automated anomaly detection results
   - Predictive stockout risks (next 7-14 days)
   - Overstock identification and cost impact
   - Data accuracy assessment

3. **EFFICIENCY METRICS**
   - Time savings from AI automation vs manual tracking
   - Error reduction percentage
   - Real-time data accuracy status
   - System response time improvements

4. **RISK ASSESSMENT MATRIX**
   | Risk Category | Level | Impact | Mitigation |
   |--------------|-------|--------|------------|
   (Include: Supply Chain, Demand Fluctuation, Weather, Data Accuracy, Stockout, Overstock)

5. **PRIORITY ACTIONS** (Top 5 with specific material numbers and deadlines)

6. **INVENTORY OPTIMIZATION RECOMMENDATIONS**
   - Safety stock adjustments (with cost-benefit analysis)
   - Reorder point optimization
   - Carrying cost reduction opportunities
   - Dead stock identification

7. **DEMAND FORECASTING**
   - Predicted consumption patterns
   - Seasonal/weather impact on demand
   - Fast-moving vs slow-moving items analysis

8. **SYSTEM PERFORMANCE INDICATORS**
   - SAP integration status
   - Data synchronization accuracy
   - Alert response effectiveness
   - User productivity improvements

9. **7-DAY ACTION PLAN** (Daily tasks with responsible actions)

10. **COST IMPACT ANALYSIS**
    - Potential savings from recommendations
    - Carrying cost reduction estimates
    - Stockout prevention value

Format with clear markdown headers, tables, and use emojis for visual clarity. Be specific with material numbers and quantities.`;

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
}

function generateMockAnalysis(summary, mrpData, weather) {
  const criticalItems = mrpData.filter(m => m.riskLevel === 'CRITICAL' || m.riskLevel === 'HIGH').slice(0, 5);
  const totalValue = mrpData.reduce((sum, i) => sum + (i.currentStock * 10), 0); // Estimated value
  
  return `## 📊 AI-POWERED INVENTORY MANAGEMENT ANALYSIS
**Analysis Date:** ${new Date().toLocaleString()}
**Plant:** Company A - Plant 1000 | **System:** SAP Integrated with AI Analytics

---

### 1. 🎯 EXECUTIVE SUMMARY

⚠️ **Overall Status: ${summary.criticalRisk > 0 ? 'CRITICAL ATTENTION REQUIRED' : 'WARNING'}** - ${summary.criticalRisk + summary.highRisk} items require immediate attention. AI system has detected potential stockout risks within 7 days. Immediate action needed to prevent production delays and maintain operational efficiency.

**Key Findings:** AI automation has identified ${summary.criticalRisk} critical stockout risks, ${summary.highRisk} high-risk items, and ${summary.weatherSensitiveCount} weather-sensitive materials requiring monitoring. Estimated inventory value: $${(totalValue/1000).toFixed(0)}K.

---

### 2. 🤖 AI-POWERED INSIGHTS

| Insight Category | Status | Details |
|-----------------|--------|---------|
| **Anomaly Detection** | ✅ Active | ${summary.criticalRisk} anomalies detected in stock levels |
| **Predictive Analytics** | ⚠️ Warning | ${summary.criticalRisk + summary.highRisk} items at risk of stockout in 7-14 days |
| **Overstock Detection** | ✅ Optimized | ${summary.lowRisk} items with excess inventory identified |
| **Data Accuracy** | ✅ 98.5% | Real-time SAP integration maintaining high accuracy |
| **Error Reduction** | ✅ 85% | AI reduced manual data entry errors by 85% |
| **Time Savings** | ✅ 4.2 hrs/day | Automated tracking saves 4.2 hours daily vs manual methods |

---

### 3. ⚡ EFFICIENCY METRICS

| Metric | Before AI | With AI | Improvement |
|--------|-----------|---------|-------------|
| **Daily Tracking Time** | 5+ hours | 0.8 hours | 84% reduction |
| **Data Entry Errors** | 12-15/day | 2-3/day | 85% reduction |
| **Stock Discrepancies** | Weekly | Rare (monthly) | 75% reduction |
| **Report Generation** | 2 hours | 5 minutes | 96% faster |
| **Stockout Incidents** | 8-10/month | 2-3/month | 70% reduction |
| **Manual Reconciliation** | 3 hrs/day | 20 min/day | 89% reduction |

---

### 4. 🎯 RISK ASSESSMENT MATRIX

| Risk Category | Level | Impact | Mitigation Strategy |
|--------------|-------|--------|---------------------|
| **Supply Chain Risk** | 🔴 HIGH | Production delays | Expedite ${summary.criticalRisk} critical POs immediately |
| **Demand Fluctuation** | 🟡 MEDIUM | Overstock/stockout | AI forecasting active, review weekly |
| **Weather Impact** | ${weather.humidity > 70 ? '🟡 MEDIUM' : '🟢 LOW'} | Material degradation | Monitor ${summary.weatherSensitiveCount} sensitive items |
| **Data Accuracy** | 🟢 LOW | Decision errors | 98.5% accuracy maintained by AI |
| **Stockout Risk** | 🔴 HIGH | Lost production | ${summary.criticalRisk} items need emergency orders |
| **Overstock Risk** | 🟡 MEDIUM | Carrying costs | ${summary.lowRisk} items for optimization |
| **System Integration** | 🟢 LOW | Data sync issues | SAP integration stable, 99.2% uptime |

---

### 5. 🚨 TOP 5 PRIORITY ACTIONS

| Priority | Action Required | Material | Current | Safety | Urgency | Est. Impact |
|----------|----------------|----------|---------|--------|---------|-------------|
| **1** | 🔴 Create Emergency PO | ${criticalItems[0]?.materialNumber || 'MAT-CAP-004'} | ${criticalItems[0]?.currentStock?.toLocaleString() || '450'} | ${criticalItems[0]?.safetyStock?.toLocaleString() || '5,000'} | TODAY | $15K loss risk |
| **2** | 🔴 Expedite Delivery | ${criticalItems[1]?.materialNumber || 'MAT-SEN-002'} | ${criticalItems[1]?.currentStock?.toLocaleString() || '1,200'} | ${criticalItems[1]?.safetyStock?.toLocaleString() || '2,000'} | TODAY | $8K loss risk |
| **3** | 🟡 Review Allocation | ${criticalItems[2]?.materialNumber || 'MAT-IND-003'} | ${criticalItems[2]?.currentStock?.toLocaleString() || '6,500'} | ${criticalItems[2]?.safetyStock?.toLocaleString() || '8,000'} | This Week | $5K optimization |
| **4** | 🟡 Increase Safety Stock | ${criticalItems[3]?.materialNumber || 'MAT-FER-002'} | ${criticalItems[3]?.currentStock?.toLocaleString() || '3,800'} | ${criticalItems[3]?.safetyStock?.toLocaleString() || '4,500'} | This Week | Prevent delays |
| **5** | 🟢 Monitor Conditions | Weather-sensitive items | ${summary.weatherSensitiveCount} items | - | Ongoing | Quality assurance |

---

### 6. 📦 INVENTORY OPTIMIZATION RECOMMENDATIONS

| Material | Current Safety | Recommended | Change | Cost Impact | Rationale |
|----------|---------------|-------------|--------|-------------|-----------|
| ${criticalItems[0]?.materialNumber || 'MAT-CAP-004'} | 5,000 | 6,250 | +25% | +$2,500 | High consumption rate, prevent stockouts |
| ${criticalItems[1]?.materialNumber || 'MAT-SEN-002'} | 2,000 | 2,400 | +20% | +$1,200 | Lead time variability |
| ${criticalItems[2]?.materialNumber || 'MAT-IND-003'} | 8,000 | 9,200 | +15% | +$3,600 | Seasonal demand increase |
| ${criticalItems[3]?.materialNumber || 'MAT-FER-002'} | 4,500 | 4,950 | +10% | +$900 | Supply chain reliability |

**Total Investment:** $8,200 | **Estimated Savings:** $28K/year (stockout prevention)

---

### 7. 📈 DEMAND FORECASTING & ANALYSIS

| Category | Trend | Fast-Moving Items | Slow-Moving Items | Weather Impact |
|----------|-------|-------------------|-------------------|----------------|
| **Capacitors** | ↗️ +15% | MAT-CAP-001, 004 | MAT-CAP-008 | Low |
| **Sensors** | ↗️ +22% | MAT-SEN-002, 005 | MAT-SEN-007 | ${weather.humidity > 70 ? 'High' : 'Medium'} |
| **Inductors** | → Stable | MAT-IND-003 | MAT-IND-006 | Low |
| **Ferrites** | ↘️ -8% | MAT-FER-002 | MAT-FER-004, 005 | Low |

**AI Prediction:** Next 14 days will see 18% increase in capacitor demand due to production schedule. Recommend proactive ordering.

---

### 8. 💻 SYSTEM PERFORMANCE INDICATORS

| Indicator | Status | Performance | Target | Notes |
|-----------|--------|-------------|--------|-------|
| **SAP Integration** | ✅ Active | 99.2% uptime | 99% | Excellent |
| **Data Sync Accuracy** | ✅ Optimal | 98.5% | 95% | Above target |
| **Alert Response Time** | ✅ Fast | 2.3 seconds | <5 sec | Real-time |
| **User Productivity** | ✅ High | +65% | +50% | Exceeds goal |
| **Automation Level** | ✅ Advanced | 87% | 80% | Highly automated |
| **Error Rate** | ✅ Low | 1.5% | <3% | Excellent |
| **Report Generation** | ✅ Instant | 5 minutes | <15 min | 96% faster |

**AI System Health:** 🟢 All systems operational. No technical issues detected.

---

### 9. 📅 7-DAY ACTION PLAN

| Day | Focus Area | Specific Actions | Responsible | Expected Outcome |
|-----|-----------|------------------|-------------|------------------|
| **Monday** | 🔴 Critical Items | • Process emergency POs for ${summary.criticalRisk} items<br>• Contact suppliers for expedited delivery<br>• Update SAP with new orders | Procurement | POs created |
| **Tuesday** | 📞 Supplier Follow-up | • Confirm delivery dates for critical items<br>• Negotiate expedited shipping<br>• Update ETA in system | Supply Chain | ETAs confirmed |
| **Wednesday** | 📊 Safety Stock Review | • Update SAP safety stock parameters<br>• Implement AI recommendations<br>• Review reorder points | Inventory Manager | Parameters updated |
| **Thursday** | 🌡️ Weather Monitoring | • Check storage conditions for ${summary.weatherSensitiveCount} items<br>• Verify humidity controls<br>• Document conditions | Warehouse | Conditions verified |
| **Friday** | 📈 Demand Forecast | • Review sales forecast with team<br>• Adjust projections based on AI insights<br>• Plan next week's orders | Planning Team | Forecast updated |
| **Saturday** | 📦 Receiving & QC | • Receive expedited deliveries<br>• Quality check incoming materials<br>• Update stock levels | Warehouse | Stock replenished |
| **Sunday** | 📊 Weekly Review | • Generate AI performance report<br>• Review KPIs and metrics<br>• Plan improvements | Management | Report ready |

---

### 10. 💰 COST IMPACT ANALYSIS

| Category | Current Annual Cost | With AI Optimization | Savings | ROI |
|----------|-------------------|---------------------|---------|-----|
| **Carrying Costs** | $125,000 | $98,000 | $27,000 | 22% |
| **Stockout Losses** | $45,000 | $12,000 | $33,000 | 73% |
| **Labor (Manual Tracking)** | $62,000 | $18,000 | $44,000 | 71% |
| **Overstock Write-offs** | $18,000 | $6,000 | $12,000 | 67% |
| **Emergency Orders** | $22,000 | $8,000 | $14,000 | 64% |
| **Data Entry Errors** | $15,000 | $3,000 | $12,000 | 80% |

**Total Annual Savings:** $142,000 | **AI System Cost:** $25,000/year | **Net Benefit:** $117,000/year

---

### 📌 KEY RECOMMENDATIONS

1. ✅ **Immediate:** Process emergency POs for ${summary.criticalRisk} critical items today
2. ✅ **This Week:** Implement AI-recommended safety stock adjustments
3. ✅ **Ongoing:** Maintain 98%+ data accuracy through automated SAP integration
4. ✅ **Monthly:** Review AI performance metrics and optimize parameters
5. ✅ **Training:** Ensure all staff trained on AI tools for maximum efficiency

---

### 🎓 SYSTEM BENEFITS REALIZED

**Time Efficiency:** AI automation saves 4.2 hours daily (84% reduction in manual tracking)
**Accuracy:** 85% reduction in data entry errors, 98.5% data accuracy maintained
**Cost Savings:** $142K annual savings through optimized inventory management
**Productivity:** 65% improvement in user productivity and task completion speed
**Decision Quality:** Real-time insights enable proactive vs reactive management

---

*🤖 AI-Powered Analysis | Demo Mode - Configure GEMINI_API_KEY for enhanced real-time AI insights*
*Last Updated: ${new Date().toLocaleString()} | Next Auto-Refresh: 5 minutes*`;
}

