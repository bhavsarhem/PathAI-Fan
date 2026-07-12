import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function LiveScoreWidget({ compact = false }) {
  const { state } = useApp();
  const match = state.match;

  if (!match) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded-full" style={{ background: 'rgba(26,26,26,0.9)', border: '1px solid rgba(16, 185, 129,0.2)' }}>
        <span className="live-dot" />
        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#fff', letterSpacing: '0.02em' }}>
          {match.home_flag} {match.home_score} – {match.away_score} {match.away_flag}
        </span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#10B981' }}>{match.minute}'</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      {/* LIVE badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#E53E3E', fontWeight: 700, letterSpacing: '0.08em' }}>LIVE</span>
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{match.minute}'</span>
      </div>

      {/* Scoreboard */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-1 flex-1">
          <span style={{ fontSize: '2rem' }}>{match.home_flag}</span>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#fff', textAlign: 'center' }}>{match.home_team}</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.2rem', color: '#10B981', lineHeight: 1 }}>{match.home_score}</span>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400, fontSize: '1.4rem', color: 'rgba(255,255,255,0.3)' }}>–</span>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.2rem', color: '#10B981', lineHeight: 1 }}>{match.away_score}</span>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <span style={{ fontSize: '2rem' }}>{match.away_flag}</span>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#fff', textAlign: 'center' }}>{match.away_team}</span>
        </div>
      </div>

      {/* Recent Events */}
      <div className="mt-3 space-y-1">
        {match.events.slice(-3).reverse().map((event, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.6)' }}>{event.description}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>
        {match.venue}
      </div>
    </motion.div>
  );
}
