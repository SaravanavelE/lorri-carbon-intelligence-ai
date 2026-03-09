import React, { useState } from 'react';
import { dashboardApi } from '../utils/api';
import { 
  Calculator, 
  Settings2, 
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function EmissionCalculator() {
  const [formData, setFormData] = useState({
    distanceKm: 100,
    vehicleType: 'HCV-Diesel',
    loadFactor: 0.75
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await dashboardApi.calculateEmission(formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="card">
        <h3 className="font-display" style={{ fontSize: '16px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calculator size={18} className="text-green" /> CO₂ EMISSION FORMULA ENGINE
        </h3>

        <form onSubmit={calculate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text2)', marginBottom: '8px' }}>DISTANCE (KM)</label>
            <input 
              type="number" className="btn btn-ghost" 
              style={{ width: '100%', background: 'var(--surface2)', textAlign: 'left', paddingLeft: '20px', cursor: 'text' }}
              value={formData.distanceKm}
              onChange={(e) => setFormData({...formData, distanceKm: e.target.value})}
            />
          </div>

          <div>
             <label style={{ display: 'block', fontSize: '11px', color: 'var(--text2)', marginBottom: '8px' }}>FLEET CATEGORY</label>
             <select 
               className="btn btn-ghost" style={{ width: '100%', background: 'var(--surface2)', color: 'var(--text)' }}
               value={formData.vehicleType}
               onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
             >
               <option value="HCV-Diesel">Heavy (Diesel)</option>
               <option value="HCV-BS6">Heavy (BS6 Diesel)</option>
               <option value="MCV-Diesel">Medium (Diesel)</option>
               <option value="LCV-Diesel">Light (Diesel)</option>
               <option value="CNG-Truck">CNG Vehicle</option>
               <option value="EV-Truck">Electric Vehicle</option>
             </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text2)', marginBottom: '8px' }}>LOAD FACTOR (0.4 - 1.0)</label>
            <input 
              type="number" step="0.05" className="btn btn-ghost" 
              style={{ width: '100%', background: 'var(--surface2)', textAlign: 'left', paddingLeft: '20px', cursor: 'text' }}
              value={formData.loadFactor}
              onChange={(e) => setFormData({...formData, loadFactor: e.target.value})}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', padding: '15px' }} disabled={loading}>
            {loading ? 'CALCULATING...' : 'GENERATE EMISSION PROFILE'}
          </button>
        </form>
      </div>

      {result && (
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '5px' }}>ESTIMATED CO₂</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{result.co2Kg} <span style={{ fontSize: '12px' }}>KG</span></div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '5px' }}>FUEL CONSUMPTION</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{result.fuelUsed} <span style={{ fontSize: '12px' }}>{formData.vehicleType === 'EV-Truck' ? 'KWH' : 'L'}</span></div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '5px' }}>SUSTAINABILITY GRADE</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
              <div className={`score-pill score-${result.sustainabilityScore}`} style={{ width: '40px', height: '26px', fontSize: '14px' }}>{result.sustainabilityScore}</div>
            </div>
          </div>

          <div className="card" style={{ gridColumn: 'span 3', background: 'rgba(0,255,136,0.02)' }}>
             <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.6', display: 'flex', gap: '10px' }}>
               <Info size={16} className="text-blue" />
               Validation: Based on EPA/GREET standards for {formData.vehicleType}. An emission factor of {result.emissionFactor} was applied considering the payload weight adjustment.
             </p>
          </div>
        </div>
      )}
    </div>
  );
}
