import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ZONE_NEAREST, getSeatZone, getEvacuationGate, GATE_DIRECTIONS } from '../../data/mock_data';
import stadiumLayout from '../../data/stadium_layout.json';
import StadiumWireframe from '../../components/StadiumWireframe';
import Navbar from '../../components/Navbar';

export default function Exit() {
  const navigate = useNavigate();
  const { state } = useApp();
  const seat = state.currentUser?.tickets?.[0]?.seat_number || 'A42';
  const zone = getSeatZone(seat);

  // Emergency vs normal mode
  const isEmergency = state.emergencyMode;
  const gateId = isEmergency
    ? getEvacuationGate(zone, {})
    : ZONE_NEAREST[zone]?.gate || 'G1';
  const gate = stadiumLayout.gates.find(g => g.gate_id === gateId) || stadiumLayout.gates[0];
  const direction = GATE_DIRECTIONS[gateId] || 'Follow the nearest exit signs.';

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '680px', margin: '0 auto' }}>
        <button onClick={() => navigate('/fan')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {isEmergency ? (
            <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4rem' }}>⚠️</span>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#FC8181' }}>Emergency mode active — this is your assigned exit</p>
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.8rem' }}>🚪</span>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>
              {isEmergency ? 'Your Evacuation Exit' : 'Nearest Exit Gate'}
            </h1>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
            {isEmergency
              ? 'Your personalized route — different fans receive different exits to prevent crowding.'
              : `Nearest gate to your seat ${seat}.`}
          </p>

          {/* Gate card */}
          <motion.div
            className="glass-card"
            style={{ padding: '28px', marginBottom: '20px', border: isEmergency ? '1px solid rgba(229,62,62,0.4)' : '1px solid rgba(16, 185, 129,0.3)' }}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          >
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '20px',
                background: isEmergency ? 'rgba(229,62,62,0.15)' : 'rgba(16, 185, 129,0.12)',
                border: isEmergency ? '2px solid rgba(229,62,62,0.5)' : '2px solid rgba(16, 185, 129,0.4)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px'
              }}>
                <span style={{ fontSize: '1.6rem' }}>🚪</span>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.65rem', color: isEmergency ? '#FC8181' : '#10B981', letterSpacing: '0.05em' }}>{gateId}</span>
              </div>
              <div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#fff', marginBottom: '4px' }}>{gate.label}</h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Direction: {gate.direction}</p>
                {isEmergency && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#FC8181', marginTop: '4px' }}>⚠️ Your assigned exit — do not use other gates</p>}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '20px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                {isEmergency ? '🤖 AI Narration (calm)' : 'Directions'}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, padding: '12px 16px', background: isEmergency ? 'rgba(229,62,62,0.06)' : 'rgba(16, 185, 129,0.05)', borderRadius: '8px', borderLeft: `3px solid ${isEmergency ? '#E53E3E' : '#10B981'}` }}>
                {isEmergency
                  ? `Please remain calm. ${direction} Wait for further instructions at the assembly point.`
                  : direction}
              </p>
            </div>
          </motion.div>

          {/* Wireframe showing highlighted gate */}
          <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>Stadium Map — Your Gate Highlighted</p>
            <StadiumWireframe fanZone={zone} highlightGate={gateId} showWashrooms={false} showFood={false} showParking={false} />
          </div>

          {/* All gates */}
          <div className="glass-card" style={{ padding: '20px 24px' }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>All Gates</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {stadiumLayout.gates.map(g => (
                <div key={g.gate_id} style={{ padding: '10px 12px', background: g.gate_id === gateId ? 'rgba(16, 185, 129,0.12)' : 'rgba(255,255,255,0.03)', border: g.gate_id === gateId ? '1px solid rgba(16, 185, 129,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: g.gate_id === gateId ? '#10B981' : '#fff' }}>{g.gate_id}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{g.direction}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
