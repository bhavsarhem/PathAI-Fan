import stadiumLayout from '../data/stadium_layout.json';

// ─── Icon renderers ────────────────────────────────────────────────────────────
const WashroomIcon = ({ x, y, accessible }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r="8" fill={accessible ? "#2B6CB0" : "#553C9A"} fillOpacity="0.85" />
    <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="white">🚻</text>
  </g>
);

const FoodIcon = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r="8" fill="#276749" fillOpacity="0.85" />
    <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="white">🍔</text>
  </g>
);

const GateIcon = ({ x, y, label, id, highlighted }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x="-22" y="-12" width="44" height="24" rx="6"
      fill={highlighted ? "#10B981" : "rgba(255,255,255,0.1)"}
      stroke={highlighted ? "#34D399" : "rgba(255,255,255,0.25)"}
      strokeWidth="1"
    />
    <text textAnchor="middle" dominantBaseline="central" fontSize="9"
      fill={highlighted ? "#000" : "#fff"} fontWeight="600" fontFamily="Outfit, sans-serif">
      {id}
    </text>
  </g>
);

const ParkingIcon = ({ x, y, id }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x="-14" y="-10" width="28" height="20" rx="4" fill="#1A2F5A" stroke="rgba(16, 185, 129,0.4)" strokeWidth="1" />
    <text textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#10B981" fontWeight="700" fontFamily="Outfit, sans-serif">P</text>
  </g>
);

const FirstAidIcon = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r="8" fill="#276749" fillOpacity="0.9" />
    <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="white">⚕️</text>
  </g>
);

const SecurityIcon = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r="8" fill="#744210" fillOpacity="0.9" />
    <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="white">🛡️</text>
  </g>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function StadiumWireframe({
  fanZone = null,
  highlightGate = null,
  showWashrooms = true,
  showFood = true,
  showParking = true,
  showFirstAid = false,
  showSecurity = false,
  interactive = false,
  onZoneClick = null,
  width = 700,
  height = 540,
}) {
  const { zones, gates, washrooms, food_counters, parking_zones, first_aid, security_points } = stadiumLayout;
  const vw = stadiumLayout.svg_width;
  const vh = stadiumLayout.svg_height;

  return (
    <div className="relative w-full" style={{ background: 'rgba(10,10,10,0.6)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129,0.15)', overflow: 'hidden' }}>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-4 pt-3 pb-1">
        {showWashrooms && <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>🚻 Washroom</span>}
        {showFood      && <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>🍔 Food/Water</span>}
        {showParking   && <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>P Parking</span>}
        {showFirstAid  && <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>⚕️ First Aid</span>}
        {showSecurity  && <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>🛡️ Security</span>}
        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>⬜ Gates</span>
        {fanZone && <span style={{ fontSize: '0.72rem', color: '#10B981', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>⭐ Your Zone: {fanZone}</span>}
      </div>

      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        style={{ width: '100%', height: 'auto' }}
        aria-label="Stadium Layout Map"
      >
        {/* Field (center) */}
        <ellipse cx="400" cy="305" rx="130" ry="100" fill="#0A3D0A" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <ellipse cx="400" cy="305" rx="65" ry="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="400" cy="305" r="5" fill="rgba(255,255,255,0.2)" />
        {/* Field lines */}
        <line x1="400" y1="205" x2="400" y2="405" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <text x="400" y="315" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.2)" fontFamily="Outfit, sans-serif">FIELD</text>

        {/* Zone ellipses */}
        {zones.map(zone => {
          const isActive = fanZone === zone.zone_id;
          const clickProps = interactive && onZoneClick ? { onClick: () => onZoneClick(zone), style: { cursor: 'pointer' } } : {};
          return (
            <g key={zone.zone_id} {...clickProps}>
              <ellipse
                cx={zone.cx} cy={zone.cy}
                rx={zone.rx} ry={zone.ry}
                fill={zone.color}
                fillOpacity={isActive ? 0.45 : 0.18}
                stroke={isActive ? '#10B981' : zone.color}
                strokeWidth={isActive ? 2.5 : 1}
                strokeOpacity={isActive ? 1 : 0.5}
              />
              {isActive && (
                <ellipse cx={zone.cx} cy={zone.cy} rx={zone.rx + 5} ry={zone.ry + 5}
                  fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4,3" strokeOpacity="0.6" />
              )}
              <text x={zone.cx} y={zone.cy - 4} textAnchor="middle" fontSize="13"
                fill={isActive ? '#10B981' : 'rgba(255,255,255,0.7)'}
                fontWeight={isActive ? "700" : "500"}
                fontFamily="Outfit, sans-serif">
                {zone.zone_id}
              </text>
              {isActive && (
                <text x={zone.cx} y={zone.cy + 10} textAnchor="middle" fontSize="8" fill="#34D399" fontFamily="Inter, sans-serif">YOU</text>
              )}
            </g>
          );
        })}

        {/* Gates */}
        {gates.map(gate => (
          <GateIcon key={gate.gate_id} x={gate.x} y={gate.y} id={gate.gate_id} label={gate.label} highlighted={highlightGate === gate.gate_id} />
        ))}

        {/* Facilities */}
        {showWashrooms && washrooms.map(w => <WashroomIcon key={w.id} x={w.x} y={w.y} accessible={w.accessible} />)}
        {showFood      && food_counters.map(f => <FoodIcon key={f.id} x={f.x} y={f.y} />)}
        {showParking   && parking_zones.map(p => <ParkingIcon key={p.id} x={p.x} y={p.y} id={p.id} />)}
        {showFirstAid  && first_aid.map(fa => <FirstAidIcon key={fa.id} x={fa.x} y={fa.y} />)}
        {showSecurity  && security_points.map(sp => <SecurityIcon key={sp.id} x={sp.x} y={sp.y} />)}
      </svg>
    </div>
  );
}
