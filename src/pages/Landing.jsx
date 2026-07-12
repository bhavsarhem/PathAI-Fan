import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight, Shield } from 'lucide-react';
import LiveScoreWidget from '../components/LiveScoreWidget';
import stadiumBg from '../assets/stadium_bg.jpg';

// ─── Stadium silhouette SVG (synthetic, no real blueprint) ────────────────────
function StadiumSilhouette() {
  return (
    <svg viewBox="0 0 800 300" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', opacity: 0.08, pointerEvents: 'none' }}>
      {/* Outer stadium outline */}
      <ellipse cx="400" cy="280" rx="380" ry="120" fill="none" stroke="#10B981" strokeWidth="2" />
      <ellipse cx="400" cy="260" rx="340" ry="100" fill="none" stroke="#10B981" strokeWidth="1" />
      {/* Roof supports */}
      {[30,100,160,220,280,330,380,420,470,520,570,620,670,720].map((x,i) => (
        <line key={i} x1={x} y1="160" x2={400} y2="80" stroke="#10B981" strokeWidth="0.5" opacity="0.5" />
      ))}
      <ellipse cx="400" cy="280" rx="150" ry="40" fill="#10B981" opacity="0.3" />
      <text x="400" y="285" textAnchor="middle" fontSize="12" fill="#10B981" fontFamily="Outfit, sans-serif" opacity="0.8" fontWeight="600">FIFA ARENA 26</text>
    </svg>
  );
}

const FEATURE_CARDS = [
  {
    icon: '🧭',
    title: 'Smart Navigation',
    desc: 'Seat-based directions to washrooms, food, parking, and gates. No GPS required — works the instant you open the app.',
    color: '#2B6CB0',
    gradient: 'rgba(43,108,176,0.15)',
  },
  {
    icon: '🆘',
    title: 'SOS & Safety',
    desc: 'One tap to reach the nearest security officer, first-aid, or trigger a discreet women-safety alert.',
    color: '#E53E3E',
    gradient: 'rgba(229,62,62,0.15)',
  },
  {
    icon: '🧒',
    title: 'Find Your People',
    desc: 'Report a missing child or companion to security instantly with last-known location, description, and real-time updates.',
    color: '#D69E2E',
    gradient: 'rgba(214,158,46,0.15)',
  },
  {
    icon: '⚽',
    title: 'Live Match Score',
    desc: 'Real-time score updates always visible — every goal, card, and minute from inside the arena.',
    color: '#276749',
    gradient: 'rgba(39,103,73,0.15)',
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(to bottom, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.96) 100%), url(${stadiumBg}) no-repeat center center / cover`, position: 'relative', overflow: 'hidden' }}>
      {/* Background decorative orbs */}
      <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '500px', background: 'radial-gradient(ellipse at center, rgba(26,47,90,0.5) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '300px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16, 185, 129,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* ── Navbar ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(16, 185, 129,0.12)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #10B981, #34D399)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={20} color="#000" />
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.02em' }}>
              PathAI <span style={{ color: '#10B981' }}>Navigator</span>
            </span>
            <span style={{ fontSize: '0.62rem', background: 'rgba(16, 185, 129,0.12)', color: '#10B981', padding: '3px 7px', borderRadius: '4px', fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.06em' }}>
              FIFA 2026
            </span>
          </div>
          <Link to="/auth">
            <button className="btn-gold" style={{ padding: '10px 22px', fontSize: '0.9rem', borderRadius: '12px' }}>
              Sign In
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: '140px', paddingBottom: '80px', position: 'relative', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            {/* Eyebrow */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129,0.1)', border: '1px solid rgba(16, 185, 129,0.25)', borderRadius: '100px', padding: '6px 16px', marginBottom: '28px' }}>
              <span className="live-dot" />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#10B981', fontWeight: 500 }}>
                FIFA World Cup 2026 · Challenge 4 — Smart Stadiums
              </span>
            </div>

            {/* Hero headline */}
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', lineHeight: 1.12, letterSpacing: '-0.03em', color: '#fff', maxWidth: '800px', marginBottom: '24px' }}>
              Find your seat, your people,{' '}
              <span style={{ color: '#10B981' }}>and your way out</span>
              {' '}— before you even ask.
            </h1>

            {/* Sub */}
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.6)', maxWidth: '580px', lineHeight: 1.65, marginBottom: '40px' }}>
              Stadium navigation, one-tap emergency SOS, and smart evacuation assistance — all from your seat number. No GPS, no guesswork.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              <Link to="/auth">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-gold"
                  style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  Sign in with mobile number
                  <ChevronRight size={18} />
                </motion.button>
              </Link>
              <Link to="/auth?demo=staff">
                <button style={{ padding: '14px 24px', fontSize: '0.9rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
                  <Shield size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Staff / Organizer Login
                </button>
              </Link>
            </div>

            {/* Trust signals */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '48px' }}>
              {['Seat-based, not GPS', 'Works offline', 'Anti-rush evacuation', 'Discreet SOS mode'].map(t => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
                  <span style={{ color: '#10B981', fontSize: '1rem' }}>✓</span> {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stadium Silhouette */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '300px' }}>
          <StadiumSilhouette />
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section style={{ padding: '60px 0 80px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}
          >
            {FEATURE_CARDS.map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                className="glass-card glass-card-hover"
                style={{ padding: '28px 24px' }}
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: card.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '16px', border: `1px solid ${card.color}25` }}>
                  {card.icon}
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#fff', marginBottom: '10px' }}>{card.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Live Score Teaser ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: '480px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <LiveScoreWidget />
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '12px' }}>⚽ Live score always on your dashboard — updated in real time</p>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)' }}>
          PathAI Fan Navigator · FIFA World Cup 2026 Hackathon · Challenge 4: Smart Stadiums & Tournament Operations
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.15)', marginTop: '4px' }}>
          Demo app — OTP auth simulated · crowd counts synthetic · no real stadium blueprints
        </p>
      </footer>
    </div>
  );
}
