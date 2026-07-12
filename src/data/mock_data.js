// ─── Demo Data ────────────────────────────────────────────────────────────────
// All data is synthetic for demo purposes. OTP auth is simulated.

export const DEMO_FANS = [
  {
    fan_id: "FAN001",
    name: "Alex Rivera",
    mobile: "9876543210",
    vehicle_number: "MH 04 AB 4821",
    language: "en",
    tickets: [
      {
        ticket_id: "TK001",
        seat_number: "A42",
        zone: "A",
        gate: "G1",
        venue: "FIFA Arena 26",
        booking_date: "2026-07-15",
        match: "USA vs Mexico"
      }
    ],
    linked_companions: [
      { name: "Sam Rivera", relation: "Child", mobile: "9876543211" }
    ]
  },
  {
    fan_id: "FAN002",
    name: "Priya Nair",
    mobile: "8765432109",
    vehicle_number: null,
    language: "en",
    tickets: [
      {
        ticket_id: "TK002",
        seat_number: "C88",
        zone: "C",
        gate: "G4",
        venue: "FIFA Arena 26",
        booking_date: "2026-07-15",
        match: "USA vs Mexico"
      }
    ],
    linked_companions: []
  }
];

export const DEMO_STAFF = [
  {
    staff_id: "STF001",
    name: "Marcus Johnson",
    role: "organizer",
    mobile: "7654321098",
    assigned_zone: null,
    availability: "available"
  },
  {
    staff_id: "STF002",
    name: "Lena Fischer",
    role: "security",
    mobile: "6543210987",
    assigned_zone: "A",
    availability: "available"
  },
  {
    staff_id: "STF003",
    name: "Carlos Mendez",
    role: "volunteer",
    mobile: "5432109876",
    assigned_zone: "C",
    availability: "busy"
  },
  {
    staff_id: "STF004",
    name: "Aisha Okonkwo",
    role: "security",
    mobile: "4321098765",
    assigned_zone: "E",
    availability: "available"
  },
  {
    staff_id: "STF005",
    name: "James Park",
    role: "volunteer",
    mobile: "3210987654",
    assigned_zone: "D",
    availability: "available"
  }
];

export const DEMO_INCIDENTS = [
  {
    incident_id: "INC001",
    type: "sos_medical",
    label: "Medical Emergency",
    fan_id: "FAN001",
    fan_name: "Alex Rivera",
    seat: "A42",
    zone: "A",
    status: "open",
    assigned_staff_id: null,
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    description: "Fan reported feeling dizzy and unwell"
  },
  {
    incident_id: "INC002",
    type: "missing_person",
    label: "Missing Child",
    fan_id: "FAN002",
    fan_name: "Priya Nair",
    seat: "C88",
    zone: "C",
    status: "claimed",
    assigned_staff_id: "STF005",
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    description: "Missing child — approx 7 years old, red jersey"
  },
  {
    incident_id: "INC003",
    type: "women_safety",
    label: "Women Safety Alert",
    fan_id: null,
    fan_name: "Anonymous",
    seat: "E15",
    zone: "E",
    status: "open",
    assigned_staff_id: null,
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    description: "Discreet safety alert triggered from Zone E"
  },
  {
    incident_id: "INC004",
    type: "sos_security",
    label: "Security Alert",
    fan_id: "FAN001",
    fan_name: "Alex Rivera",
    seat: "B22",
    zone: "B",
    status: "resolved",
    assigned_staff_id: "STF002",
    timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
    description: "Crowd confrontation near Gate 3 concourse"
  }
];

export const DEMO_CROWD_COUNTS = [
  { zone: "A", zone_label: "Zone A — Lower North",    current: 980,  capacity: 1200 },
  { zone: "B", zone_label: "Zone B — Lower East",     current: 840,  capacity: 1100 },
  { zone: "C", zone_label: "Zone C — Lower South-East",current:1100, capacity: 1300 },
  { zone: "D", zone_label: "Zone D — Lower South",    current: 950,  capacity: 1200 },
  { zone: "E", zone_label: "Zone E — Lower South-West",current: 720, capacity: 1100 },
  { zone: "F", zone_label: "Zone F — Lower West",     current: 890,  capacity: 1100 },
  { zone: "G", zone_label: "Zone G — Upper Tier",     current: 2200, capacity: 3000 },
  { zone: "H", zone_label: "Zone H — VIP / Corporate",current: 380,  capacity: 500  }
];

export const DEMO_MATCH = {
  match_id: "WC2026_001",
  home_team: "United States",
  away_team: "Mexico",
  home_flag: "🇺🇸",
  away_flag: "🇲🇽",
  home_score: 2,
  away_score: 1,
  minute: 67,
  status: "LIVE",
  venue: "FIFA Arena 26, New Jersey",
  date: "2026-07-15",
  events: [
    { minute: 14, type: "goal", team: "home", player: "Pulisic", description: "Pulisic ⚽ 14'" },
    { minute: 31, type: "goal", team: "away", player: "Lozano",  description: "Lozano ⚽ 31'" },
    { minute: 55, type: "goal", team: "home", player: "Reyna",   description: "Reyna ⚽ 55'" },
    { minute: 62, type: "yellow", team: "away", player: "Herrera", description: "Herrera 🟨 62'" }
  ]
};

export const DEMO_RULES = [
  { id: "R1", title: "No Alcohol Policy", content: "Alcohol is strictly prohibited inside the stadium. Violations will result in immediate removal from the premises.", category: "Safety" },
  { id: "R2", title: "Prohibited Items", content: "The following items are not permitted: large bags (>15L), bottles, umbrellas, selfie sticks, laser pointers, and professional camera equipment.", category: "Security" },
  { id: "R3", title: "Seat Assignment", content: "All fans must remain in their assigned seats. Standing in aisles or stairways is not permitted for safety reasons.", category: "Operations" },
  { id: "R4", title: "Emergency Evacuation", content: "In case of emergency, follow instructions from stadium staff and the app. Do not rush exits. Different sections will be directed to different gates.", category: "Emergency" },
  { id: "R5", title: "Photography Policy", content: "Personal photography for non-commercial use is permitted. Drones and professional equipment require prior authorization.", category: "General" },
  { id: "R6", title: "Medical Assistance", content: "First-aid stations are located in each zone. For urgent medical assistance, use the SOS feature in this app or contact the nearest security officer.", category: "Safety" }
];

// ─── Nearest Lookup (deterministic, seat-based) ───────────────────────────────
export function getSeatZone(seatNumber) {
  if (!seatNumber) return null;
  const prefix = seatNumber.charAt(0).toUpperCase();
  const zones = ["A","B","C","D","E","F","G","H"];
  return zones.includes(prefix) ? prefix : "G"; // default to upper tier
}

export const ZONE_NEAREST = {
  A: { washroom: "W1",  food: "F1",  parking: "P1", gate: "G1", first_aid: "FA1", security: "SP1" },
  B: { washroom: "W3",  food: "F3",  parking: "P2", gate: "G3", first_aid: "FA2", security: "SP2" },
  C: { washroom: "W4",  food: "F4",  parking: "P2", gate: "G4", first_aid: "FA2", security: "SP3" },
  D: { washroom: "W6",  food: "F6",  parking: "P3", gate: "G5", first_aid: "FA3", security: "SP4" },
  E: { washroom: "W8",  food: "F7",  parking: "P3", gate: "G6", first_aid: "FA4", security: "SP5" },
  F: { washroom: "W10", food: "F9",  parking: "P4", gate: "G7", first_aid: "FA4", security: "SP6" },
  G: { washroom: "W2",  food: "F2",  parking: "P1", gate: "G2", first_aid: "FA5", security: "SP8" },
  H: { washroom: "W5",  food: "F5",  parking: "P1", gate: "G8", first_aid: "FA6", security: "SP8" }
};

// ─── Evacuation Logic (rule-based, not LLM) ───────────────────────────────────
// Primary zone→gate mapping. If a gate is overloaded, reroute to secondary.
export const EVACUATION_GATE_CAPACITY = { G1:1000, G2:800, G3:900, G4:900, G5:1000, G6:800, G7:700, G8:600 };

export const ZONE_GATE_MAP = {
  A: { primary: "G1", secondary: "G2" },
  B: { primary: "G3", secondary: "G2" },
  C: { primary: "G4", secondary: "G3" },
  D: { primary: "G5", secondary: "G6" },
  E: { primary: "G6", secondary: "G7" },
  F: { primary: "G7", secondary: "G8" },
  G: { primary: "G2", secondary: "G1" },
  H: { primary: "G8", secondary: "G7" }
};

// Simple directions per gate for evacuation narration
export const GATE_DIRECTIONS = {
  G1: "Head north up the main concourse, through the wide archway marked 'Gate 1'. Assembly point is the North Plaza.",
  G2: "Take the north-east corridor past Section A12. Gate 2 is signposted in blue. Assembly: East Forecourt.",
  G3: "Use the east walkway. Follow the green exit signs through the East Stand concourse to Gate 3.",
  G4: "Move to the south-east. The corridor near Washroom W4 leads directly to Gate 4. Assembly: East Car Park entrance.",
  G5: "Head south down the main aisle towards the South Stand. Gate 5 is the large red-marked exit. Assembly: South Lawn.",
  G6: "Take the south-west ramp — follow yellow arrows past Food Court F7 to Gate 6. Assembly: South-West Lot.",
  G7: "Move west through the lower concourse. Gate 7 is marked with orange signage near the West Stand.",
  G8: "Use the VIP / West upper exit. Take the escalator down to Level 1 then follow signs to Gate 8."
};

export function getEvacuationGate(zone, currentGateCrowds = {}) {
  const map = ZONE_GATE_MAP[zone] || ZONE_GATE_MAP["G"];
  const primaryLoad = currentGateCrowds[map.primary] || 0;
  const primaryCap  = EVACUATION_GATE_CAPACITY[map.primary] || 1000;
  // If primary gate is >80% crowd, use secondary
  if (primaryLoad / primaryCap > 0.8) {
    return map.secondary;
  }
  return map.primary;
}
