# 🌿 LoRRI Carbon Intelligence AI

> A real-time, full-stack freight sustainability platform for shipment-level carbon tracking, route optimization, and ESG reporting.

---

## 🏗️ Project Structure

```
lorri-carbon/
├── frontend/          ← React app (deploy to Vercel/Netlify)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.js         ← Live KPIs + charts + AI insight
│   │   │   ├── Shipments.js         ← Live table, filter, sort, anomaly flag
│   │   │   ├── LaneHeatmap.js       ← Interactive 7-day heatmap
│   │   │   ├── RouteOptimizer.js    ← Real emission comparison engine
│   │   │   ├── EmissionCalculator.js← Formula-based CO₂ calculator
│   │   │   ├── ESGReport.js         ← ESG score, radar chart, progress
│   │   │   └── AnomalyFeed.js       ← Real-time anomaly detection feed
│   │   ├── components/
│   │   │   ├── Layout.js            ← Sidebar + Header shell
│   │   │   ├── KPICard.js           ← Reusable animated KPI card
│   │   │   └── AIInsightPanel.js    ← Gemini AI typewriter insight
│   │   └── utils/api.js             ← All API calls
└── backend/           ← Node.js Express API (deploy to Vercel/Railway)
    └── src/index.js   ← All endpoints + emission engine
```

---

## ⚡ Quick Start (Local)

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your GEMINI_API_KEY (free at https://aistudio.google.com)
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
# Create .env file:
echo "REACT_APP_API_URL=http://localhost:5000" > .env
npm start
# Runs on http://localhost:3000
```

---

## 🚀 Deploy to Vercel (Free)

### Backend
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import the `backend/` folder
3. Add environment variable: `GEMINI_API_KEY=your_key`
4. Deploy → copy the deployed URL (e.g. `https://lorri-backend.vercel.app`)

### Frontend
1. New Project → import `frontend/` folder
2. Add environment variable: `REACT_APP_API_URL=https://lorri-backend.vercel.app`
3. Deploy!

---

## 🔑 Get Free Gemini API Key

1. Go to https://aistudio.google.com
2. Click "Get API Key" → Create API Key
3. It's **completely free** with generous limits
4. Add to backend `.env` as `GEMINI_API_KEY=your_key_here`

> **Note:** The app works without a Gemini key too — it uses smart fallback AI responses.

---

## 🧠 Core Emission Formula

```
CO₂ (kg) = (Distance / 100) × BaseFuelPer100km × LoadMultiplier × EmissionFactor

Where:
  LoadMultiplier = 0.8 + loadFactor × 0.4
  EmissionFactor (kg CO₂/L):
    HCV-Diesel  → 2.68
    MCV-Diesel  → 2.31
    LCV-Diesel  → 1.98
    CNG-Truck   → 1.12
    HCV-BS6     → 2.45
    EV-Truck    → 0.22
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/dashboard` | Full dashboard data |
| GET | `/api/shipments` | Live shipments (25) |
| GET | `/api/lanes` | Lane analytics |
| GET | `/api/anomalies` | Anomaly feed |
| GET | `/api/esg` | ESG report data |
| POST | `/api/optimize-route` | Route optimizer |
| POST | `/api/calculate-emission` | Emission calculator |
| POST | `/api/ai-insight` | Gemini AI insight |

---

## ✨ Features

- **Real-time Dashboard** — KPIs auto-refresh every 5s
- **Live Shipment Table** — filter, sort, anomaly detection
- **Lane Heatmap** — 10 lanes × 7 days, interactive hover
- **Route Optimizer** — real formula-based comparison, history
- **Emission Calculator** — formula engine with vehicle factors
- **ESG Report** — radar chart, monthly trends, compliance
- **Anomaly Feed** — critical/warning/info with auto-refresh
- **AI Insights** — Gemini AI with typewriter effect + fallback

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Recharts, Framer Motion |
| Backend | Node.js, Express, CORS, Rate Limiting |
| AI | Google Gemini Pro (free tier) |
| Deployment | Vercel (both frontend + backend) |
| Styling | Custom CSS Design System (dark industrial) |
