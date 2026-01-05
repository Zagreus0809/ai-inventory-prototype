// Real-Time Inventory Monitoring Service
// Monitors stock levels and only alerts when there are actual issues
// AI analysis is ON-DEMAND only (user clicks refresh)

const axios = require('axios');

class RealTimeMonitor {
  constructor(io, port) {
    this.io = io;
    this.port = port;
    this.baseUrl = `http://localhost:${port}`;
    this.checkInterval = 300000; // 5 minutes - just for stock status updates
    this.lastAlerts = new Map();
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    console.log('[Monitor] Stock monitoring active (checks every 5 min)');
    console.log('[Monitor] AI analysis: ON-DEMAND only (click Refresh in dashboard)');
    
    // Initial stock check after 5 seconds
    setTimeout(() => this.runMonitoringCycle(), 5000);
    
    // Regular stock monitoring - no automatic AI calls
    this.monitorTimer = setInterval(() => {
      this.runMonitoringCycle();
    }, this.checkInterval);
  }

  stop() {
    this.isRunning = false;
    if (this.monitorTimer) clearInterval(this.monitorTimer);
    console.log('[Monitor] Stopped');
  }

  async runMonitoringCycle() {
    try {
      // Fetch current stock and MRP data
      const [stockRes, mrpRes, weatherRes] = await Promise.all([
        axios.get(`${this.baseUrl}/api/sap/stock`).catch(() => ({ data: {} })),
        axios.get(`${this.baseUrl}/api/sap/mrp-analysis`).catch(() => ({ data: {} })),
        axios.get(`${this.baseUrl}/api/weather/current/Manila`).catch(() => ({ data: { temperature: 28, humidity: 70 } }))
      ]);

      const stockData = stockRes.data;
      const mrpData = mrpRes.data;
      const weather = weatherRes.data;

      // Only check for CRITICAL alerts (items that actually need attention)
      const alerts = this.checkForCriticalAlerts(stockData, mrpData);
      
      // Emit stock update to clients (no AI calls)
      this.io.emit('stock-update', {
        timestamp: new Date().toISOString(),
        summary: stockData.summary,
        mrpSummary: mrpData.summary,
        weather: weather,
        alerts: alerts
      });

    } catch (error) {
      console.error('[Monitor] Error:', error.message);
    }
  }

  checkForCriticalAlerts(stockData, mrpData) {
    const alerts = [];
    const now = Date.now();

    // Only alert for CRITICAL items (below safety stock)
    stockData.data?.forEach(item => {
      if (item.stockStatus === 'CRITICAL') {
        const alertKey = `stock-${item.materialNumber}`;
        
        // Throttle: only alert once per 10 minutes per item
        if (!this.shouldThrottle(alertKey, 600000)) {
          alerts.push({
            id: `${alertKey}-${now}`,
            type: 'stock',
            severity: 'critical',
            materialNumber: item.materialNumber,
            description: item.materialDescription,
            message: `⚠️ ${item.materialNumber} below safety stock (${item.unrestrictedStock.toLocaleString()} / ${item.safetyStock.toLocaleString()})`,
            currentStock: item.unrestrictedStock,
            safetyStock: item.safetyStock,
            timestamp: new Date().toISOString()
          });
          this.lastAlerts.set(alertKey, now);
        }
      }
    });

    // Alert for projected negative stock (shortage)
    mrpData.data?.forEach(item => {
      if (item.projectedStock < 0) {
        const alertKey = `mrp-${item.materialNumber}`;
        
        // Throttle: only alert once per 10 minutes per item
        if (!this.shouldThrottle(alertKey, 600000)) {
          alerts.push({
            id: `${alertKey}-${now}`,
            type: 'mrp',
            severity: 'critical',
            materialNumber: item.materialNumber,
            description: item.description,
            message: `🚨 ${item.materialNumber} projected shortage (${item.projectedStock.toLocaleString()} units)`,
            projectedStock: item.projectedStock,
            timestamp: new Date().toISOString()
          });
          this.lastAlerts.set(alertKey, now);
        }
      }
    });

    return alerts;
  }

  shouldThrottle(key, interval) {
    const lastTime = this.lastAlerts.get(key);
    if (!lastTime) return false;
    return (Date.now() - lastTime) < interval;
  }
}

module.exports = RealTimeMonitor;
