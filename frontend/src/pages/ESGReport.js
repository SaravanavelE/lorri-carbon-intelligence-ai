import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../utils/api';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { 
  Award, 
  Target, 
  Leaf, 
  ShieldCheck,
  Download
} from 'lucide-react';

export default function ESGReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchESG();
  }, []);

  const fetchESG = async () => {
    try {
      const res = await dashboardApi.getESG();
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '100px auto' }}></div>;

  const radarData = [
    { subject: 'Carbon', A: 85, fullMark: 100 },
    { subject: 'Ethics', A: 92, fullMark: 100 },
    { subject: 'Resource', A: 78, fullMark: 100 },
    { subject: 'Transp.', A: 95, fullMark: 100 },
    { subject: 'Air', A: 72, fullMark: 100 },
    { subject: 'Audit', A: 88, fullMark: 100 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            border: '6px solid var(--border)', borderTopColor: 'var(--green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', marginBottom: '20px'
          }}>
             <div style={{ fontSize: '42px', fontWeight: 800 }}>{data.score}</div>
             <div style={{ position: 'absolute', bottom: '-10px', background: 'var(--green)', color: 'var(--bg)', padding: '2px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>GRADE {data.grade}</div>
          </div>
          <h3 className="font-display" style={{ fontSize: '16px' }}>ESG SUSTAINABILITY SCORE</h3>
          <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '5px' }}>Top 12% in Logistics Sector</p>
          <button className="btn btn-ghost" style={{ marginTop: '25px', width: '100%' }}>
            <Download size={14} /> EXPORT COMPLIANCE DATA
          </button>
        </div>

        <div className="card">
          <h3 className="font-display" style={{ fontSize: '14px', marginBottom: '20px' }}>PERFORMANCE RADAR</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{fill: 'var(--text2)', fontSize: 10}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                <Radar name="Current" dataKey="A" stroke="var(--green)" fill="var(--green)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        <div className="card">
          <h3 className="font-display" style={{ fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={16} className="text-blue" /> ESG STRATEGIC TARGETS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {data.targets.map(t => (
              <div key={t.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px' }}>
                  <span style={{ color: 'var(--text2)' }}>{t.name}</span>
                  <span style={{ fontWeight: 700 }}>{t.progress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${t.progress}%`, background: `var(--${t.color})`, boxShadow: `0 0 10px var(--${t.color})44` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
           <h3 className="font-display" style={{ fontSize: '14px', marginBottom: '20px' }}>MONTHLY EMISSION REDUCTION (MT)</h3>
           <div style={{ height: '220px' }}>
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyReduction.map((v, i) => ({ month: `M${i+1}`, value: v }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontSize: 10}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="var(--green)" strokeWidth={3} dot={{ fill: 'var(--green)', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}
