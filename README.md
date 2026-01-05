# AI-Powered Inventory Management - Real-Time Prototype
## SAP ERP Integration for TDK Philippines

shh: AIzaSyD_uNeywdf_ql1Z1T1kR2obgGRtkRdcegg

Academic thesis prototype demonstrating **real-time AI monitoring** of inventory safety stock levels using Google Gemini, with SAP-style data and weather context.

## Key Features

### Real-Time Monitoring
- **WebSocket Connection**: Live updates every 30 seconds
- **Automatic AI Analysis**: Triggers when stock reaches critical levels
- **Instant Alerts**: Visual and audio notifications for stock issues
- **Weather Impact Alerts**: Monitors humidity/temperature for sensitive components

### SAP ERP Mock System
- 16 TDK electronics components (capacitors, inductors, sensors)
- SAP-style transactions: MB52, MD04, ME2M, VA05
- Purchase orders, sales orders, goods movements
- MRP analysis with projected stock calculations

### AI Integration (Google Gemini)
- Automatic safety stock analysis for critical items
- Weather-aware recommendations
- Risk scoring and action items
- Works with mock data when API unavailable

## Quick Start

```bash
cd ai-inventory-prototype
npm install
npm start
```

Access: http://localhost:3000

The system will:
1. Connect via WebSocket for real-time updates
2. Monitor stock levels every 30 seconds
3. Automatically trigger AI analysis for critical items
4. Show alerts when stock falls below safety levels

## Real-Time Features

### Automatic Monitoring
- Stock levels checked every 30 seconds
- AI analysis runs every 2 minutes for critical items
- Weather impact assessed for sensitive components

### Alert Types
| Alert | Trigger | Action |
|-------|---------|--------|
| CRITICAL | Stock ≤ Safety Stock | Immediate AI analysis |
| LOW | Stock ≤ Reorder Point | Warning notification |
| WEATHER | Humidity > threshold | Storage recommendation |
| MRP | Projected stock < 0 | Shortage warning |

### Simulation Mode
Test real-time alerts by simulating stock consumption:
```bash
# Start simulation (consumes random stock every 10s)
curl -X POST http://localhost:3000/api/sap/simulate/start

# Stop simulation
curl -X POST http://localhost:3000/api/sap/simulate/stop

# Reset stock levels
curl -X POST http://localhost:3000/api/sap/simulate/reset
```

## API Endpoints

### Real-Time (WebSocket Events)
| Event | Direction | Description |
|-------|-----------|-------------|
| `stock-update` | Server→Client | Stock level updates |
| `ai-analysis` | Server→Client | AI analysis results |
| `request-analysis` | Client→Server | Request manual analysis |

### REST APIs
| Endpoint | Description |
|----------|-------------|
| GET /api/sap/stock | Current stock levels |
| GET /api/sap/mrp-analysis | MRP with projections |
| POST /api/ai/analyze-safety-stock | AI analysis |

## Environment Variables

```env
GEMINI_API_KEY=your_key_here    # Optional - uses mock if not set
WEATHER_API_KEY=your_key_here   # Optional - uses mock if not set
PORT=3000
```

## For Thesis Demonstration

1. Start the server and open dashboard
2. Observe real-time connection status (green = live)
3. Watch automatic stock updates every 30 seconds
4. Click "AI Analysis" on any item for detailed recommendations
5. Use simulation to trigger critical alerts
6. Show automatic AI analysis when stock becomes critical

## Architecture

```
┌─────────────────┐     WebSocket      ┌─────────────────┐
│   Dashboard     │◄──────────────────►│   Server        │
│   (Browser)     │                    │   (Node.js)     │
└─────────────────┘                    └────────┬────────┘
                                                │
                    ┌───────────────────────────┼───────────────────────────┐
                    │                           │                           │
              ┌─────▼─────┐              ┌──────▼──────┐             ┌──────▼──────┐
              │ SAP Mock  │              │ AI Service  │             │  Weather    │
              │ (Stock)   │              │ (Gemini)    │             │  Service    │
              └───────────┘              └─────────────┘             └─────────────┘
```

---
*Real-Time AI Inventory Monitoring - Academic Thesis Prototype*
*TDK Philippines - Safety Stock Analysis with Google Gemini*
