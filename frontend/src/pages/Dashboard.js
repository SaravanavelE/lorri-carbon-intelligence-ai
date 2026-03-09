import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../utils/api';
import KPICard from '../components/KPICard';
import AIInsightPanel from '../components/AIInsightPanel';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';
import { 
  CloudRain, 
  Activity, 
  TrendingDown, 
  MapPin, 
  ShieldCheck,
  Zap 
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await dashboardApi.getSummary();
      setData(res.data);
      if (!aiInsight) {
        getInsight(res.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getInsight = async (context) => {
    setInsightLoading(true);
    try {
      const res = await dashboardApi.getAIInsight(context);
      setAiInsight(res.data.insight);
    } catch (err) {
      console.error(err);
    } finally {
      setInsightLoading(false);
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '100px auto' }}></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      {/* KPI Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px' 
      }}>
        <KPICard 
          label="Emissions Today" 
          value={`${data.kpis.totalCO2Today}t`} 
          subValue="CO₂e" 
          trend={-4.2} 
          icon={CloudRain} 
          color="green"
        />
        <KPICard 
          label="Active Fleet" 
          value={data.kpis.activeShipments} 
          subValue="Units" 
          icon={Activity} 
          color="blue"
        />
        <KPICard 
          label="Carbon Saved" 
          value={`${data.kpis.emissionSavedMTD}t`} 
          subValue="MTD" 
          icon={TrendingDown} 
          color="purple"
        />
        <KPICard 
          label="ESG Score" 
          value={data.kpis.esgScore} 
          subValue="/100" 
          icon={ShieldCheck} 
          color="amber"
          trend={1.5}
        />
      </div>

      {/* AI Insight row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        <AIInsightPanel insight={aiInsight} loading={insightLoading} />
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
           <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '5px' }}>OFFSET CREDITS</h4>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{data.kpis.offsetCredits} <span style={{ fontSize: '11px', color: 'var(--muted)' }}>AVAILABLE</span></div>
              </div>
              <div style={{ width: '1px', height: '40px', background: 'var(--border)' }}></div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '5px' }}>CRITICAL LANES</h4>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--red)' }}>{data.kpis.highEmissionLanes}</div>
              </div>
              <button className="btn btn-primary" style={{ padding: '12px 20px' }}>
                <Zap size={14} /> OPTIMIZE NOW
              </button>
           </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
        <div className="card">
          <h3 className="font-display" style={{ fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={16} className="text-green" /> 24H EMISSION TREND (KG CO₂)
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--green)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--green)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontSize: 10}} />
                <Tooltip />
                <Area type="monotone" dataKey="actual" stroke="var(--green)" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="optimized" stroke="var(--blue)" fillOpacity={1} fill="url(#colorOpt)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-display" style={{ fontSize: '14px', marginBottom: '20px' }}>FLEET DISTRIBUTION (%)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(data.fleetBreakdown).map(([name, value]) => ({ name, value }))} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'var(--text2)', fontSize: 10}} width={80} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {Object.entries(data.fleetBreakdown).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? 'var(--green)' : 'var(--surface3)'} stroke={index === 4 ? 'var(--green)' : 'var(--border2)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
