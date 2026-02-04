// AI Inventory Management - Dashboard (Vercel Compatible)
class InventoryApp {
    constructor() {
        this.stockData = [];
        this.mrpData = [];
        this.weatherData = null;
        this.alerts = [];
        this.init();
    }

    async init() {
        this.updateConnectionStatus('connected', 'Online');
        await this.loadAllData();
        await this.loadAIDashboardAnalysis();
        this.setupEventListeners();
        
        // Auto-refresh data every 5 minutes
        setInterval(() => this.loadAllData(), 300000);
    }

    updateConnectionStatus(status, text) {
        const el = document.getElementById('connectionStatus');
        if (el) {
            el.className = `connection-status ${status}`;
            el.querySelector('.status-text').textContent = text;
        }
    }

    // ============================================
    // MAIN AI DASHBOARD ANALYSIS
    // ============================================
    async loadAIDashboardAnalysis() {
        const container = document.getElementById('aiDashboardAnalysis');
        const statusBadge = document.getElementById('analysisStatus');
        
        if (statusBadge) statusBadge.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Analyzing...';
        
        if (container) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;"></div>
                    <h5>AI is analyzing your entire inventory...</h5>
                    <p class="text-muted mb-0">Evaluating ${this.stockData.length || 16} materials, demand patterns, and weather impact</p>
                </div>
            `;
        }

        try {
            const response = await fetch('/api/ai-analysis');
            const result = await response.json();
            
            if (statusBadge) {
                statusBadge.innerHTML = result.isMock ? 
                    '<i class="fas fa-circle text-warning me-1"></i>Demo Mode' :
                    '<i class="fas fa-circle text-success me-1"></i>AI Active';
            }

            if (container) {
                container.innerHTML = `
                    ${result.isMock ? `
                        <div class="alert alert-info m-3 py-2 small">
                            <i class="fas fa-info-circle me-1"></i>
                            <strong>Demo Mode:</strong> ${result.reason || 'Configure GEMINI_API_KEY for real AI'}
                        </div>
                    ` : ''}
                    <div class="ai-analysis-content p-3">
                        ${this.formatAnalysis(result.analysis)}
                    </div>
                    <div class="border-top p-2 bg-light small text-muted text-center">
                        <i class="fas fa-clock me-1"></i>
                        Last analyzed: ${new Date(result.timestamp).toLocaleString()}
                        <button class="btn btn-sm btn-link p-0 ms-3" onclick="app.refreshAIAnalysis()">
                            <i class="fas fa-sync-alt me-1"></i>Refresh
                        </button>
                    </div>
                `;
            }

        } catch (error) {
            console.error('AI Dashboard Analysis Error:', error);
            if (statusBadge) statusBadge.innerHTML = '<i class="fas fa-circle text-danger me-1"></i>Error';
            if (container) {
                container.innerHTML = `
                    <div class="alert alert-danger m-3">
                        <h6><i class="fas fa-exclamation-triangle me-2"></i>Analysis Failed</h6>
                        <p class="mb-0">${error.message}</p>
                        <button class="btn btn-sm btn-outline-danger mt-2" onclick="app.refreshAIAnalysis()">
                            <i class="fas fa-redo me-1"></i>Retry
                        </button>
                    </div>
                `;
            }
        }
    }

    async refreshAIAnalysis() {
        this.showNotification('Refreshing AI analysis...', 'info', 2000);
        await this.loadAIDashboardAnalysis();
    }

    formatAnalysis(text) {
        if (!text) return '<p class="text-muted">No analysis available</p>';
        
        // First, handle tables properly
        let formatted = text;
        
        // Split by lines to process tables
        const lines = formatted.split('\n');
        let inTable = false;
        let tableRows = [];
        let result = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Check if line is a table row
            if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
                // Check if it's a separator line
                if (line.includes('---')) {
                    continue; // Skip separator lines
                }
                
                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                }
                
                // Parse table row
                const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
                const isHeader = i === 0 || (tableRows.length === 0 && (
                    cells.some(c => c.includes('Material') || c.includes('Metric') || c.includes('Priority') || 
                                   c.includes('Day') || c.includes('Risk') || c.includes('Category'))
                ));
                const tag = isHeader ? 'th' : 'td';
                tableRows.push(`<tr>${cells.map(c => `<${tag} class="px-2 py-1">${c}</${tag}>`).join('')}</tr>`);
            } else {
                // Not a table line
                if (inTable) {
                    // End of table, output it
                    result.push('<div class="table-responsive"><table class="table table-sm table-bordered mb-3">');
                    result.push(tableRows.join('\n'));
                    result.push('</table></div>');
                    tableRows = [];
                    inTable = false;
                }
                result.push(line);
            }
        }
        
        // If still in table at end
        if (inTable && tableRows.length > 0) {
            result.push('<div class="table-responsive"><table class="table table-sm table-bordered mb-3">');
            result.push(tableRows.join('\n'));
            result.push('</table></div>');
        }
        
        formatted = result.join('\n');
        
        // Now apply other formatting
        return formatted
            .replace(/## (.*)/g, '<h4 class="analysis-header mt-4 mb-3">$1</h4>')
            .replace(/### (.*)/g, '<h5 class="analysis-subheader mt-3 mb-2">$1</h5>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/⚠️/g, '<span class="text-warning">⚠️</span>')
            .replace(/✅/g, '<span class="text-success">✅</span>')
            .replace(/🔴/g, '<span class="text-danger">🔴</span>')
            .replace(/🟡/g, '<span class="text-warning">🟡</span>')
            .replace(/🟢/g, '<span class="text-success">🟢</span>')
            .replace(/📊/g, '<i class="fas fa-chart-bar text-primary"></i>')
            .replace(/📅/g, '<i class="fas fa-calendar text-info"></i>')
            .replace(/🚨/g, '<i class="fas fa-exclamation-triangle text-danger"></i>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/---/g, '<hr class="my-3">');
    }

    // ============================================
    // DATA LOADING
    // ============================================
    async loadAllData() {
        try {
            await Promise.all([
                this.loadSAPStock(),
                this.loadMRPAnalysis(),
                this.loadWeather(),
                this.loadPurchaseOrders()
            ]);
            document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async loadSAPStock() {
        try {
            const response = await fetch('/api/sap-stock');
            const result = await response.json();
            this.stockData = result.data || [];
            this.renderStockTable();
            this.updateDashboardCards(result.summary);
        } catch (error) {
            console.error('Error loading stock:', error);
        }
    }

    async loadMRPAnalysis() {
        try {
            const response = await fetch('/api/sap-mrp');
            const result = await response.json();
            this.mrpData = result.data || [];
            this.renderMRPTable(result);
        } catch (error) {
            console.error('Error loading MRP:', error);
        }
    }

    async loadWeather() {
        try {
            const response = await fetch('/api/weather');
            this.weatherData = await response.json();
            this.renderWeatherWidget();
        } catch (error) {
            console.error('Error loading weather:', error);
        }
    }

    async loadPurchaseOrders() {
        try {
            const response = await fetch('/api/sap-orders?type=purchase');
            const result = await response.json();
            document.getElementById('openPOs').textContent = result.count || 0;
        } catch (error) {
            console.error('Error loading POs:', error);
        }
    }

    updateDashboardCards(summary) {
        if (!summary) return;
        document.getElementById('totalItems').textContent = summary.totalMaterials || 0;
        document.getElementById('criticalStock').textContent = summary.criticalItems || 0;
        document.getElementById('lowStock').textContent = summary.lowStockItems || 0;
        document.getElementById('okStock').textContent = summary.okItems || 0;
        document.getElementById('weatherSensitive').textContent = summary.weatherSensitiveItems || 0;
    }

    // ============================================
    // RENDERING
    // ============================================
    renderStockTable() {
        const tbody = document.getElementById('inventoryTable');
        if (!tbody) return;
        
        const filters = {
            group: document.getElementById('filterMaterialGroup')?.value || '',
            warehouse: document.getElementById('filterWarehouse')?.value || '',
            status: document.getElementById('filterStatus')?.value || '',
            search: (document.getElementById('searchMaterial')?.value || '').toLowerCase()
        };

        let filtered = this.stockData.filter(item => {
            if (filters.group && item.materialGroup !== filters.group) return false;
            if (filters.warehouse && item.storageLocation !== filters.warehouse) return false;
            if (filters.status && item.stockStatus !== filters.status) return false;
            if (filters.search && !item.materialNumber.toLowerCase().includes(filters.search) && 
                !item.materialDescription?.toLowerCase().includes(filters.search)) return false;
            return true;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No materials found</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(item => {
            const statusClass = item.stockStatus === 'CRITICAL' ? 'critical' : 
                               item.stockStatus === 'LOW' ? 'low' : 'ok';
            const rowClass = item.stockStatus === 'CRITICAL' ? 'status-critical' : 
                            item.stockStatus === 'LOW' ? 'status-low' : '';
            const stockPercent = Math.round((item.unrestrictedStock / item.safetyStock) * 100);
            const progressColor = stockPercent < 100 ? 'danger' : stockPercent < 150 ? 'warning' : 'success';
            
            return `
                <tr class="${rowClass}" data-material="${item.materialNumber}">
                    <td>
                        <strong class="text-primary">${item.materialNumber}</strong>
                        ${item.weatherSensitivity?.humiditySensitive ? '<i class="fas fa-thermometer-half text-info ms-1" title="Weather Sensitive"></i>' : ''}
                    </td>
                    <td>
                        <div class="text-truncate" style="max-width: 180px;">${item.materialDescription || '-'}</div>
                        <small class="text-muted">${item.storageLocation}</small>
                    </td>
                    <td class="text-end">
                        <div class="fw-bold">${item.unrestrictedStock?.toLocaleString()}</div>
                        <div class="progress" style="height: 4px; width: 50px; margin-left: auto;">
                            <div class="progress-bar bg-${progressColor}" style="width: ${Math.min(stockPercent, 100)}%"></div>
                        </div>
                    </td>
                    <td class="text-end text-muted">${item.safetyStock?.toLocaleString()}</td>
                    <td class="text-center">
                        <span class="status-badge ${statusClass}">
                            ${item.stockStatus === 'CRITICAL' ? '🔴' : item.stockStatus === 'LOW' ? '🟡' : '🟢'}
                            ${item.stockStatus}
                        </span>
                    </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-primary" onclick="app.showItemDetail('${item.materialNumber}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderMRPTable(result) {
        const tbody = document.getElementById('mrpTable');
        if (!tbody) return;
        
        const data = result.data || [];
        
        const sorted = [...data].sort((a, b) => {
            const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
            return (order[a.riskLevel] || 4) - (order[b.riskLevel] || 4);
        });

        tbody.innerHTML = sorted.slice(0, 8).map(item => {
            const riskColors = { CRITICAL: 'danger', HIGH: 'warning', MEDIUM: 'info', LOW: 'success' };
            return `
                <tr>
                    <td><small class="fw-bold">${item.materialNumber}</small></td>
                    <td class="text-end">${item.currentStock?.toLocaleString()}</td>
                    <td class="text-end text-success">+${(item.incomingSupply || 0).toLocaleString()}</td>
                    <td class="text-end text-danger">-${(item.openDemand || 0).toLocaleString()}</td>
                    <td class="text-end fw-bold ${item.projectedStock < item.safetyStock ? 'text-danger' : ''}">
                        ${item.projectedStock?.toLocaleString()}
                    </td>
                    <td class="text-center">
                        <span class="badge bg-${riskColors[item.riskLevel] || 'secondary'}">${item.riskLevel}</span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderWeatherWidget() {
        const widget = document.getElementById('weatherWidget');
        if (!widget) return;
        
        if (!this.weatherData) {
            widget.innerHTML = `<div class="text-center py-3 text-white"><i class="fas fa-cloud fa-2x opacity-50"></i><div class="small mt-2">Weather unavailable</div></div>`;
            return;
        }

        const w = this.weatherData;
        const humidityWarning = w.humidity > 70;
        
        widget.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="weather-temp">${w.temperature}°</div>
                    <div class="weather-condition">${w.condition}</div>
                    <small class="opacity-75"><i class="fas fa-map-marker-alt me-1"></i>${w.city}</small>
                </div>
                <i class="fas fa-cloud-sun fa-3x opacity-50"></i>
            </div>
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="weather-detail-value">${w.humidity}% ${humidityWarning ? '⚠️' : ''}</div>
                    <div class="weather-detail-label">Humidity</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-value">${w.windSpeed} km/h</div>
                    <div class="weather-detail-label">Wind</div>
                </div>
            </div>
        `;
    }

    renderAlertsPanel() {
        const container = document.getElementById('alertsPanel');
        if (!container) return;
        
        if (this.alerts.length === 0) {
            container.innerHTML = `<div class="text-center text-muted py-3"><i class="fas fa-check-circle text-success fa-2x mb-2"></i><div class="small">No alerts</div></div>`;
            return;
        }

        container.innerHTML = this.alerts.slice(0, 8).map(alert => `
            <div class="alert-item ${alert.severity === 'warning' ? 'warning' : ''}">
                <i class="fas fa-${alert.severity === 'critical' ? 'exclamation-circle text-danger' : 'exclamation-triangle text-warning'} me-2"></i>
                <small>${alert.message}</small>
            </div>
        `).join('');
    }

    // ============================================
    // ITEM DETAIL
    // ============================================
    showItemDetail(materialNumber) {
        const item = this.stockData.find(i => i.materialNumber === materialNumber);
        const mrpItem = this.mrpData.find(i => i.materialNumber === materialNumber);
        if (!item) return;

        const modal = new bootstrap.Modal(document.getElementById('aiAnalysisModal'));
        const content = document.getElementById('aiAnalysisContent');
        
        const stockPercent = Math.round((item.unrestrictedStock / item.safetyStock) * 100);
        const progressColor = stockPercent < 100 ? 'danger' : stockPercent < 150 ? 'warning' : 'success';

        content.innerHTML = `
            <div class="row g-3">
                <div class="col-md-6">
                    <h6 class="text-primary"><i class="fas fa-box me-2"></i>Material Information</h6>
                    <table class="table table-sm">
                        <tr><td class="text-muted">Material #</td><td><strong>${item.materialNumber}</strong></td></tr>
                        <tr><td class="text-muted">Description</td><td>${item.materialDescription}</td></tr>
                        <tr><td class="text-muted">Category</td><td>${item.materialGroup}</td></tr>
                        <tr><td class="text-muted">Warehouse</td><td>${item.storageLocation}</td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6 class="text-primary"><i class="fas fa-chart-bar me-2"></i>Stock Status</h6>
                    <div class="mb-2">
                        <div class="d-flex justify-content-between small">
                            <span>Stock Health</span>
                            <span class="fw-bold">${stockPercent}%</span>
                        </div>
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar bg-${progressColor}" style="width: ${Math.min(stockPercent, 100)}%"></div>
                        </div>
                    </div>
                    <table class="table table-sm">
                        <tr><td class="text-muted">Current Stock</td><td class="text-end fw-bold">${item.unrestrictedStock?.toLocaleString()}</td></tr>
                        <tr><td class="text-muted">Safety Stock</td><td class="text-end">${item.safetyStock?.toLocaleString()}</td></tr>
                        <tr><td class="text-muted">Reorder Point</td><td class="text-end">${item.reorderPoint?.toLocaleString()}</td></tr>
                        <tr><td class="text-muted">Status</td><td class="text-end"><span class="badge bg-${progressColor}">${item.stockStatus}</span></td></tr>
                    </table>
                </div>
            </div>
            ${mrpItem ? `
            <div class="mt-3 p-3 bg-light rounded">
                <h6><i class="fas fa-chart-line me-2"></i>Supply & Demand</h6>
                <div class="row text-center">
                    <div class="col-3">
                        <div class="fw-bold">${mrpItem.currentStock?.toLocaleString()}</div>
                        <small class="text-muted">Current</small>
                    </div>
                    <div class="col-3">
                        <div class="fw-bold text-success">+${mrpItem.incomingSupply?.toLocaleString()}</div>
                        <small class="text-muted">Incoming</small>
                    </div>
                    <div class="col-3">
                        <div class="fw-bold text-danger">-${mrpItem.openDemand?.toLocaleString()}</div>
                        <small class="text-muted">Demand</small>
                    </div>
                    <div class="col-3">
                        <div class="fw-bold ${mrpItem.projectedStock < item.safetyStock ? 'text-danger' : ''}">${mrpItem.projectedStock?.toLocaleString()}</div>
                        <small class="text-muted">Projected</small>
                    </div>
                </div>
            </div>
            ` : ''}
        `;
        
        modal.show();
    }

    // ============================================
    // UTILITIES
    // ============================================
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const id = `notif-${Date.now()}`;
        const icons = { success: 'check-circle', danger: 'exclamation-circle', warning: 'exclamation-triangle', info: 'info-circle' };
        
        container.insertAdjacentHTML('beforeend', `
            <div id="${id}" class="toast show align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body"><i class="fas fa-${icons[type]} me-2"></i>${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.closest('.toast').remove()"></button>
                </div>
            </div>
        `);
        setTimeout(() => document.getElementById(id)?.remove(), duration);
    }

    setupEventListeners() {
        ['filterMaterialGroup', 'filterWarehouse', 'filterStatus'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => this.renderStockTable());
        });
        document.getElementById('searchMaterial')?.addEventListener('input', () => this.renderStockTable());
    }

    refreshData() {
        this.loadAllData();
        this.showNotification('Data refreshed', 'success', 2000);
    }

    showHelp() { 
        const modal = document.getElementById('helpModal');
        if (modal) new bootstrap.Modal(modal).show(); 
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.app = new InventoryApp();
});
