import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import LaneHeatmap from "./pages/LaneHeatmap";
import RouteOptimizer from "./pages/RouteOptimizer";
import EmissionCalculator from "./pages/EmissionCalculator";
import ESGReport from "./pages/ESGReport";
import AnomalyFeed from "./pages/AnomalyFeed";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="shipments" element={<Shipments />} />
          <Route path="heatmap" element={<LaneHeatmap />} />
          <Route path="optimizer" element={<RouteOptimizer />} />
          <Route path="calculator" element={<EmissionCalculator />} />
          <Route path="esg" element={<ESGReport />} />
          <Route path="anomalies" element={<AnomalyFeed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
