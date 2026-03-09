import React from 'react';
import { motion } from 'framer-motion';

export default function KPICard({ label, value, subValue, trend, icon: Icon, color = 'green' }) {
  const colorMap = {
    green: 'var(--green)',
    amber: 'var(--amber)',
    red: 'var(--red)',
    blue: 'var(--blue)',
    purple: 'var(--purple)'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
        <div style={{ color: colorMap[color], opacity: 0.8 }}>
          <Icon size={18} />
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <h3 className="font-display" style={{ fontSize: '28px', fontWeight: 800 }}>
          {value}
        </h3>
        {subValue && (
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{subValue}</span>
        )}
      </div>

      {trend !== undefined && (
        <div style={{ marginTop: '10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span className={trend >= 0 ? 'text-red' : 'text-green'}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span style={{ color: 'var(--muted)' }}>vs last 24h</span>
        </div>
      )}

      {/* Background glow decoration */}
      <div style={{ 
        position: 'absolute', bottom: '-20px', right: '-20px', 
        width: '60px', height: '60px', 
        background: colorMap[color], 
        filter: 'blur(40px)', opacity: 0.1 
      }} />
    </motion.div>
  );
}
