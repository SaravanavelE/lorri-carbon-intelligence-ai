import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../utils/api';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle2,
  MoreVertical,
  ExternalLink
} from 'lucide-react';

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchShipments();
    const interval = setInterval(fetchShipments, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await dashboardApi.getShipments();
      setShipments(res.data.shipments);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = shipments.filter(s => 
    s.id.toLowerCase().includes(search.toLowerCase()) || 
    s.from.toLowerCase().includes(search.toLowerCase()) ||
    s.to.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--muted)' }} />
          <input 
            placeholder="Search Shipment ID, origin, destination..."
            style={{ 
              width: '100%', padding: '10px 15px 10px 40px', background: 'var(--surface2)', 
              border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)',
              fontSize: '12px', outline: 'none'
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost">
            <Filter size={14} /> FILTER
          </button>
          <button className="btn btn-ghost">
            <ArrowUpDown size={14} /> SORT
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '15px 20px', fontSize: '11px', color: 'var(--text2)', fontWeight: 600 }}>ID</th>
              <th style={{ padding: '15px 20px', fontSize: '11px', color: 'var(--text2)', fontWeight: 600 }}>ROUTE</th>
              <th style={{ padding: '15px 20px', fontSize: '11px', color: 'var(--text2)', fontWeight: 600 }}>VEHICLE</th>
              <th style={{ padding: '15px 20px', fontSize: '11px', color: 'var(--text2)', fontWeight: 600 }}>LOAD</th>
              <th style={{ padding: '15px 20px', fontSize: '11px', color: 'var(--text2)', fontWeight: 600 }}>CO₂ (KG)</th>
              <th style={{ padding: '15px 20px', fontSize: '11px', color: 'var(--text2)', fontWeight: 600 }}>STATUS</th>
              <th style={{ padding: '15px 20px', fontSize: '11px', color: 'var(--text2)', fontWeight: 600 }}>SCORE</th>
              <th style={{ padding: '15px 20px', fontSize: '11px', color: 'var(--text2)', fontWeight: 600 }}>ANOMALY</th>
              <th style={{ padding: '15px 20px' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ padding: '50px', textAlign: 'center' }}><div className="spinner"></div></td></tr>
            ) : filtered.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row">
                <td style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 600 }}>{s.id}</td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ fontSize: '12px' }}>{s.from} → {s.to}</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{s.distance} km</div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div className="badge blue" style={{ fontSize: '9px' }}>{s.vehicle}</div>
                </td>
                <td style={{ padding: '15px 20px', fontSize: '12px' }}>{s.loadFactor}%</td>
                <td style={{ padding: '15px 20px', fontSize: '12px', fontWeight: 700 }}>{s.co2Kg}</td>
                <td style={{ padding: '15px 20px', fontSize: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={12} className="text-green" /> {s.status}
                  </span>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div className={`score-pill score-${s.sustainabilityScore}`}>{s.sustainabilityScore}</div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  {s.anomaly && <AlertCircle size={16} className="text-red" />}
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        .table-row:hover { background: rgba(0,255,136,0.03); }
      `}</style>
    </div>
  );
}
