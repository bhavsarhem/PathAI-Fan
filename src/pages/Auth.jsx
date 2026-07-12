import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { loginAsFan, loginAsStaff, checkPassword, updatePassword } from '../context/authHelpers';
import { Trophy, Shield, ArrowRight, CheckCircle2, Key, Eye, EyeOff } from 'lucide-react';

const STAFF_MOBILES = ['7654321098', '6543210987', '5432109876', '4321098765', '3210987654'];

export default function Auth() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isStaffFlow = searchParams.get('demo') === 'staff';

  const [step, setStep] = useState(0); // 0: Login, 2: Profile, 3: Success, 4: Change Password
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile Step State
  const [name, setName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [seat, setSeat] = useState('');
  const [gate, setGate] = useState('G1');
  const [lang, setLang] = useState('en');

  // Change Password State
  const [chMobile, setChMobile] = useState('');
  const [chCurrentPassword, setChCurrentPassword] = useState('');
  const [chNewPassword, setChNewPassword] = useState('');
  const [chConfirmPassword, setChConfirmPassword] = useState('');
  const [chSuccessMsg, setChSuccessMsg] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isStaff = STAFF_MOBILES.includes(mobile) || isStaffFlow;

  const handleLogin = async () => {
    if (mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const isValid = checkPassword(mobile, password);
    setLoading(false);

    if (!isValid) {
      setError('Incorrect password');
      return;
    }

    if (isStaff) {
      // Staff skips profile setup
      loginAsStaff(dispatch, mobile);
      setStep(3);
      setTimeout(() => navigate('/staff'), 1200);
    } else {
      // Fan proceeds to profile check
      setStep(2);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    loginAsFan(dispatch, mobile);

    if (name || seat || vehicle) {
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: {
          name: name || 'Demo Fan',
          vehicle_number: vehicle || null,
          language: lang,
          tickets: seat ? [{
            ticket_id: 'TK_DEMO',
            seat_number: seat,
            zone: seat.charAt(0).toUpperCase(),
            gate,
            venue: 'FIFA Arena 26',
            booking_date: '2026-07-15',
            match: 'USA vs Mexico'
          }] : []
        }
      });
    }
    setLoading(false);
    setStep(3);
    setTimeout(() => navigate('/fan'), 1200);
  };

  const handleChangePasswordSubmit = async () => {
    if (chMobile.length < 10) {
      setError('Please enter a valid 10-digit username/mobile');
      return;
    }
    if (!chCurrentPassword || !chNewPassword) {
      setError('All fields are required');
      return;
    }
    if (chNewPassword !== chConfirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);

    const res = updatePassword(chMobile, chCurrentPassword, chNewPassword);
    if (res.success) {
      setChSuccessMsg('Password updated successfully! Redirecting to login...');
      setChMobile('');
      setChCurrentPassword('');
      setChNewPassword('');
      setChConfirmPassword('');
      setTimeout(() => {
        setChSuccessMsg('');
        setStep(0);
      }, 2000);
    } else {
      setError(res.message || 'Failed to update password');
    }
  };

  const DEMO_CREDS = [
    { label: 'Demo Fan (Seat A42)', mobile: '9876543210', hint: 'Regular fan, Zone A' },
    { label: 'Demo Fan (Seat C88)', mobile: '8765432109', hint: 'Regular fan, Zone C' },
    { label: 'Organizer (All access)', mobile: '7654321098', hint: 'Staff dashboard' },
    { label: 'Security Officer', mobile: '6543210987', hint: 'Zone A security' },
    { label: 'Volunteer', mobile: '5432109876', hint: 'Zone C volunteer' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Background gradients */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 20%, rgba(26,47,90,0.4) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 80%, rgba(16, 185, 129,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 2 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #10B981, #34D399)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Trophy size={26} color="#000" />
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#fff', marginBottom: '4px' }}>
            PathAI <span style={{ color: '#10B981' }}>Navigator</span>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>FIFA World Cup 2026 · Smart Stadium Portal</p>
        </div>

        <AnimatePresence mode="wait">
          {/* ─── Step 0: Login ─── */}
          {step === 0 && (
            <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Shield size={20} color="#10B981" />
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}>Secure Sign In</h2>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: '24px' }}>
                Enter your mobile number and password to log in.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                {/* Mobile */}
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Mobile Number</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '0 14px', display: 'flex', alignItems: 'center', fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>+91</div>
                    <input
                      type="tel" maxLength={10} value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="input-field flex-1" style={{ padding: '12px 14px', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Password</label>
                    <button onClick={() => setStep(4)} style={{ background: 'none', border: 'none', color: '#10B981', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', cursor: 'pointer', padding: 0 }}>
                      Change Password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="input-field w-full"
                      style={{ padding: '12px 42px 12px 14px', fontSize: '0.95rem' }}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                    <button
                      onClick={() => setShowPassword(v => !v)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {error && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#FC8181', marginBottom: '14px' }}>{error}</p>}

              <button onClick={handleLogin} disabled={loading} className="btn-gold w-full" style={{ padding: '12px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Verifying...' : <>Sign In <ArrowRight size={16} /></>}
              </button>

              {/* Quick credentials fill */}
              <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(16, 185, 129,0.04)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129,0.12)' }}>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#10B981', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.04em' }}>DEMO CREDENTIALS</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {DEMO_CREDS.map(c => (
                    <button
                      key={c.mobile}
                      onClick={() => {
                        setMobile(c.mobile);
                        setPassword('Test@123');
                        setError('');
                      }}
                      style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: '#fff', display: 'block' }}>{c.label}</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>User: {c.mobile}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Step 4: Change Password ─── */}
          {step === 4 && (
            <motion.div key="change-password" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Key size={20} color="#10B981" />
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}>Change Password</h2>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: '20px' }}>
                Provide your mobile number and current password to update to a new one.
              </p>

              {chSuccessMsg ? (
                <div style={{ padding: '16px', background: 'rgba(56,161,105,0.15)', border: '1px solid rgba(56,161,105,0.3)', borderRadius: '10px', textAlign: 'center', color: '#68D391', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}>
                  {chSuccessMsg}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {/* Mobile */}
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Mobile Number (Username)</label>
                    <input
                      type="tel" maxLength={10} value={chMobile} onChange={e => setChMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9876543210"
                      className="input-field w-full" style={{ padding: '12px 14px', fontSize: '0.9rem' }}
                    />
                  </div>

                  {/* Current Password */}
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Current Password</label>
                    <input
                      type="password" value={chCurrentPassword} onChange={e => setChCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="input-field w-full" style={{ padding: '12px 14px', fontSize: '0.9rem' }}
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>New Password</label>
                    <input
                      type="password" value={chNewPassword} onChange={e => setChNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="input-field w-full" style={{ padding: '12px 14px', fontSize: '0.9rem' }}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
                    <input
                      type="password" value={chConfirmPassword} onChange={e => setChConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="input-field w-full" style={{ padding: '12px 14px', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
              )}

              {error && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#FC8181', marginBottom: '14px' }}>{error}</p>}

              {!chSuccessMsg && (
                <button onClick={handleChangePasswordSubmit} disabled={loading} className="btn-gold w-full" style={{ padding: '12px', fontSize: '0.92rem', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              )}

              <button onClick={() => { setStep(0); setError(''); }} style={{ marginTop: '14px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', cursor: 'pointer', width: '100%', textAlign: 'center' }}>
                ← Back to Login
              </button>
            </motion.div>
          )}

          {/* ─── Step 2: Profile (Only for Fans) ─── */}
          {step === 2 && (
            <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card" style={{ padding: '32px' }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#fff', marginBottom: '6px' }}>Complete Stadium Profile</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: '20px' }}>
                Help us guide you through the stadium by entering your seat information.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Your Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alex Rivera" className="input-field w-full" style={{ padding: '12px 14px', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Seat Number <span style={{ color: '#10B981' }}>*</span></label>
                  <input value={seat} onChange={e => setSeat(e.target.value.toUpperCase())} placeholder="e.g. A42, C88" className="input-field w-full" style={{ padding: '12px 14px', fontSize: '0.9rem' }} />
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Letter = zone (A–H), number = seat row</p>
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Entry Gate</label>
                  <select value={gate} onChange={e => setGate(e.target.value)} className="input-field w-full" style={{ padding: '12px 14px', fontSize: '0.9rem' }}>
                    {['G1','G2','G3','G4','G5','G6','G7','G8'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Preferred Language</label>
                  <select value={lang} onChange={e => setLang(e.target.value)} className="input-field w-full" style={{ padding: '12px 14px', fontSize: '0.9rem' }}>
                    <option value="en">English</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="fr">Français (French)</option>
                    <option value="de">Deutsch (German)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Vehicle Number <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional)</span></label>
                  <input value={vehicle} onChange={e => setVehicle(e.target.value.toUpperCase())} placeholder="e.g. MH 04 AB 4821" className="input-field w-full" style={{ padding: '12px 14px', fontSize: '0.9rem' }} />
                </div>
              </div>

              <button onClick={handleSaveProfile} disabled={loading || !seat} className="btn-gold w-full" style={{ padding: '12px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (loading || !seat) ? 0.7 : 1 }}>
                {loading ? 'Saving...' : <>Enter Stadium <ArrowRight size={16} /></>}
              </button>
              <button onClick={() => handleSaveProfile()} style={{ marginTop: '12px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', cursor: 'pointer', width: '100%', textAlign: 'center' }}>Skip for now</button>
            </motion.div>
          )}

          {/* ─── Step 3: Success ─── */}
          {step === 3 && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(56,161,105,0.15)', border: '2px solid rgba(56,161,105,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle2 size={32} color="#68D391" />
              </div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#fff', marginBottom: '10px' }}>Successfully Logged In! 🎉</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Loading your dashboard...</p>
              <div style={{ marginTop: '20px', width: '40px', height: '4px', background: '#10B981', borderRadius: '2px', margin: '20px auto 0', animation: 'shimmer 1.5s linear infinite' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
