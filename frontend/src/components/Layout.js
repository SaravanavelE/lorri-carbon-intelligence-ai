import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Map, 
  Route, 
  Calculator, 
  FileBarChart, 
  AlertTriangle,
  Leaf,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/shipments', label: 'Shipments', icon: Truck },
  { path: '/heatmap', label: 'Lane Heatmap', icon: Map },
  { path: '/optimizer', label: 'Route Optimizer', icon: Route },
  { path: '/calculator', label: 'Emission Calc', icon: Calculator },
  { path: '/esg', label: 'ESG Reporting', icon: FileBarChart },
  { path: '/anomalies', label: 'Anomaly Feed', icon: AlertTriangle },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="layout-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} style={{
        width: '260px',
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100,
        transition: 'transform 0.3s ease'
      }}>
        <div className="sidebar-header" style={{ padding: '30px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', background: 'var(--green)', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg)'
            }}>
              <Leaf size={20} />
            </div>
            <h1 className="font-display" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>
              LoRRI <span className="text-green">AI</span>
            </h1>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '20px 0' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 28px',
                textDecoration: 'none',
                color: isActive ? 'var(--green)' : 'var(--text2)',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                borderLeft: isActive ? '3px solid var(--green)' : '3px solid transparent',
                background: isActive ? 'rgba(0,255,136,0.05)' : 'transparent',
                transition: 'all 0.2s'
              })}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid var(--border)', fontSize: '10px', color: 'var(--muted)' }}>
          LO-RRI v1.0.4 • SUSTAINABLE LOGISTICS
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        marginLeft: '260px', 
        padding: '30px',
        width: 'calc(100% - 260px)',
        position: 'relative'
      }}>
        <header style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '40px'
        }}>
          <div>
            <h2 className="font-display" style={{ fontSize: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {navItems.find(n => n.path === location.pathname)?.label || 'Overview'}
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
              <span className="live-dot"></span> REAL-TIME EMISSION INTELLIGENCE
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="badge amber">
              GLOBAL ESG COMPLIANCE: 88%
            </div>
          </div>
        </header>

        <div className="fade-up">
          <Outlet />
        </div>
      </main>

      {/* Mobile Toggle (CSS handles visibility) */}
      <style>{`
        @media (max-width: 1024px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          main { margin-left: 0 !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
