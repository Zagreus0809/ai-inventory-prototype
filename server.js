const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const inventoryRoutes = require('./routes/inventory');
const aiRoutes = require('./routes/ai');
const weatherRoutes = require('./routes/weather');
const sapRoutes = require('./routes/sap-mock');
const RealTimeMonitor = require('./services/realtime-monitor');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/sap', sapRoutes);

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WebSocket connections
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Send initial data on connect
  socket.emit('connected', { 
    message: 'Real-time monitoring active',
    timestamp: new Date().toISOString()
  });

  socket.on('request-analysis', async (data) => {
    // Client can request immediate analysis
    const monitor = app.get('monitor');
    if (monitor) {
      await monitor.analyzeItem(data.materialNumber);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start real-time monitoring service
const monitor = new RealTimeMonitor(io, PORT);
app.set('monitor', monitor);

server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`AI Inventory Management - REAL-TIME`);
  console.log(`========================================`);
  console.log(`Dashboard: http://localhost:${PORT}`);
  console.log(`WebSocket: Real-time updates enabled`);
  console.log(`AI Monitor: Checking stock levels every 30s`);
  console.log(`========================================\n`);
  
  // Start monitoring after server is ready
  monitor.start();
});
