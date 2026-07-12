import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Navbar from '../../components/Navbar';

function getColor(pct) {
  if (pct >= 90) return '#E53E3E';
  if (pct >= 70) return '#D69E2E';
  return '#38A169';
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    const pct = Math.round((d.current / d.capacity) * 100);
    return (
      <div style={{ background: '#1A1A1A', border: '1px solid rgba(16, 185, 129,0.2)', borderRadius: '10px', padding: '12px 16px' }}>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#fff', marginBottom: '4px' }}>{d.zone_label}</p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>{d.current.toLocaleString()} / {d.capacity.toLocaleString()} ({pct}%)</p>
      </div>
    );
  }
  return null;
};

export default function CrowdCount() {
  const navigate = useNavigate();
  const { state } = useApp();
  const counts = state.crowdCounts;

  const chartData = counts.map(z => ({
    ...z,
    pct: Math.round((z.current / z.capacity) * 100),
  }));

  const totalCurrent = counts.reduce((a, b) => a + b.current, 0);
  const totalCap = counts.reduce((a, b) => a + b.capacity, 0);
  const overallPct = Math.round((totalCurrent / totalCap) * 100);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate('/staff')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <span style={{ fontSize: '1.8rem' }}>📊</span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>Live Crowd Count</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.25)', borderRadius: '8px', padding: '4px 10px', marginLeft: '4px' }}>
            <span className="live-dot" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#FC8181', fontWeight: 600 }}>LIVE</span>
          </div>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
          Crowd counts update every 5 seconds. Demo data is simulated.
        </p>

        {/* Overall */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total Fans', value: totalCurrent.toLocaleString(), color: '#10B981' },
            { label: 'Capacity', value: totalCap.toLocaleString(), color: 'rgba(255,255,255,0.5)' },
            { label: 'Overall %', value: `${overallPct}%`, color: getColor(overallPct) },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>Crowd by Zone</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="zone" tick={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fill: 'rgba(255,255,255,0.6)', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="current" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={getColor(entry.pct)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
            {[['#38A169', '< 70%'], ['#D69E2E', '70–90%'], ['#E53E3E', '> 90%']].map(([c, l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: c, display: 'inline-block' }} />
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Zone list */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>Zone Detail</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {chartData.map(z => {
              const color = getColor(z.pct);
              return (
                <motion.div key={z.zone} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color, flexShrink: 0 }}>{z.zone}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>{z.zone_label.split('—')[1]?.trim() || z.zone_label}</span>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color, fontWeight: 600 }}>{z.current.toLocaleString()} / {z.capacity.toLocaleString()}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${z.pct}%` }} transition={{ duration: 0.7, ease: 'easeOut' }}
                        style={{ height: '100%', background: color, borderRadius: '4px' }} />
                    </div>
                  </div>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color, fontWeight: 600, width: '36px', textAlign: 'right', flexShrink: 0 }}>{z.pct}%</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
