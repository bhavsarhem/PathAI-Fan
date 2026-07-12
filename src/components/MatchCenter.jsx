import { motion } from 'framer-motion';

export default function MatchCenter({ data, onClose }) {
  if (!data) return null;

  const { liveMatches, upcomingMatches, pastMatches } = data;

  const MatchCard = ({ match }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3 flex flex-col gap-3">
      {/* Header: Date & Status */}
      <div className="flex justify-between items-center text-xs text-white/50 font-inter">
        <span>{match.date}</span>
        <span className={`font-bold tracking-wider ${match.statusState === 'in' ? 'text-red-500' : match.statusState === 'pre' ? 'text-emerald-500' : 'text-white/40'}`}>
          {match.statusState === 'in' ? (
            <span className="flex items-center gap-2"><span className="live-dot scale-75" /> LIVE • {match.statusDetail}</span>
          ) : (
            match.statusDetail
          )}
        </span>
      </div>

      {/* Main Score Area */}
      <div className="flex justify-between items-center px-2">
        <div className="flex flex-col items-center gap-2 w-1/3 text-center">
          {match.home.logo ? <img src={match.home.logo} alt={match.home.name} className="w-10 h-10 object-contain" /> : <div className="w-10 h-10 bg-white/10 rounded-full" />}
          <span className="text-sm font-outfit font-semibold leading-tight">{match.home.name}</span>
        </div>

        <div className="w-1/3 flex justify-center items-center gap-3">
          {match.statusState === 'pre' ? (
            <span className="text-xl font-outfit text-white/40 font-bold">VS</span>
          ) : (
            <>
              <span className="text-3xl font-outfit font-black text-emerald-400">{match.home.score}</span>
              <span className="text-xl font-outfit text-white/20">-</span>
              <span className="text-3xl font-outfit font-black text-emerald-400">{match.away.score}</span>
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 w-1/3 text-center">
          {match.away.logo ? <img src={match.away.logo} alt={match.away.name} className="w-10 h-10 object-contain" /> : <div className="w-10 h-10 bg-white/10 rounded-full" />}
          <span className="text-sm font-outfit font-semibold leading-tight">{match.away.name}</span>
        </div>
      </div>

      {/* Highlights / Goals */}
      {match.highlights && match.highlights.length > 0 && (
        <div className="mt-2 pt-3 border-t border-white/10">
          <p className="text-[0.7rem] text-emerald-400 font-inter uppercase tracking-wider mb-2 font-semibold flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            Match Highlights
          </p>
          <div className="flex flex-col gap-1">
            {match.highlights.map((h, i) => (
              <span key={i} className="text-xs text-white/70 font-inter leading-relaxed bg-black/20 px-2 py-1 rounded-md inline-block w-fit">
                ⚽ {h.description}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] flex flex-col bg-[#111111] overflow-hidden"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-black/50 border-b border-white/10 backdrop-blur-md shrink-0">
        <h2 className="font-outfit font-bold text-lg text-white">Live Match Center</h2>
        <button 
          onClick={onClose}
          aria-label="Close Match Center"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 safe-bottom">
        
        {liveMatches.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-inter text-red-500 font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live Now
            </h3>
            {liveMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        )}

        {upcomingMatches.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-inter text-emerald-400 font-bold tracking-widest uppercase mb-4">
              Upcoming Schedules
            </h3>
            {upcomingMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        )}

        {pastMatches.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-inter text-white/40 font-bold tracking-widest uppercase mb-4">
              Recent Results
            </h3>
            {pastMatches.slice(0, 10).map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        )}

      </div>
    </motion.div>
  );
}
