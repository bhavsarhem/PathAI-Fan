const ZONE_COLORS = {
  A: '#E53E3E', B: '#DD6B20', C: '#D69E2E', D: '#276749',
  E: '#2B6CB0', F: '#553C9A', G: '#97266D', H: '#10B981',
};

export default function ZoneBadge({ zone, size = 'md' }) {
  const color = ZONE_COLORS[zone] || '#555';
  const padding = size === 'sm' ? '2px 8px' : size === 'lg' ? '6px 16px' : '4px 12px';
  const fontSize = size === 'sm' ? '0.7rem' : size === 'lg' ? '1rem' : '0.8rem';

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: `${color}22`, color, border: `1px solid ${color}55`,
      borderRadius: '6px', padding, fontFamily: 'Outfit, sans-serif',
      fontWeight: 700, fontSize, letterSpacing: '0.04em',
    }}>
      Zone {zone}
    </span>
  );
}
