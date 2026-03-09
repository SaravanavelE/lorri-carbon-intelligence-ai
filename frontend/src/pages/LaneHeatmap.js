import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Thermometer, Clock } from 'lucide-react';

export default function LaneHeatmap() {
  const [lanes, setLanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredLane, setHoveredLane] = useState(null);

  useEffect(() => {
    fetchLanes();
  }, []);

  const fetchLanes = async () => {
    try {
      const res = await dashboardApi.getLanes();
      setLanes(res.data.lanes);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getHeatColor = (risk) => {
    if (risk === 'critical') return '#ff4444';
    if (risk === 'high') return '#ffaa00';
    if (risk === 'medium') return '#00cfff';
    return '#00ff88';
  };

  if (loading) return <div className="spinner" style={{ margin: '100px auto' }}></div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '25px' }}>
      <div className="card">
        <h3 className="font-display" style={{ fontSize: '14px', marginBottom: '30px', textTransform: 'uppercase' }}>
          7-Day Lane Emission Volatility Heatmap
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', marginLeft: '120px' }}>
            {days.map(d => (
              <div key={d} style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: 'var(--muted)', fontWeight: 600 }}>{d}</div>
            ))}
          </div>

          {lanes.map(lane => (
            <div key={lane.id} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '105px', fontSize: '11px', fontWeight: 600, color: 'var(--text2)' }}>
                {lane.id}
              </div>
              <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
                {days.map((d, i) => {
                  // Simulate daily variation
                  const riskVar = i % 3 === 0 ? lane.riskLevel : i % 2 === 0 ? 'high' : 'low';
                  return (
                    <motion.div
                      key={d}
                      whileHover={{ scale: 1.15, zIndex: 10 }}
                      onHoverStart={() => setHoveredLane({ ...lane, day: d, risk: riskVar })}
                      onHoverEnd={() => setHoveredLane(null)}
                      style={{ 
                        flex: 1, height: '32px', borderRadius: '4px',
                        background: getHeatColor(riskVar),
                        opacity: riskVar === 'critical' ? 1 : riskVar === 'high' ? 0.7 : riskVar === 'medium' ? 0.4 : 0.15,
                        cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
          {['low', 'medium', 'high', 'critical'].map(r => (
            <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>
              <div style={{ width: '12px', height: '12px', background: getHeatColor(r), borderRadius: '2px', opacity: r === 'low' ? 0.15 : 1 }}></div>
              {r}
            </div>
          ))}
        </div>
      </div>

      <div>
        <AnimatePresence mode="wait">
          {hoveredLane ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="card" 
              style={{ borderLeft: `4px solid ${getHeatColor(hoveredLane.risk)}` }}
            >
              <h4 style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '10px' }}>LANE INSIGHT</h4>
              <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>{hoveredLane.id} <span style={{ color: 'var(--green)', fontSize: '12px' }}>{hoveredLane.day}</span></div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text2)' }}>Avg CO₂/Shipment</span>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>{hoveredLane.avgCO2PerShipment} kg</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text2)' }}>Load Efficiency</span>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>{hoveredLane.avgLoadFactor}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text2)' }}>Dominant Fleet</span>
                  <span className="badge blue" style={{ fontSize: '8px' }}>{hoveredLane.dominantVehicle}</span>
                </div>
              </div>

              <div style={{ marginTop: '25px', padding: '12px', background: 'var(--surface2)', borderRadius: '8px' }}>
                <p style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: '1.5' }}>
                  <Flame size={12} className="text-amber" /> Potential congestion on {hoveredLane.day} causes {hoveredLane.trend.toFixed(1)}% variance in route emissions.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
              <Clock size={32} style={{ marginBottom: '15px' }} />
              <p style={{ fontSize: '11px' }}>Hover a lane square for analytics</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
