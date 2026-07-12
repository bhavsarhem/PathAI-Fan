import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StadiumWireframe from '../../components/StadiumWireframe';
import Navbar from '../../components/Navbar';

export default function LayoutManager() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('view');
  const [saved, setSaved] = useState(false);
  const isOrganizer = state.userRole === 'organizer';

  const TABS = ['view', ...(isOrganizer ? ['add_washroom', 'add_food', 'add_gate'] : [])];
  const TAB_LABELS = { view: 'View Layout', add_washroom: '+ Washroom', add_food: '+ Food Counter', add_gate: '+ Gate' };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate('/staff')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '1.8rem' }}>🗺️</span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>Stadium Layout Manager</h1>
          {!isOrganizer && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '6px' }}>View only</span>}
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
          {isOrganizer ? 'Add and manage stadium facilities, gates, and zones.' : 'View-only access — contact an organizer to make changes.'}
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.82rem', background: activeTab === t ? '#10B981' : 'rgba(255,255,255,0.06)', color: activeTab === t ? '#000' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s' }}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {activeTab === 'view' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <StadiumWireframe showWashrooms showFood showParking showFirstAid showSecurity />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '12px' }}>
              Demo wireframe for FIFA Arena 26 — synthetic layout, not a real stadium blueprint
            </p>
          </motion.div>
        )}

        {isOrganizer && activeTab !== 'view' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '28px' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '20px' }}>
              {TAB_LABELS[activeTab]}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {['Label / Name', 'Zone (A–H)', 'SVG X Position (0–800)', 'SVG Y Position (0–600)'].map(field => (
                <div key={field}>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>{field}</label>
                  <input placeholder={`Enter ${field.toLowerCase()}`} className="input-field w-full" style={{ padding: '12px 16px' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                className="btn-gold"
                style={{ padding: '12px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Save size={16} />
                {saved ? 'Saved!' : 'Save to Layout'}
              </button>
              <button style={{ padding: '12px 20px', background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.25)', borderRadius: '12px', color: '#FC8181', fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trash2 size={15} /> Clear
              </button>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '16px' }}>
              * In a production system, changes would persist to the backend and update all fans' maps in real time.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
