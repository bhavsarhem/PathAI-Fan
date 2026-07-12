import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Accessibility } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import stadiumLayout from '../../data/stadium_layout.json';
import { ZONE_NEAREST, getSeatZone } from '../../data/mock_data';
import Navbar from '../../components/Navbar';

export default function Washroom() {
  const navigate = useNavigate();
  const { state } = useApp();
  const seat = state.currentUser?.tickets?.[0]?.seat_number || 'A42';
  const zone = getSeatZone(seat);
  const nearestId = ZONE_NEAREST[zone]?.washroom || 'W1';
  const washroom = stadiumLayout.washrooms.find(w => w.id === nearestId) || stadiumLayout.washrooms[0];

  const STEPS = {
    A: ['From your seat, head to the North concourse', `Washroom ${nearestId} is past the food court on the right`, 'Look for the 🚻 blue signs — approx 2 min walk'],
    B: ['Exit Row B toward the East Stand concourse', `${washroom.label} is near Gate 3 corridor`, 'Wheelchair-accessible entry available'],
    C: ['Walk toward the East-lower corridor', `${washroom.label} is before Gate 4`, 'Turn right at the Snack Bar F4'],
    D: ['Head south toward the South Stand', `${washroom.label} is near Gate 5 lobby`, 'Approx 3 min walk from your seat'],
    E: ['Use the south-west ramp', `${washroom.label} is to the left of Gate 6`, 'Approx 2 min walk'],
    F: ['Walk west through the lower concourse', `${washroom.label} is near Gate 7`, 'Follow the blue 🚻 overhead signs'],
    G: ['Head to the Upper Tier concourse walkway', `${washroom.label} is accessible from the main ring corridor`, 'Approx 3–4 min from upper seats'],
    H: ['VIP washroom is within the corporate lounge', `${washroom.label} is on Level 2`, 'VIP credential required for access'],
  };
  const steps = STEPS[zone] || STEPS.G;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '680px', margin: '0 auto' }}>
        <button onClick={() => navigate('/fan')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.8rem' }}>🚻</span>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>Nearest Washroom</h1>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
            Calculated from your seat <strong style={{ color: '#fff' }}>{seat}</strong> — no GPS needed.
          </p>

          {/* Main card */}
          <motion.div className="glass-card" style={{ padding: '28px', marginBottom: '20px', border: '1px solid rgba(85,60,154,0.4)' }}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(85,60,154,0.2)', border: '1px solid rgba(85,60,154,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>🚻</div>
              <div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#fff', marginBottom: '4px' }}>{washroom.label}</h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>Zone {washroom.zone} · Concourse Level</p>
                {washroom.accessible && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(43,108,176,0.15)', border: '1px solid rgba(43,108,176,0.3)', borderRadius: '6px', padding: '3px 8px', marginTop: '6px' }}>
                    <Accessibility size={12} color="#63B3ED" />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#63B3ED' }}>Wheelchair accessible</span>
                  </div>
                )}
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <Clock size={14} color="#10B981" />
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#10B981' }}>~2</span>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>min walk</p>
              </div>
            </div>

            {/* Steps */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '20px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Directions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(85,60,154,0.3)', border: '1px solid rgba(85,60,154,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#C084FC' }}>{i + 1}</div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', paddingTop: '2px', lineHeight: 1.5 }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Other washrooms */}
          <div className="glass-card" style={{ padding: '20px 24px' }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>Other Washrooms Nearby</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stadiumLayout.washrooms.filter(w => w.id !== nearestId).slice(0, 3).map(w => (
                <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#fff' }}>{w.label}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Zone {w.zone}</p>
                  </div>
                  {w.accessible && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#63B3ED' }}>♿</span>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
