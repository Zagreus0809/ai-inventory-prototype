# Vercel Deployment Guide

## Current Deployment
🌐 **Live URL:** https://ai-inventory-prototype.vercel.app

## Setup Instructions

### 1. Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

```
GEMINI_API_KEY=AIzaSyC7bpJ_cjj1detphF7ID0FxdUjnCxNA1tA
```

**How to add:**
1. Go to https://vercel.com/dashboard
2. Select your project: `ai-inventory-prototype`
3. Go to Settings → Environment Variables
4. Add the variable above
5. Click "Save"
6. Redeploy the project

### 2. Vercel Configuration

The `vercel.json` file configures:
- API routes as serverless functions
- Static file serving from `/public`
- Function memory and timeout settings

### 3. API Endpoints

#### Serverless Functions (Vercel):
- `/api/ai-analysis` - AI dashboard analysis
- `/api/sap-stock` - Stock data
- `/api/sap-mrp` - MRP analysis
- `/api/sap-orders` - Purchase/Sales orders
- `/api/weather` - Weather data

#### Express Routes (Local Development):
- `/api/ai/dashboard-analysis` - AI analysis
- `/api/sap/*` - SAP data
- `/api/weather/*` - Weather data
- `/api/csv/*` - CSV import

### 4. Dual Mode Support

The app automatically detects if it's running on Vercel or locally:

```javascript
// Frontend automatically uses correct endpoint
const endpoint = window.location.hostname.includes('vercel.app') 
    ? '/api/ai-analysis'  // Vercel
    : '/api/ai/dashboard-analysis';  // Local
```

## Deployment Process

### Automatic Deployment
Every push to `main` branch triggers automatic deployment on Vercel.

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Troubleshooting

### Issue: "Serverless Function has crashed"
**Cause:** Module export syntax mismatch
**Solution:** Use `module.exports` instead of `export default`

### Issue: "404 Not Found" for API
**Cause:** Route not configured in vercel.json
**Solution:** Add route to `rewrites` section

### Issue: "GEMINI_API_KEY not found"
**Cause:** Environment variable not set in Vercel
**Solution:** Add in Vercel dashboard → Settings → Environment Variables

### Issue: CSV Import not working
**Cause:** File upload requires different handling in serverless
**Solution:** CSV import works locally, use mock data on Vercel for demo

## Features Available on Vercel

✅ **Working:**
- AI Dashboard Analysis (with Gemini AI)
- Stock Overview
- MRP Analysis  
- Weather Integration
- Real-time Alerts
- Material Details
- All viewing and analysis features

❌ **Not Available (Serverless Limitations):**
- CSV Import (requires file system - use local development)
- WebSocket real-time updates (use local development)

**Note:** CSV Import button is automatically hidden on Vercel deployment.

## Local Development

For full features including CSV import and WebSockets:

```bash
npm install
npm start
# Open http://localhost:3001
```

## Architecture

### Vercel (Production):
```
Frontend (Static) → Serverless Functions → Mock Data
```

### Local (Development):
```
Frontend → Express Server → Mock Data / Real SAP
```

## Performance

- **Cold Start:** ~1-2 seconds
- **Warm Response:** ~200-500ms
- **Function Memory:** 1024 MB
- **Max Duration:** 10 seconds

## Monitoring

View logs in Vercel dashboard:
1. Go to your project
2. Click "Deployments"
3. Select latest deployment
4. Click "View Function Logs"

## Cost

- **Free Tier:** 100GB bandwidth, 100 hours serverless execution
- **Current Usage:** Well within free tier limits

## Next Steps

1. ✅ Add GEMINI_API_KEY to Vercel environment variables
2. ✅ Verify deployment at https://ai-inventory-prototype.vercel.app
3. ✅ Test AI analysis functionality
4. ✅ Share link for thesis demonstration

## Support

If issues persist:
1. Check Vercel function logs
2. Verify environment variables are set
3. Ensure latest code is deployed
4. Test locally first with `npm start`

---

**Note:** For thesis demonstration, the Vercel deployment provides a professional, publicly accessible demo. For full features including CSV import, use local development.
