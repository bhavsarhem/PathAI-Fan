import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ZONE_GATE_MAP, getEvacuationGate } from '../../data/mock_data';
import Navbar from '../../components/Navbar';

const ZONES = ['A','B','C','D','E','F','G','H'];

export default function Broadcast() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [confirmed, setConfirmed] = useState(false);
  const [broadcasted, setBroadcasted] = useState(false);

  const isOrganizer = state.userRole === 'organizer';

  // Compute zone-to-gate assignments preview
  const assignments = ZONES.map(zone => ({
    zone,
    gate: getEvacuationGate(zone, {}),
    primaryGate: ZONE_GATE_MAP[zone]?.primary,
  }));

  const handleBroadcast = () => {
    const gateMap = {};
    assignments.forEach(({ zone, gate }) => { gateMap[zone] = gate; });
    dispatch({ type: 'TRIGGER_EMERGENCY', payload: gateMap });
    setBroadcasted(true);
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_EMERGENCY' });
    setBroadcasted(false);
    setConfirmed(false);
  };

  if (!isOrganizer) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔒</div>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>Organizer access only</p>
          <button onClick={() => navigate('/staff')} style={{ marginTop: '16px', background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '10px 20px', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '720px', margin: '0 auto' }}>
        <button onClick={() => navigate('/staff')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '1.8rem' }}>📡</span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>Emergency Broadcast</h1>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
          Trigger a stadium-wide evacuation. Each fan will receive a <strong style={{ color: '#fff' }}>personalized exit instruction</strong> — different gates for different zones — to prevent stampede.
        </p>

        {state.emergencyMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="emergency-banner" style={{ padding: '16px 24px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>⚠️ EMERGENCY BROADCAST ACTIVE</span>
            <button onClick={handleClear} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '6px 12px', color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
              Clear Emergency
            </button>
          </motion.div>
        )}

        {/* Zone-to-gate assignment preview */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#fff', marginBottom: '4px' }}>Zone → Gate Assignment Preview</p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            This is the deterministic rule-based mapping (not AI). Each zone is pre-assigned a gate. If a gate is &gt;80% capacity, fans are rerouted to the secondary gate.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {assignments.map(({ zone, gate, primaryGate }) => (
              <div key={zone} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: gate !== primaryGate ? '1px solid rgba(221,107,32,0.25)' : '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#10B981', flexShrink: 0 }}>Z{zone}</div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>→</span>
                <div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{gate}</p>
                  {gate !== primaryGate && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', color: '#F6AD55' }}>rerouted from {primaryGate}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirm + Broadcast */}
        <AnimatePresence mode="wait">
          {!broadcasted ? (
            <motion.div key="prebroadcast" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {!confirmed ? (
                <div style={{ padding: '20px', background: 'rgba(229,62,62,0.08)', border: '1px solid rgba(229,62,62,0.25)', borderRadius: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <AlertTriangle size={20} color="#FC8181" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#FC8181', marginBottom: '6px' }}>Warning: Irreversible Action</p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                        Triggering emergency broadcast will immediately update all fans' apps with evacuation instructions. Only proceed if an actual emergency is declared.
                      </p>
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#E53E3E' }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#fff' }}>I confirm this is a real emergency and authorize the broadcast</span>
                  </label>
                </div>
              ) : (
                <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <CheckCircle2 size={16} color="#FC8181" />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#FC8181' }}>Authorization confirmed — ready to broadcast</span>
                </div>
              )}

              <button
                onClick={handleBroadcast}
                disabled={!confirmed}
                style={{ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', cursor: confirmed ? 'pointer' : 'not-allowed', background: confirmed ? 'linear-gradient(135deg, #7B0000, #E53E3E)' : 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', opacity: confirmed ? 1 : 0.5, transition: 'all 0.2s', boxShadow: confirmed ? '0 0 40px rgba(229,62,62,0.3)' : 'none' }}>
                {confirmed ? '⚠️ Trigger Emergency Broadcast' : 'Confirm authorization above first'}
              </button>
            </motion.div>
          ) : (
            <motion.div key="postbroadcast" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-card" style={{ padding: '32px', textAlign: 'center', border: '1px solid rgba(229,62,62,0.4)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📡</div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: '#FC8181', marginBottom: '8px' }}>Broadcast Sent</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                All fans' apps are now showing their personalized evacuation exit. Security teams have been notified.
              </p>
              <button onClick={handleClear} style={{ marginTop: '20px', padding: '12px 28px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                Clear Emergency (All Clear)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
