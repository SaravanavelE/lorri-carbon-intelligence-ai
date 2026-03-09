import React, { useState } from 'react';
import { dashboardApi } from '../utils/api';
import { motion } from 'framer-motion';
import { 
  Zap, 
  MapPin, 
  Truck, 
  ArrowRight, 
  Leaf, 
  Navigation,
  Save
} from 'lucide-react';

export default function RouteOptimizer() {
  const [formData, setFormData] = useState({
    laneId: 'MUM-DEL',
    vehicleType: 'HCV-Diesel',
    loadFactor: 75
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await dashboardApi.optimizeRoute(formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 350px) 1fr', gap: '25px' }}>
      <div className="card">
        <h3 className="font-display" style={{ fontSize: '14px', marginBottom: '25px' }}>SIMULATION PARAMETERS</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', marginBottom: '8px' }}>LANE / CORRIDOR</label>
            <select 
              className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', background: 'var(--surface2)', color: 'var(--text)' }}
              value={formData.laneId}
              onChange={(e) => setFormData({...formData, laneId: e.target.value})}
            >
              <option value="MUM-DEL">Mumbai ↔ Delhi</option>
              <option value="DEL-BLR">Delhi ↔ Bangalore</option>
              <option value="MUM-CHN">Mumbai ↔ Chennai</option>
              <option value="BLR-HYD">Bangalore ↔ Hyderabad</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', marginBottom: '8px' }}>VEHICLE TYPE</label>
            <select 
              className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', background: 'var(--surface2)', color: 'var(--text)' }}
              value={formData.vehicleType}
              onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
            >
              <option value="HCV-Diesel">HCV Diesel (Heavy)</option>
              <option value="MCV-Diesel">MCV Diesel (Medium)</option>
              <option value="CNG-Truck">CNG Truck</option>
              <option value="EV-Truck">EV Truck (Electric)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', marginBottom: '8px' }}>LOAD FACTOR (%): {formData.loadFactor}%</label>
            <input 
              type="range" min="20" max="100" 
              style={{ width: '100%', accentColor: 'var(--green)' }}
              value={formData.loadFactor}
              onChange={(e) => setFormData({...formData, loadFactor: e.target.value})}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '14px', height: '14px' }}></div> : <><Zap size={14} /> CALCULATE OPTIMAL ROUTE</>}
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {result ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Comparison Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div className="card">
                <div className="badge amber" style={{ marginBottom: '15px' }}>CURRENT BASELINE</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text2)' }}>Distance</span>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{result.current.distance} km</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text2)' }}>Emissions</span>
                  <span style={{ fontSize: '18px', fontWeight: 800 }}>{result.current.co2Kg} <span style={{ fontSize: '11px' }}>kg</span></span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', fontSize: '10px', color: 'var(--muted)' }}>
                  {result.current.vehicle} @ {result.current.loadFactor*100}% load
                </div>
              </div>

              <div className="card" style={{ border: '1px solid var(--green)', boxShadow: 'var(--glow-green)' }}>
                <div className="badge green" style={{ marginBottom: '15px' }}>OPTIMIZED ROUTE</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text2)' }}>Distance</span>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{result.optimized.distance} km</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text2)' }}>Emissions</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green)' }}>{result.optimized.co2Kg} <span style={{ fontSize: '11px' }}>kg</span></span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', fontSize: '10px', color: 'var(--muted)' }}>
                  {result.optimized.vehicle} (Modal Shift)
                </div>
              </div>
            </div>

            {/* Insight Card */}
            <div className="card" style={{ background: 'linear-gradient(90deg, var(--surface), var(--surface2))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ 
                  width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0,255,136,0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)'
                }}>
                  <Leaf size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Potential Savings: <span className="text-green">-{result.savedCO2} kg CO₂ ({result.savingPercent}%)</span></h4>
                  <p style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '5px' }}>{result.recommendation}</p>
                </div>
                <button className="btn btn-primary">
                  <Save size={14} /> APPLY PLAN
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5, borderStyle: 'dashed' }}>
            <Navigation size={48} style={{ marginBottom: '20px' }} />
            <h4 className="font-display">ROUTE ENGINE IDLE</h4>
            <p style={{ fontSize: '11px', marginTop: '5px' }}>Configure parameters and run simulation to see results</p>
          </div>
        )}
      </div>
    </div>
  );
}
