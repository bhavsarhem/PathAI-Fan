import { Link, useNavigate } from 'react-router-dom';
import { useApp, updatePassword } from '../context/AppContext';
import { useChat } from '../context/ChatContext';
import { Trophy, MessageCircle, Menu, X, LogOut, Key } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { state, dispatch } = useApp();
  const { setIsOpen } = useChat();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Change Password Modal inside app
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [currPwd, setCurrPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confPwd, setConfPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currPwd || !newPwd || !confPwd) {
      setPwdError('All fields are required');
      return;
    }
    if (newPwd !== confPwd) {
      setPwdError('New passwords do not match');
      return;
    }
    setPwdError('');
    setPwdSuccess('');

    const res = updatePassword(state.currentUser?.mobile, currPwd, newPwd);
    if (res.success) {
      setPwdSuccess('Password updated successfully!');
      setCurrPwd('');
      setNewPwd('');
      setConfPwd('');
      setTimeout(() => {
        setPwdSuccess('');
        setShowPwdModal(false);
      }, 1500);
    } else {
      setPwdError(res.message || 'Failed to update password');
    }
  };

  const isFan = state.userRole === 'fan';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(16, 185, 129,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Wordmark */}
            <Link to={state.isAuthenticated ? (isFan ? '/fan' : '/staff') : '/'} className="flex items-center gap-2.5 no-underline">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10B981, #34D399)' }}>
                <Trophy size={18} color="#000" />
              </div>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#fff' }}>
                PathAI <span style={{ color: '#10B981' }}>Navigator</span>
              </span>
              <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129,0.15)', color: '#10B981', padding: '2px 6px', borderRadius: '4px', fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}>
                FIFA 2026
              </span>
            </Link>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-3">
              {state.isAuthenticated && (
                <>
                  {state.emergencyMode && (
                    <span className="emergency-banner px-3 py-1 rounded-full text-xs font-bold text-white">
                      ⚠️ EMERGENCY ACTIVE
                    </span>
                  )}
                  {isFan && (
                    <button
                      onClick={() => setIsOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                      style={{ color: '#10B981', border: '1px solid rgba(16, 185, 129,0.25)', fontFamily: 'Inter, sans-serif' }}
                    >
                      <MessageCircle size={16} />
                      AI Assistant
                    </button>
                  )}
                  
                  {/* User Badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(16, 185, 129,0.08)', border: '1px solid rgba(16, 185, 129,0.15)' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#10B981', color: '#000' }}>
                      {(state.currentUser?.name || 'U').charAt(0)}
                    </div>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#34D399' }}>
                      {state.currentUser?.name || 'User'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                      · {state.userRole}
                    </span>
                  </div>

                  {/* Change Password Trigger */}
                  <button
                    onClick={() => setShowPwdModal(true)}
                    title="Change Password"
                    className="p-2 rounded-xl transition-all hover:bg-white/5"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    <Key size={16} />
                  </button>

                  {/* Logout */}
                  <button onClick={handleLogout} className="p-2 rounded-xl transition-all hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <LogOut size={16} />
                  </button>
                </>
              )}
              {!state.isAuthenticated && (
                <Link to="/auth">
                  <button className="btn-gold px-5 py-2.5 text-sm">Sign In</button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 rounded-lg" style={{ color: '#10B981' }} onClick={() => setMobileMenuOpen(v => !v)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: '#111', borderTop: '1px solid rgba(16, 185, 129,0.1)' }}
              className="md:hidden px-4 py-3 flex flex-col gap-2"
            >
              {state.isAuthenticated ? (
                <>
                  {isFan && <button onClick={() => { setIsOpen(true); setMobileMenuOpen(false); }} className="text-left px-3 py-2 rounded-xl text-sm" style={{ color: '#10B981' }}>💬 AI Assistant</button>}
                  <button onClick={() => { setShowPwdModal(true); setMobileMenuOpen(false); }} className="text-left px-3 py-2 rounded-xl text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>🔑 Change Password</button>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left px-3 py-2 rounded-xl text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Sign Out</button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <button className="btn-gold w-full py-3 text-sm">Sign In</button>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPwdModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', padding: '16px' }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card"
              style={{ width: '100%', maxWidth: '400px', padding: '24px', border: '1px solid rgba(16, 185, 129,0.25)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#fff' }}>Change Account Password</h3>
                <button onClick={() => { setShowPwdModal(false); setPwdError(''); setPwdSuccess(''); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>Username (Mobile)</label>
                  <input
                    type="text"
                    disabled
                    value={state.currentUser?.mobile || ''}
                    className="input-field w-full"
                    style={{ padding: '10px 12px', fontSize: '0.85rem', opacity: 0.6 }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>Current Password</label>
                  <input
                    type="password"
                    value={currPwd}
                    onChange={e => setCurrPwd(e.target.value)}
                    placeholder="Enter current password"
                    className="input-field w-full"
                    style={{ padding: '10px 12px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>New Password</label>
                  <input
                    type="password"
                    value={newPwd}
                    onChange={e => setNewPwd(e.target.value)}
                    placeholder="Enter new password"
                    className="input-field w-full"
                    style={{ padding: '10px 12px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>Confirm New Password</label>
                  <input
                    type="password"
                    value={confPwd}
                    onChange={e => setConfPwd(e.target.value)}
                    placeholder="Confirm new password"
                    className="input-field w-full"
                    style={{ padding: '10px 12px', fontSize: '0.85rem' }}
                  />
                </div>

                {pwdError && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#FC8181' }}>{pwdError}</p>}
                {pwdSuccess && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#68D391' }}>{pwdSuccess}</p>}

                <button type="submit" className="btn-gold w-full" style={{ padding: '10px', fontSize: '0.85rem', marginTop: '8px' }}>
                  Update Password
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
