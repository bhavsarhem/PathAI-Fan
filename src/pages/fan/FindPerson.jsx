import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSeatZone } from '../../data/mock_data';
import Navbar from '../../components/Navbar';

export default function FindPerson() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(0); // 0=form, 1=success
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [lastZone, setLastZone] = useState('');
  const [loading, setLoading] = useState(false);

  const seat = state.currentUser?.tickets?.[0]?.seat_number || 'A42';
  const zone = getSeatZone(seat);

  const handleSubmit = async () => {
    if (!name || !description) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    dispatch({
      type: 'ADD_INCIDENT',
      payload: {
        incident_id: `MP_${Date.now()}`,
        type: 'missing_person',
        label: 'Missing Person',
        fan_id: state.currentUser?.fan_id,
        fan_name: state.currentUser?.name || 'Reporter',
        seat,
        zone: lastZone || zone,
        status: 'open',
        assigned_staff_id: null,
        timestamp: new Date().toISOString(),
        description: `Missing person: ${name}${age ? `, age ${age}` : ''} — ${description}${lastZone ? ` — Last seen Zone ${lastZone}` : ''}`,
      }
    });
    setLoading(false);
    setStep(1);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '580px', margin: '0 auto' }}>
        <button onClick={() => navigate('/fan')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.8rem' }}>🧒</span>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>Report Missing Person</h1>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '28px' }}>
                Your report will be sent immediately to security officers in the area. Fill in as many details as you can.
              </p>

              <div className="glass-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name <span style={{ color: '#10B981' }}>*</span></label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sam Rivera" className="input-field w-full" style={{ padding: '12px 16px' }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Age / Approximate Age</label>
                    <input value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 7, or ~30s" className="input-field w-full" style={{ padding: '12px 16px' }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description <span style={{ color: '#10B981' }}>*</span></label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Clothing, hair color, any distinguishing features..." className="input-field w-full" rows={3} style={{ padding: '12px 16px', resize: 'none' }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Seen Zone / Area</label>
                    <select value={lastZone} onChange={e => setLastZone(e.target.value)} className="input-field w-full" style={{ padding: '12px 16px' }}>
                      <option value="">Unknown / Not sure</option>
                      {['A','B','C','D','E','F','G','H'].map(z => <option key={z} value={z}>Zone {z}</option>)}
                    </select>
                  </div>
                  <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129,0.06)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129,0.15)' }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                      📍 Your current location: <strong style={{ color: '#fff' }}>Seat {seat} · Zone {zone}</strong> — this will be shared with security.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!name || !description || loading}
                  className="btn-gold w-full"
                  style={{ padding: '14px', fontSize: '0.95rem', marginTop: '24px', opacity: (!name || !description || loading) ? 0.6 : 1, cursor: (!name || !description) ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? '⏳ Alerting Security...' : '🚨 Report to Security Now'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-card" style={{ padding: '48px 32px', textAlign: 'center' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}
                style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(214,158,46,0.15)', border: '2px solid rgba(214,158,46,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2.2rem' }}>🧒</motion.div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#F6AD55', marginBottom: '12px' }}>Report Sent to Security</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, marginBottom: '24px' }}>
                Security officers in Zone {lastZone || zone} have been notified. Please stay in your current area if possible. You'll be contacted via your registered mobile number.
              </p>
              <div style={{ padding: '16px', background: 'rgba(246,173,85,0.08)', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(246,173,85,0.2)' }}>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', color: '#F6AD55', fontWeight: 600 }}>Missing: {name}{age ? `, ~${age}` : ''}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{description}</p>
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
