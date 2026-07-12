import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ChatBar from '../../components/ChatBar';
import LiveScoreWidget from '../../components/LiveScoreWidget';
import SOSButton from '../../components/SOSButton';
import ZoneBadge from '../../components/ZoneBadge';
import Navbar from '../../components/Navbar';

const MENU_ITEMS = [
  { icon: '🧭', label: 'Find My Seat',       route: '/fan/seat',          color: '#2B6CB0' },
  { icon: '🚻', label: 'Nearest Washroom',   route: '/fan/washroom',      color: '#553C9A' },
  { icon: '🍔', label: 'Food & Water',        route: '/fan/food',          color: '#276749' },
  { icon: '🚗', label: 'Parking Locator',    route: '/fan/parking',       color: '#744210' },
  { icon: '🚪', label: 'Nearest Exit',       route: '/fan/exit',          color: '#97266D' },
  { icon: '🧒', label: 'Find Person',        route: '/fan/find-person',   color: '#D69E2E' },
  { icon: '🌸', label: "Women's Safety",     route: '/fan/women-safety',  color: '#C084FC' },
  { icon: '⚽', label: 'Live Score',         route: null, isScore: true,  color: '#276749' },
];

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const tileVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function FanDashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const fan = state.currentUser;
  const ticket = fan?.tickets?.[0];
  const zone = ticket?.seat_number?.charAt(0)?.toUpperCase() || 'G';

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />

      {/* Emergency Banner */}
      {state.emergencyMode && (
        <motion.div
          initial={{ height: 0 }} animate={{ height: 'auto' }}
          className="emergency-banner"
          style={{ paddingTop: '72px', paddingBottom: '12px', paddingInline: '16px', textAlign: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/fan/emergency')}
        >
          <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#fff', letterSpacing: '0.02em' }}>
            ⚠️ EMERGENCY ACTIVE — Tap here for your personalized exit instruction
          </p>
        </motion.div>
      )}

      <div style={{ paddingTop: state.emergencyMode ? '16px' : '80px', paddingBottom: '100px', padding: `${state.emergencyMode ? '16px' : '80px'} 16px 100px` }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff', marginBottom: '4px' }}>
                  Welcome, {fan?.name?.split(' ')[0] || 'Fan'} 👋
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {ticket && (
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                      🎟 Seat <strong style={{ color: '#fff' }}>{ticket.seat_number}</strong> · {ticket.match}
                    </span>
                  )}
                  {zone && <ZoneBadge zone={zone} size="sm" />}
                </div>
              </div>
              {/* SOS */}
              <SOSButton size="normal" />
            </div>
          </motion.div>

          {/* Live Score compact */}
          <div style={{ marginBottom: '20px' }}>
            <LiveScoreWidget compact />
          </div>

          {/* Menu Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '24px' }}
          >
            {MENU_ITEMS.map(item => {
              if (item.isScore) {
                return (
                  <motion.div key={item.label} variants={tileVariants} className="menu-tile" style={{ padding: '20px', gridColumn: 'span 2' }}>
                    <LiveScoreWidget />
                  </motion.div>
                );
              }
              return (
                <motion.div
                  key={item.label}
                  variants={tileVariants}
                  className="menu-tile"
                  onClick={() => navigate(item.route)}
                  style={{ padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: `1px solid ${item.color}30` }}>
                    {item.icon}
                  </div>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>{item.label}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Emergency Guide (only in emergency) */}
          {state.emergencyMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="menu-tile"
              onClick={() => navigate('/fan/emergency')}
              style={{ padding: '22px 18px', display: 'flex', gap: '14px', alignItems: 'center', border: '1px solid rgba(229,62,62,0.4)', background: 'rgba(229,62,62,0.08)' }}
            >
              <div style={{ fontSize: '2rem' }}>⚠️</div>
              <div>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#FC8181' }}>Emergency Guide</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>Your personalized evacuation exit — tap to see it</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating ChatBar */}
      <ChatBar />

      {/* Fixed bottom SOS bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(16, 185, 129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 40 }}>
        <div>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#fff' }}>FIFA Arena 26</p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>MetLife Stadium · Zone {zone}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <LiveScoreWidget compact />
          <SOSButton size="normal" />
        </div>
      </div>
    </div>
  );
}
