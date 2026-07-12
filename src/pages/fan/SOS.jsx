import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSeatZone } from '../../data/mock_data';
import { DEMO_STAFF } from '../../data/mock_data';
import Navbar from '../../components/Navbar';

const SOS_TYPES = [
  { id: 'sos_medical',  label: 'Medical Emergency', icon: '⚕️', color: '#38A169', bg: 'rgba(56,161,105,0.15)', border: 'rgba(56,161,105,0.4)', desc: 'First aid, injury, illness' },
  { id: 'sos_security', label: 'Security Alert',    icon: '🛡️', color: '#DD6B20', bg: 'rgba(221,107,32,0.15)', border: 'rgba(221,107,32,0.4)', desc: 'Threat, aggression, harassment' },
  { id: 'sos_general',  label: 'General Help',      icon: '🆘', color: '#E53E3E', bg: 'rgba(229,62,62,0.15)',  border: 'rgba(229,62,62,0.4)',  desc: 'Any other emergency' },
];

export default function SOS() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const seat = state.currentUser?.tickets?.[0]?.seat_number || 'A42';
  const zone = getSeatZone(seat);
  const staffInZone = DEMO_STAFF.find(s => s.assigned_zone === zone && s.availability === 'available');

  const handleSOS = async () => {
    if (!selected) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const incident = {
      incident_id: `INC_${Date.now()}`,
      type: selected.id,
      label: selected.label,
      fan_id: state.currentUser?.fan_id,
      fan_name: state.currentUser?.name || 'Fan',
      seat,
      zone,
      status: 'open',
      assigned_staff_id: staffInZone?.staff_id || null,
      timestamp: new Date().toISOString(),
      description: `${selected.label} triggered from seat ${seat}`,
    };
    dispatch({ type: 'ADD_INCIDENT', payload: incident });
    dispatch({ type: 'SET_ACTIVE_SOS', payload: incident });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '580px', margin: '0 auto' }}>
        <button onClick={() => navigate('/fan')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="picker" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🆘</div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>Emergency SOS</h1>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)' }}>
                  Select the type of help you need. The nearest available responder will be alerted immediately.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                {SOS_TYPES.map(t => (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(t)}
                    style={{
                      background: selected?.id === t.id ? t.bg : 'rgba(26,26,26,0.8)',
                      border: `2px solid ${selected?.id === t.id ? t.border : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '16px', padding: '20px 24px', cursor: 'pointer',
                      display: 'flex', gap: '16px', alignItems: 'center', textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{t.icon}</span>
                    <div>
                      <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: selected?.id === t.id ? t.color : '#fff' }}>{t.label}</p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>{t.desc}</p>
                    </div>
                    {selected?.id === t.id && <CheckCircle2 size={22} color={t.color} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                  </motion.button>
                ))}
              </div>

              <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span>
                <div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color: '#10B981', fontWeight: 600 }}>Your location</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Seat {seat} · Zone {zone} · FIFA Arena 26</p>
                </div>
                {staffInZone && (
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Nearest responder</p>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{staffInZone.name}</p>
                  </div>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleSOS}
                disabled={!selected || loading}
                style={{
                  width: '100%', padding: '18px', borderRadius: '16px', border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
                  background: selected ? `linear-gradient(135deg, ${selected.color}, ${selected.color}CC)` : 'rgba(255,255,255,0.08)',
                  color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem',
                  opacity: !selected || loading ? 0.7 : 1,
                  transition: 'all 0.2s', boxShadow: selected ? `0 0 32px ${selected.color}40` : 'none',
                }}
              >
                {loading ? '⏳ Sending alert...' : selected ? `Send ${selected.label} Alert` : 'Select type above'}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: '48px 32px', textAlign: 'center' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
                style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(56,161,105,0.15)', border: '2px solid rgba(56,161,105,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem' }}>✅</motion.div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#68D391', marginBottom: '12px' }}>Help is on the way</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '24px' }}>
                {staffInZone
                  ? `${staffInZone.name} (Zone ${zone}) has been alerted and is heading to your location.`
                  : `The nearest available responder in Zone ${zone} has been notified.`}
                {' '}Stay where you are if safe to do so.
              </p>
              <div className="glass-card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Clock size={18} color="#10B981" />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Estimated response time: <strong style={{ color: '#10B981' }}>2–4 minutes</strong></p>
              </div>
              <button onClick={() => navigate('/fan')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 24px', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', cursor: 'pointer' }}>
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
