require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors({ origin: "*" }));
app.use(express.json());

// Rate limiter for AI endpoint
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Too many AI requests. Please wait a moment." },
});

// ── Gemini AI setup ──
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ══════════════════════════════════════════
//  DATA ENGINE — shipment + emission logic
// ══════════════════════════════════════════

const EMISSION_FACTORS = {
  "HCV-Diesel": 2.68,
  "MCV-Diesel": 2.31,
  "LCV-Diesel": 1.98,
  "CNG-Truck":  1.12,
  "EV-Truck":   0.22,
  "HCV-BS6":    2.45,
};

const LANES = [
  { id: "MUM-DEL", from: "Mumbai", to: "Delhi", distance: 1421, baseLoad: 0.78 },
  { id: "DEL-BLR", from: "Delhi", to: "Bangalore", distance: 2147, baseLoad: 0.65 },
  { id: "MUM-CHN", from: "Mumbai", to: "Chennai", distance: 1338, baseLoad: 0.82 },
  { id: "BLR-HYD", from: "Bangalore", to: "Hyderabad", distance: 569, baseLoad: 0.71 },
  { id: "KOL-PAT", from: "Kolkata", to: "Patna", distance: 577, baseLoad: 0.60 },
  { id: "CHN-MUM", from: "Chennai", to: "Mumbai", distance: 1338, baseLoad: 0.75 },
  { id: "DEL-KOL", from: "Delhi", to: "Kolkata", distance: 1474, baseLoad: 0.68 },
  { id: "HYD-BLR", from: "Hyderabad", to: "Bangalore", distance: 569, baseLoad: 0.72 },
  { id: "JAI-MUM", from: "Jaipur", to: "Mumbai", distance: 1148, baseLoad: 0.55 },
  { id: "AMD-DEL", from: "Ahmedabad", to: "Delhi", distance: 935, baseLoad: 0.63 },
];

const VEHICLE_TYPES = Object.keys(EMISSION_FACTORS);

// Core emission formula: CO2 = (Distance × Load × FuelConsumptionRate) × EmissionFactor
function calculateEmission(distanceKm, vehicleType, loadFactor = 0.75, anomalyMultiplier = 1.0) {
  const ef = EMISSION_FACTORS[vehicleType] || 2.31;
  const baseFuelPer100km = vehicleType.includes("HCV") ? 35 : vehicleType.includes("MCV") ? 25 : vehicleType === "CNG-Truck" ? 18 : vehicleType === "EV-Truck" ? 0 : 20;
  const fuelUsed = (distanceKm / 100) * baseFuelPer100km * (0.8 + loadFactor * 0.4) * anomalyMultiplier;
  const co2kg = fuelUsed * ef;
  const sustainabilityScore = co2kg < 100 ? "A" : co2kg < 250 ? "B" : co2kg < 450 ? "C" : "D";
  return {
    fuelUsed: Math.round(fuelUsed * 10) / 10,
    co2Kg: Math.round(co2kg * 10) / 10,
    sustainabilityScore,
    emissionFactor: ef,
  };
}

function generateShipments(count = 20) {
  const statuses = ["In Transit", "Loading", "Delayed", "Delivered", "Idle"];
  return Array.from({ length: count }, (_, i) => {
    const lane = LANES[Math.floor(Math.random() * LANES.length)];
    const vehicle = VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
    const loadFactor = 0.4 + Math.random() * 0.6;
    const anomaly = Math.random() > 0.85 ? 1.2 + Math.random() * 0.4 : 1.0;
    const emission = calculateEmission(lane.distance, vehicle, loadFactor, anomaly);
    return {
      id: `SHP${String(100000 + i + Math.floor(Math.random() * 9000)).slice(0, 8)}`,
      lane: lane.id,
      from: lane.from,
      to: lane.to,
      distance: lane.distance,
      vehicle,
      loadFactor: Math.round(loadFactor * 100),
      ...emission,
      anomaly: anomaly > 1.0,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    };
  });
}

function generateLaneAnalytics() {
  return LANES.map((lane) => {
    const shipmentCount = 5 + Math.floor(Math.random() * 30);
    const avgLoad = lane.baseLoad + (Math.random() - 0.5) * 0.2;
    const dominantVehicle = VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
    const emission = calculateEmission(lane.distance, dominantVehicle, avgLoad);
    const totalCO2 = emission.co2Kg * shipmentCount;
    const riskLevel = totalCO2 > 15000 ? "critical" : totalCO2 > 8000 ? "high" : totalCO2 > 4000 ? "medium" : "low";
    return {
      ...lane,
      shipmentCount,
      avgLoadFactor: Math.round(avgLoad * 100),
      avgCO2PerShipment: emission.co2Kg,
      totalCO2: Math.round(totalCO2),
      riskLevel,
      dominantVehicle,
      trend: (Math.random() - 0.4) * 20,
    };
  });
}

function generateTrend(hours = 24) {
  const points = [];
  let base = 140;
  for (let i = hours; i >= 0; i--) {
    base += (Math.random() - 0.5) * 8;
    base = Math.max(100, Math.min(200, base));
    points.push({
      hour: i === 0 ? "Now" : `${i}h ago`,
      actual: Math.round(base * 10) / 10,
      optimized: Math.round((base * 0.86) * 10) / 10,
    });
  }
  return points;
}

function generateForecast() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let base = 143;
  return days.map((day, i) => {
    base += (Math.random() - 0.48) * 12;
    base = Math.max(110, Math.min(180, base));
    return {
      day,
      forecast: Math.round(base * 10) / 10,
      lower: Math.round((base * 0.93) * 10) / 10,
      upper: Math.round((base * 1.07) * 10) / 10,
      isToday: i === 0,
    };
  });
}

function generateAnomalies() {
  const vehicles = ["TN-09-AA-4821", "DL-1C-BA-7823", "MH-12-DE-3301", "KA-05-FG-9012", "UP-32-BC-4457"];
  const events = [
    { level: "critical", msg: `Vehicle ${vehicles[0]} fuel usage 38% above baseline on Chennai–Bangalore lane`, minutesAgo: 2 },
    { level: "critical", msg: "Lane MUM-DEL: 6 consecutive shipments exceeding CO₂ threshold (>420 kg)", minutesAgo: 7 },
    { level: "warning", msg: "Predicted emission spike on DEL-KOL corridor — weather-related routing issue", minutesAgo: 14 },
    { level: "critical", msg: `Vehicle ${vehicles[1]} engine anomaly detected — 52% emission increase`, minutesAgo: 21 },
    { level: "warning", msg: "Load factor drop on AMD-DEL lane: 3 vehicles running at <40% capacity", minutesAgo: 28 },
    { level: "info", msg: "ML model updated: emission factor recalibrated for BS6 diesel fleet (+2.1% accuracy)", minutesAgo: 35 },
    { level: "warning", msg: "Fuel station data lag on KOL-PAT — estimation mode active for 4 vehicles", minutesAgo: 42 },
    { level: "info", msg: `Green routing saved 4.2t CO₂ this hour across ${Math.floor(Math.random()*20+10)} shipments`, minutesAgo: 55 },
  ];
  return events;
}

// ══════════════════════════════════════════
//  ROUTES
// ══════════════════════════════════════════

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// Dashboard summary
app.get("/api/dashboard", (req, res) => {
  const shipments = generateShipments(30);
  const totalCO2 = shipments.reduce((s, sh) => s + sh.co2Kg, 0) / 1000;
  const highEmissionLanes = generateLaneAnalytics().filter((l) => l.riskLevel === "critical" || l.riskLevel === "high").length;
  res.json({
    kpis: {
      totalCO2Today: Math.round(totalCO2 * 10) / 10,
      activeShipments: 2800 + Math.floor(Math.random() * 100),
      highEmissionLanes,
      emissionSavedMTD: Math.round((38 + Math.random() * 4) * 10) / 10,
      esgScore: Math.round(72 + Math.random() * 5),
      offsetCredits: Math.floor(1200 + Math.random() * 100),
    },
    trend: generateTrend(24),
    forecast: generateForecast(),
    lanes: generateLaneAnalytics(),
    shipments: generateShipments(20),
    anomalies: generateAnomalies(),
    fleetBreakdown: {
      "HCV-Diesel": 38,
      "MCV-Diesel": 28,
      CNG: 18,
      "LCV-Diesel": 12,
      EV: 4,
    },
  });
});

// Live shipments refresh
app.get("/api/shipments", (req, res) => {
  res.json({ shipments: generateShipments(25), timestamp: new Date().toISOString() });
});

// Lane analytics
app.get("/api/lanes", (req, res) => {
  res.json({ lanes: generateLaneAnalytics() });
});

// Route optimizer
app.post("/api/optimize-route", (req, res) => {
  const { laneId, vehicleType, loadFactor } = req.body;
  const lane = LANES.find((l) => l.id === laneId) || LANES[0];
  const vt = vehicleType || "HCV-Diesel";
  const lf = parseFloat(loadFactor) || 0.75;

  const current = calculateEmission(lane.distance, vt, lf, 1.0);
  const altVehicle = vt === "HCV-Diesel" ? "HCV-BS6" : vt === "MCV-Diesel" ? "CNG-Truck" : "EV-Truck";
  const optimized = calculateEmission(lane.distance * 0.97, altVehicle, Math.min(lf + 0.1, 1.0), 1.0);

  const savedCO2 = current.co2Kg - optimized.co2Kg;
  const savingPct = ((savedCO2 / current.co2Kg) * 100).toFixed(1);

  res.json({
    lane,
    current: { ...current, vehicle: vt, distance: lane.distance, loadFactor: lf },
    optimized: { ...optimized, vehicle: altVehicle, distance: Math.round(lane.distance * 0.97), loadFactor: Math.min(lf + 0.1, 1.0) },
    savedCO2: Math.round(savedCO2 * 10) / 10,
    savingPercent: savingPct,
    recommendation: savedCO2 > 0
      ? `Switch to ${altVehicle} + consolidate load for ${savingPct}% CO₂ reduction`
      : "Current configuration is near optimal",
  });
});

// Emission calculator
app.post("/api/calculate-emission", (req, res) => {
  const { distanceKm, vehicleType, loadFactor } = req.body;
  if (!distanceKm || !vehicleType) return res.status(400).json({ error: "distanceKm and vehicleType required" });
  const result = calculateEmission(parseFloat(distanceKm), vehicleType, parseFloat(loadFactor) || 0.75);
  res.json(result);
});

// ── AI Insight with Gemini ──
app.post("/api/ai-insight", aiLimiter, async (req, res) => {
  const { context } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    // Fallback insights when no key provided
    const fallbacks = [
      "Detected anomalous fuel usage on Mumbai–Delhi corridor (23% above baseline). Recommending NH-48 via Ahmedabad bypass for 11.3t CO₂ reduction. 3 vehicles flagged for maintenance review.",
      "Time-series forecast indicates 15.2% emission spike next Tuesday. Proactive load consolidation on DEL-BLR lane can offset 8.4t CO₂. Consider modal shift to rail for long-haul segments.",
      "Fleet segment analysis: 3 Heavy Diesel vehicles flagged for engine performance degradation. Maintenance intervention could reduce emissions by 6.2t monthly. EV transition ROI: 22 months.",
      "Carbon credit optimization: Current trajectory enables generation of 340 additional offset credits this quarter. Route 12 shipments via green corridors to maximize credit yield.",
    ];
    return res.json({ insight: fallbacks[Math.floor(Math.random() * fallbacks.length)], source: "fallback" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are LoRRI Carbon Intelligence AI, a freight sustainability expert. 
Analyze this logistics emission data and give ONE concise, actionable insight in 2-3 sentences:
${JSON.stringify(context || {}, null, 2)}

Focus on: emission anomalies, optimization opportunities, ESG impact. Be specific with numbers.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ insight: text, source: "gemini" });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.json({ insight: "Analyzing patterns... High-emission cluster detected on 3 lanes. Recommend load consolidation and BS6 fleet reallocation for 12–15% emission reduction.", source: "fallback" });
  }
});

// Anomaly feed
app.get("/api/anomalies", (req, res) => {
  res.json({ anomalies: generateAnomalies() });
});

// ESG report data
app.get("/api/esg", (req, res) => {
  res.json({
    score: Math.round(72 + Math.random() * 5),
    grade: "B+",
    targets: [
      { name: "Carbon Neutral (2030)", progress: 34, color: "green" },
      { name: "Emission Reduction vs 2023", progress: 18, color: "blue" },
      { name: "Green Fleet Transition", progress: 12, color: "amber" },
      { name: "ESG Reporting Automation", progress: 87, color: "green" },
    ],
    offsetCredits: Math.floor(1200 + Math.random() * 100),
    monthlyReduction: [8.2, 9.1, 11.4, 10.8, 13.2, 14.1],
    complianceRate: Math.round(85 + Math.random() * 5),
  });
});

app.listen(PORT, () => console.log(`✅ LoRRI Carbon API running on port ${PORT}`));
