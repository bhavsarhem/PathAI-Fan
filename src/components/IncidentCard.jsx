import { motion } from 'framer-motion';
import { Clock, MapPin, User, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TYPE_CONFIG = {
  sos_medical:    { label: 'Medical',       color: '#38A169', bg: 'rgba(56,161,105,0.15)',  icon: '⚕️' },
  sos_security:   { label: 'Security',      color: '#DD6B20', bg: 'rgba(221,107,32,0.15)',  icon: '🛡️' },
  sos_general:    { label: 'SOS',           color: '#E53E3E', bg: 'rgba(229,62,62,0.15)',   icon: '🆘' },
  women_safety:   { label: 'Women Safety',  color: '#C084FC', bg: 'rgba(192,132,252,0.15)', icon: '🌸' },
  missing_person: { label: 'Missing Person',color: '#F6AD55', bg: 'rgba(246,173,85,0.15)',  icon: '🧒' },
};

function timeSince(timestamp) {
  const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  return `${Math.floor(diff/3600)}h ago`;
}

export default function IncidentCard({ incident, currentStaffId }) {
  const { dispatch } = useApp();
  const cfg = TYPE_CONFIG[incident.type] || TYPE_CONFIG.sos_general;

  const handleClaim = () => {
    dispatch({ type: 'CLAIM_INCIDENT', payload: { incident_id: incident.incident_id, staff_id: currentStaffId } });
  };
  const handleResolve = () => {
    dispatch({ type: 'RESOLVE_INCIDENT', payload: incident.incident_id });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
      style={{ borderLeft: `3px solid ${cfg.color}` }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left */}
        <div className="flex gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ background: cfg.bg }}>
            {cfg.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: cfg.color }}>{cfg.label}</span>
              <span className={`badge-${incident.status} px-2 py-0.5 rounded-full text-xs font-medium`} style={{ fontFamily: 'Inter, sans-serif' }}>
                {incident.status}
              </span>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {incident.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                <MapPin size={11} /> Seat {incident.seat} · Zone {incident.zone}
              </span>
              <span className="flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                <User size={11} /> {incident.fan_name}
              </span>
              <span className="flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                <Clock size={11} /> {timeSince(incident.timestamp)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {incident.status === 'open' && (
            <button
              onClick={handleClaim}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40`, fontFamily: 'Outfit, sans-serif' }}
            >
              Claim
            </button>
          )}
          {incident.status === 'claimed' && incident.assigned_staff_id === currentStaffId && (
            <button
              onClick={handleResolve}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80 flex items-center gap-1"
              style={{ background: 'rgba(56,161,105,0.15)', color: '#68D391', border: '1px solid rgba(56,161,105,0.3)', fontFamily: 'Outfit, sans-serif' }}
            >
              <CheckCircle2 size={12} /> Resolve
            </button>
          )}
          {incident.status === 'resolved' && (
            <span style={{ fontSize: '0.72rem', color: '#68D391', fontFamily: 'Inter, sans-serif' }}>✓ Done</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
