import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import IncidentCard from '../../components/IncidentCard';
import Navbar from '../../components/Navbar';

const FILTERS = ['all', 'open', 'claimed', 'resolved'];

export default function IncidentQueue() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [filter, setFilter] = useState('open');

  const staffId = state.currentUser?.staff_id;
  const incidents = state.incidents.filter(i => filter === 'all' ? true : i.status === filter);
  const openCount = state.incidents.filter(i => i.status === 'open').length;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '720px', margin: '0 auto' }}>
        <button onClick={() => navigate('/staff')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <span style={{ fontSize: '1.8rem' }}>🚨</span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>Incident Queue</h1>
          {openCount > 0 && (
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E53E3E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
              {openCount}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.25)', borderRadius: '8px', padding: '4px 10px', marginLeft: '4px' }}>
            <span className="live-dot" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#FC8181', fontWeight: 600 }}>LIVE</span>
          </div>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
          Claim and resolve SOS, missing person, and women safety incidents.
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const count = f === 'all' ? state.incidents.length : state.incidents.filter(i => i.status === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.82rem', background: filter === f ? (f === 'open' ? '#E53E3E' : f === 'claimed' ? '#D69E2E' : f === 'resolved' ? '#38A169' : '#10B981') : 'rgba(255,255,255,0.06)', color: filter === f ? '#fff' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {f} <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '4px', padding: '1px 6px', fontSize: '0.72rem' }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Incidents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {incidents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✅</div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>
                No {filter === 'all' ? '' : filter} incidents
              </p>
            </div>
          ) : (
            incidents.map(incident => (
              <IncidentCard key={incident.incident_id} incident={incident} currentStaffId={staffId} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
