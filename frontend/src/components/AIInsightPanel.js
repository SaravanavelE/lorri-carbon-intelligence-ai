import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AIInsightPanel({ insight, loading }) {
  const [displayedText, setDisplayedText] = React.useState('');
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [insight]);

  React.useEffect(() => {
    if (insight && index < insight.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + insight[index]);
        setIndex(index + 1);
      }, 15);
      return () => clearTimeout(timeout);
    }
  }, [insight, index]);

  return (
    <div className="card" style={{ 
      background: 'linear-gradient(135deg, var(--surface), var(--surface2))',
      borderLeft: '4px solid var(--green)',
      minHeight: '120px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <Sparkles size={16} className="text-green" />
        <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
          LoRRI AI Engine <span className="text-muted" style={{ fontWeight: 400 }}>— Gemini Pro</span>
        </span>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <p style={{ 
          fontSize: '14px', lineHeight: '1.6', color: 'var(--text)', 
          fontFamily: 'var(--font-mono)', minHeight: '3em'
        }}>
          {displayedText}
          <span className="live-dot" style={{ width: '4px', height: '14px', borderRadius: '1px', marginLeft: '4px' }}></span>
        </p>
      )}

      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
        <div className="badge blue">PREDICTIVE INSIGHT ACTIVE</div>
      </div>
    </div>
  );
}
