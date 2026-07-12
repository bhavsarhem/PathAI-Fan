import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSeatZone, DEMO_STAFF } from '../../data/mock_data';
import Navbar from '../../components/Navbar';

export default function WomenSafety() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [discreet, setDiscreet] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const seat = state.currentUser?.tickets?.[0]?.seat_number || 'A42';
  const zone = getSeatZone(seat);
  const nearestSecurity = DEMO_STAFF.find(s => s.role === 'security' && s.assigned_zone === zone && s.availability === 'available')
    || DEMO_STAFF.find(s => s.role === 'security');

  const handleAlert = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, discreet ? 400 : 800));

    dispatch({
      type: 'ADD_INCIDENT',
      payload: {
        incident_id: `WS_${Date.now()}`,
        type: 'women_safety',
        label: 'Women Safety Alert',
        fan_id: discreet ? null : state.currentUser?.fan_id,
        fan_name: discreet ? 'Anonymous' : (state.currentUser?.name || 'Fan'),
        seat: discreet ? zone : seat,
        zone,
        status: 'open',
        assigned_staff_id: nearestSecurity?.staff_id || null,
        timestamp: new Date().toISOString(),
        description: `Women safety alert ${discreet ? '(discreet mode)' : ''} from Zone ${zone}`,
      }
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '560px', margin: '0 auto' }}>
        <button onClick={() => navigate('/fan')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🌸</div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>Women's Safety Alert</h1>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                  Your alert goes directly to the nearest security officer. You can send it discreetly — with no visible on-screen confirmation.
                </p>
              </div>

              {/* Discreet mode toggle */}
              <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer', border: discreet ? '1px solid rgba(192,132,252,0.4)' : '1px solid rgba(255,255,255,0.08)' }}
                onClick={() => setDiscreet(v => !v)}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: discreet ? 'rgba(192,132,252,0.15)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {discreet ? <EyeOff size={20} color="#C084FC" /> : <Eye size={20} color="rgba(255,255,255,0.5)" />}
                </div>
                <div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: discreet ? '#C084FC' : '#fff' }}>
                    Discreet Mode {discreet ? '(ON)' : '(OFF)'}
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                    {discreet ? 'No confirmation shown on screen. Alert is sent silently.' : 'Tap to send alert without any visible response on your screen.'}
                  </p>
                </div>
                <div style={{ marginLeft: 'auto', width: '40px', height: '22px', borderRadius: '11px', background: discreet ? '#C084FC' : 'rgba(255,255,255,0.15)', position: 'relative', transition: 'background 0.25s', flexShrink: 0 }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: discreet ? '21px' : '3px', transition: 'left 0.25s' }} />
                </div>
              </div>

              <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span>
                <div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color: '#C084FC', fontWeight: 600 }}>Alert will go to:</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                    {nearestSecurity?.name || 'Nearest security officer'} · Zone {zone} · FIFA Arena 26
                  </p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAlert}
                disabled={loading}
                style={{
                  width: '100%', padding: '20px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #9F7AEA, #C084FC, #9F7AEA)',
                  color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.15rem',
                  boxShadow: '0 0 40px rgba(192,132,252,0.35)',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? '⏳ Sending...' : discreet ? '🌸 Send Discreet Alert' : '🌸 Send Safety Alert'}
              </motion.button>

              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '16px' }}>
                In discreet mode, your screen will not show a confirmation — the alert is still sent.
              </p>
            </motion.div>
          ) : discreet ? (
            // Discreet mode: show nothing meaningful, return user to normal screen
            <motion.div key="discreet-done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => navigate('/fan')}
              style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.2)' }}>Tap to continue</p>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-card" style={{ padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(192,132,252,0.15)', border: '2px solid rgba(192,132,252,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2.2rem' }}>🌸</div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#C084FC', marginBottom: '12px' }}>Security Alerted</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, marginBottom: '24px' }}>
                {nearestSecurity?.name || 'A security officer'} has been notified and is on their way. You are not alone.
              </p>
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
