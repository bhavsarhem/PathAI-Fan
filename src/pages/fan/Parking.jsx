import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import stadiumLayout from '../../data/stadium_layout.json';
import { ZONE_NEAREST, getSeatZone } from '../../data/mock_data';
import Navbar from '../../components/Navbar';

export default function Parking() {
  const navigate = useNavigate();
  const { state } = useApp();
  const fan = state.currentUser;
  const seat = fan?.tickets?.[0]?.seat_number || 'A42';
  const zone = getSeatZone(seat);
  const nearestId = ZONE_NEAREST[zone]?.parking || 'P1';
  const parkZone = stadiumLayout.parking_zones.find(p => p.id === nearestId) || stadiumLayout.parking_zones[0];
  const vehicle = fan?.vehicle_number;
  const fillPct = Math.round((parkZone.current / parkZone.capacity) * 100);
  const fillColor = fillPct > 85 ? '#E53E3E' : fillPct > 65 ? '#D69E2E' : '#38A169';

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '680px', margin: '0 auto' }}>
        <button onClick={() => navigate('/fan')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.8rem' }}>🚗</span>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>Parking Locator</h1>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
            Nearest lot to your seat <strong style={{ color: '#fff' }}>{seat}</strong>
          </p>

          {/* Vehicle confirmation card */}
          {vehicle && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
              className="glass-card" style={{ padding: '20px 24px', marginBottom: '20px', border: '1px solid rgba(56,161,105,0.35)', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56,161,105,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={22} color="#68D391" />
              </div>
              <div>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#68D391', marginBottom: '2px' }}>Vehicle Found</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                  Your vehicle <strong style={{ color: '#fff' }}>{vehicle}</strong> is registered in {parkZone.label.split('—')[1]?.trim() || parkZone.label}
                </p>
              </div>
            </motion.div>
          )}

          {/* Parking zone card */}
          <motion.div className="glass-card" style={{ padding: '28px', marginBottom: '20px', border: '1px solid rgba(16, 185, 129,0.2)' }}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129,0.1)', border: '1px solid rgba(16, 185, 129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>🅿️</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#fff', marginBottom: '4px' }}>{parkZone.label}</h2>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Capacity: {parkZone.capacity.toLocaleString()}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Occupied: {parkZone.current.toLocaleString()}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6EE7B7' }}><Zap size={12} /> {parkZone.ev_spots} EV spots</span>
                </div>
                {/* Fill bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Occupancy</span>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color: fillColor, fontWeight: 600 }}>{fillPct}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${fillPct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', background: fillColor, borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* All parking zones */}
          <div className="glass-card" style={{ padding: '20px 24px' }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>All Parking Zones</p>
            {stadiumLayout.parking_zones.map(p => {
              const pct = Math.round((p.current / p.capacity) * 100);
              const pc = pct > 85 ? '#E53E3E' : pct > 65 ? '#D69E2E' : '#38A169';
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#10B981', flexShrink: 0 }}>{p.id}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#fff', marginBottom: '2px' }}>{p.label.split('—')[1]?.trim() || p.label}</p>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '3px', height: '4px' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: pc, borderRadius: '3px', transition: 'width 0.5s' }} />
                    </div>
                  </div>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: pc, fontWeight: 600, flexShrink: 0 }}>{pct}%</span>
                </div>
              );
            })}
          </div>

          {!vehicle && (
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(16, 185, 129,0.06)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129,0.15)', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
                💡 Add your vehicle number in your profile to see your personalized parking confirmation
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
