import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SOSButton({ size = 'normal' }) {
  const navigate = useNavigate();
  const isLarge = size === 'large';

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={() => navigate('/fan/sos')}
      className="btn-sos flex flex-col items-center justify-center gap-1 select-none"
      style={{
        width: isLarge ? '96px' : '64px',
        height: isLarge ? '96px' : '64px',
        fontSize: isLarge ? '1.8rem' : '1.2rem',
      }}
      aria-label="SOS Emergency Alert"
    >
      <span>🆘</span>
      {isLarge && (
        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', fontWeight: 700 }}>SOS</span>
      )}
    </motion.button>
  );
}
