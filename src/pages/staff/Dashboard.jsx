import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLiveScores } from '../../hooks/useLiveScores';
import Navbar from '../../components/Navbar';
import LiveScoreWidget from '../../components/LiveScoreWidget';
import MatchCenter from '../../components/MatchCenter';

const ORGANIZER_MENUS = [
  { icon: '📊', label: 'Live Crowd Count',   route: '/staff/crowd',     color: '#2B6CB0', roles: ['organizer','volunteer','security'] },
  { icon: '🗺️', label: 'Layout Manager',     route: '/staff/layout',    color: '#276749', roles: ['organizer'] },
  { icon: '📋', label: 'Rules & Regulations',route: '/staff/rules',     color: '#744210', roles: ['organizer'] },
  { icon: '🚨', label: 'Incident Queue',      route: '/staff/incidents', color: '#E53E3E', roles: ['organizer','volunteer','security'] },
  { icon: '📡', label: 'Emergency Broadcast', route: '/staff/broadcast', color: '#97266D', roles: ['organizer'] },
];

const ROLE_COLORS = {
  organizer: { color: '#10B981', bg: 'rgba(16, 185, 129,0.12)', label: 'Organizer' },
  security:  { color: '#E53E3E', bg: 'rgba(229,62,62,0.12)',  label: 'Security Officer' },
  volunteer: { color: '#38A169', bg: 'rgba(56,161,105,0.12)', label: 'Volunteer' },
};

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const tileVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function StaffDashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const liveScores = useLiveScores();
  const [matchCenterOpen, setMatchCenterOpen] = useState(false);
  const role = state.userRole;
  const staff = state.currentUser;
  const roleConfig = ROLE_COLORS[role] || ROLE_COLORS.volunteer;
  const openIncidents = state.incidents.filter(i => i.status === 'open').length;
  const visibleMenus = ORGANIZER_MENUS.filter(m => m.roles.includes(role));

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '720px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px', paddingTop: '20px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: roleConfig.bg, border: `1px solid ${roleConfig.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: roleConfig.color }}>
              {(staff?.name || 'S').charAt(0)}
            </div>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#fff', marginBottom: '2px' }}>
                {staff?.name || 'Staff Member'}
              </h1>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: roleConfig.bg, border: `1px solid ${roleConfig.color}30`, borderRadius: '8px', padding: '4px 12px' }}>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: roleConfig.color }}>{roleConfig.label}</span>
                {staff?.assigned_zone && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>· Zone {staff.assigned_zone}</span>}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'Open Incidents', value: openIncidents, color: '#E53E3E' },
              { label: 'Total Zones', value: 8, color: '#2B6CB0' },
              { label: 'Match Minute', value: liveScores.featuredMatch?.statusState === 'in' ? liveScores.featuredMatch.statusDetail : "0'", color: '#10B981' },
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Score */}
        <div style={{ marginBottom: '24px' }}>
          <LiveScoreWidget data={liveScores} compact onClick={() => setMatchCenterOpen(true)} />
        </div>

        {/* Menu tiles */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}
        >
          {visibleMenus.map(item => (
            <motion.div
              key={item.label}
              variants={tileVariants}
              className="menu-tile"
              onClick={() => navigate(item.route)}
              style={{ padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}
            >
              {item.route === '/staff/incidents' && openIncidents > 0 && (
                <div style={{ position: 'absolute', top: '14px', right: '14px', width: '22px', height: '22px', borderRadius: '50%', background: '#E53E3E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.72rem', color: '#fff' }}>
                  {openIncidents}
                </div>
              )}
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: `1px solid ${item.color}30` }}>
                {item.icon}
              </div>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {matchCenterOpen && <MatchCenter data={liveScores} onClose={() => setMatchCenterOpen(false)} />}
    </div>
  );
}
