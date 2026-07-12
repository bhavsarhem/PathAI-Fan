import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSeatZone, getEvacuationGate, GATE_DIRECTIONS } from '../../data/mock_data';
import stadiumLayout from '../../data/stadium_layout.json';
import Navbar from '../../components/Navbar';

export default function EmergencyGuide() {
  const navigate = useNavigate();
  const { state } = useApp();

  if (!state.emergencyMode) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>No Active Emergency</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>Everything is clear. Enjoy the match!</p>
          <button onClick={() => navigate('/fan')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px 24px', color: '#fff', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const seat = state.currentUser?.tickets?.[0]?.seat_number || 'A42';
  const zone = getSeatZone(seat);
  const gateId = getEvacuationGate(zone, {});
  const gate = stadiumLayout.gates.find(g => g.gate_id === gateId) || stadiumLayout.gates[0];
  const direction = GATE_DIRECTIONS[gateId];

  const STEPS = [
    'Stay calm. Do not rush. You have time.',
    `Proceed toward ${gate.label} (${gate.direction})`,
    direction,
    'Walk at a steady pace, keep to the right of the concourse',
    'Do not use lifts — use stairways only',
    'Proceed to the assembly point outside your gate',
    'Await further instructions from stadium staff',
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '620px', margin: '0 auto' }}>
        <button onClick={() => navigate('/fan')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Emergency header */}
        <div className="emergency-banner" style={{ padding: '16px 24px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>⚠️ EMERGENCY EVACUATION IN PROGRESS</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#fff', marginBottom: '6px' }}>Your Exit Instruction</h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
            This is <strong style={{ color: '#FC8181' }}>your personalized instruction</strong> — other fans in different zones receive different exits to prevent crowding.
          </p>

          {/* Gate assignment card */}
          <motion.div className="glass-card" style={{ padding: '28px', marginBottom: '24px', border: '2px solid rgba(229,62,62,0.4)' }}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(229,62,62,0.15)', border: '2px solid rgba(229,62,62,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', flexShrink: 0 }}>
                <span style={{ fontSize: '1.8rem' }}>🚪</span>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.65rem', color: '#FC8181', letterSpacing: '0.05em' }}>{gateId}</span>
              </div>
              <div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#fff', marginBottom: '4px' }}>Your Exit: {gate.label}</h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Seat: {seat} · Zone: {zone} → Exit: {gateId}</p>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(229,62,62,0.06)', borderRadius: '10px', borderLeft: '3px solid #E53E3E', marginBottom: '20px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
                🤖 <em>"Please remain calm. {direction} Stay to the right of the concourse and move at a steady pace."</em>
              </p>
            </div>

            {/* Step list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {STEPS.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                  style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: i === 0 ? 'rgba(56,161,105,0.25)' : 'rgba(229,62,62,0.15)', border: `1px solid ${i === 0 ? 'rgba(56,161,105,0.5)' : 'rgba(229,62,62,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: i === 0 ? '#68D391' : '#FC8181' }}>{i + 1}</div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: i === 0 ? '#68D391' : 'rgba(255,255,255,0.75)', paddingTop: '4px', lineHeight: 1.5, fontWeight: i === 0 ? 600 : 400 }}>{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Anti-rush note */}
          <div className="glass-card" style={{ padding: '16px 20px', border: '1px solid rgba(16, 185, 129,0.2)' }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#10B981', marginBottom: '4px' }}>ℹ️ Why your exit is different</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              PathAI distributes fans across multiple exits based on their zone and gate capacity. This prevents any single gate from becoming dangerously crowded. <strong style={{ color: '#fff' }}>Do not use gates not assigned to you.</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
