import { motion } from 'framer-motion';

export default function LiveScoreWidget({ data, compact = false, onClick }) {
  if (!data || !data.featuredMatch) {
    if (data && data.loading) {
      return (
        <div className="glass-card p-4 flex items-center justify-center h-24 animate-pulse">
          <span className="text-white/40 text-sm font-inter">Loading Live Data...</span>
        </div>
      );
    }
    return null;
  }

  const match = data.featuredMatch;
  const isLive = match.statusState === 'in';

  if (compact) {
    return (
      <button 
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-2 rounded-full w-full justify-between" 
        style={{ background: 'rgba(26,26,26,0.9)', border: '1px solid rgba(16, 185, 129,0.2)' }}
      >
        <div className="flex items-center gap-2">
          {isLive && <span className="live-dot" />}
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#fff', letterSpacing: '0.02em' }}>
            {match.home.name} {match.home.score} – {match.away.score} {match.away.name}
          </span>
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: isLive ? '#10B981' : 'rgba(255,255,255,0.4)' }}>
          {match.statusDetail}
        </span>
      </button>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 cursor-pointer hover:bg-white/10 transition-colors"
    >
      {/* LIVE badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isLive && <span className="live-dot scale-75" />}
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: isLive ? '#E53E3E' : '#10B981', fontWeight: 700, letterSpacing: '0.08em' }}>
            {isLive ? 'LIVE' : (match.statusState === 'pre' ? 'UPCOMING' : 'RESULT')}
          </span>
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>{match.statusDetail}</span>
      </div>

      {/* Scoreboard */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-1 flex-1">
          {match.home.logo ? <img src={match.home.logo} alt={match.home.name} className="h-8 w-8 object-contain" /> : <div className="h-8 w-8 rounded-full bg-white/10" />}
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#fff', textAlign: 'center' }}>{match.home.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {match.statusState === 'pre' ? (
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: 'rgba(255,255,255,0.3)' }}>VS</span>
          ) : (
            <>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.2rem', color: '#10B981', lineHeight: 1 }}>{match.home.score}</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400, fontSize: '1.4rem', color: 'rgba(255,255,255,0.3)' }}>–</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.2rem', color: '#10B981', lineHeight: 1 }}>{match.away.score}</span>
            </>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          {match.away.logo ? <img src={match.away.logo} alt={match.away.name} className="h-8 w-8 object-contain" /> : <div className="h-8 w-8 rounded-full bg-white/10" />}
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#fff', textAlign: 'center' }}>{match.away.name}</span>
        </div>
      </div>

      <div className="mt-3 text-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
        Tap to open Match Center ➔
      </div>
    </motion.div>
  );
}
