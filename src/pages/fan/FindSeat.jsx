import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StadiumWireframe from '../../components/StadiumWireframe';
import ZoneBadge from '../../components/ZoneBadge';
import Navbar from '../../components/Navbar';

const ZONE_WALKING = {
  A: ['Enter through Gate 1 (North Main)', 'Follow the North concourse', 'Section A is on your left — look for the red zone signs'],
  B: ['Enter through Gate 3 (East Upper)', 'Turn right into the East Stand', 'Section B seats are numbered left-to-right'],
  C: ['Enter through Gate 4 (East Lower)', 'Follow green floor markers', 'Section C is in the lower south-east tier'],
  D: ['Enter through Gate 5 (South Main)', 'Walk along the South concourse', 'Section D is directly ahead, lower tier'],
  E: ['Enter through Gate 6 (South-West)', 'Take the left ramp', 'Section E seats face the pitch from the west side'],
  F: ['Enter through Gate 7 (West Lower)', 'The West concourse leads straight to Section F', 'Your seat is in the lower west tier'],
  G: ['Enter through Gate 2 (North-East)', 'Take the escalator to the Upper Tier', 'Section G wraps around the upper level'],
  H: ['Use Gate 8 (VIP / West)', 'Present VIP credential at the dedicated lane', 'VIP seating is in the center upper tier'],
};

export default function FindSeat() {
  const navigate = useNavigate();
  const { state } = useApp();
  const fan = state.currentUser;
  const ticket = fan?.tickets?.[0];
  const seat = ticket?.seat_number || 'A42';
  const zone = seat.charAt(0).toUpperCase();
  const steps = ZONE_WALKING[zone] || ZONE_WALKING.G;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 16px 40px', maxWidth: '720px', margin: '0 auto' }}>
        {/* Back */}
        <button onClick={() => navigate('/fan')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.8rem' }}>🧭</span>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>Find My Seat</h1>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
            Your booked seat is highlighted on the map below.
          </p>

          {/* Seat info card */}
          <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Your Seat</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2.4rem', color: '#10B981', lineHeight: 1 }}>{seat}</p>
            </div>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zone</p>
              <ZoneBadge zone={zone} size="lg" />
            </div>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Entry Gate</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1rem', color: '#fff' }}>{ticket?.gate || 'G1'}</p>
            </div>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Match</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#fff' }}>{ticket?.match || 'USA vs Mexico'}</p>
            </div>
          </div>

          {/* Stadium map */}
          <div style={{ marginBottom: '24px' }}>
            <StadiumWireframe fanZone={zone} showWashrooms showFood showParking />
          </div>

          {/* Walking directions */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#fff', marginBottom: '16px' }}>
              🚶 Walking Directions to Seat {seat}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {steps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.8rem', color: '#000' }}>{i + 1}</div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', paddingTop: '4px', lineHeight: 1.5 }}>{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
