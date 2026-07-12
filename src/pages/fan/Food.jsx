import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import stadiumLayout from '../../data/stadium_layout.json';
import { ZONE_NEAREST, getSeatZone } from '../../data/mock_data';
import Navbar from '../../components/Navbar';

const FOOD_MENUS = {
  full_menu: ['Burgers & Wraps', 'Hot Dogs', 'Nachos & Dips', 'Soft Drinks & Water', 'Coffee & Snacks'],
  snacks:    ['Popcorn & Chips', 'Hot Dogs', 'Soft Drinks', 'Ice Cream'],
  water:     ['Still Water', 'Sparkling Water', 'Sports Drinks'],
  vip:       ['Gourmet Canapés', 'Premium Beverages', 'Seafood Platter', 'Dessert Selection'],
};

export default function Food() {
  const navigate = useNavigate();
  const { state } = useApp();
  const seat = state.currentUser?.tickets?.[0]?.seat_number || 'A42';
  const zone = getSeatZone(seat);
  const nearestId = ZONE_NEAREST[zone]?.food || 'F1';
  const counter = stadiumLayout.food_counters.find(f => f.id === nearestId) || stadiumLayout.food_counters[0];
  const menu = FOOD_MENUS[counter.type] || FOOD_MENUS.full_menu;

  const TYPE_LABEL = { full_menu: 'Full Menu', snacks: 'Snack Bar', water: 'Water Station', vip: 'VIP Lounge' };
  const TYPE_COLOR = { full_menu: '#276749', snacks: '#744210', water: '#2B6CB0', vip: '#10B981' };
  const color = TYPE_COLOR[counter.type] || '#276749';

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '680px', margin: '0 auto' }}>
        <button onClick={() => navigate('/fan')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.8rem' }}>🍔</span>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>Food & Water</h1>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
            Nearest counter to seat <strong style={{ color: '#fff' }}>{seat}</strong>
          </p>

          {/* Main card */}
          <motion.div className="glass-card" style={{ padding: '28px', marginBottom: '20px', border: `1px solid ${color}30` }}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${color}22`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>🍔</div>
              <div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#fff', marginBottom: '4px' }}>{counter.label}</h2>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: `${color}20`, border: `1px solid ${color}30`, borderRadius: '6px', padding: '3px 8px' }}>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color, fontWeight: 600 }}>{TYPE_LABEL[counter.type]}</span>
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <Clock size={14} color="#10B981" />
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#10B981' }}>~3</span>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>min walk</p>
              </div>
            </div>

            {/* Menu */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '20px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Available Items</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {menu.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.8rem' }}>✓</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Other counters */}
          <div className="glass-card" style={{ padding: '20px 24px' }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>Other Food Counters</p>
            {stadiumLayout.food_counters.filter(f => f.id !== nearestId).slice(0, 4).map(f => {
              const c = TYPE_COLOR[f.type] || '#555';
              return (
                <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#fff' }}>{f.label}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Zone {f.zone}</p>
                  </div>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem', color: c, background: `${c}15`, padding: '2px 8px', borderRadius: '4px' }}>{TYPE_LABEL[f.type]}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
