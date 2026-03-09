import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../utils/api';
import { 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnomalyFeed() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnomalies();
    const interval = setInterval(fetchAnomalies, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnomalies = async () => {
    try {
      const res = await dashboardApi.getAnomalies();
      setAnomalies(res.data.anomalies);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="font-display" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={18} className="text-red" /> LIVE SYSTEM LOGS & ANOMALIES
        </h3>
        <button className="btn btn-ghost" onClick={() => fetchAnomalies()} style={{ fontSize: '10px' }}>
          <RefreshCw size={12} className={loading ? 'spin' : ''} /> REFRESH
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {anomalies.map((a, i) => (
            <motion.div
              key={`${a.msg}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
              style={{ 
                padding: '16px 20px', 
                borderLeft: `3px solid ${a.level === 'critical' ? 'var(--red)' : a.level === 'warning' ? 'var(--amber)' : 'var(--blue)'}`,
                background: 'var(--surface2)'
              }}
            >
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ marginTop: '3px' }}>
                  {a.level === 'critical' && <AlertTriangle size={18} className="text-red" />}
                  {a.level === 'warning' && <AlertCircle size={18} className="text-amber" />}
                  {a.level === 'info' && <Info size={18} className="text-blue" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ 
                      fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', 
                      color: a.level === 'critical' ? 'var(--red)' : a.level === 'warning' ? 'var(--amber)' : 'var(--blue)'
                    }}>
                      {a.level}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{a.minutesAgo}m ago</span>
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text)' }}>
                    {a.msg}
                  </p>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
