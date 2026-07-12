/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect } from 'react';
import { DEMO_INCIDENTS, DEMO_CROWD_COUNTS, DEMO_MATCH, DEMO_RULES } from '../data/mock_data';

const AppContext = createContext(null);

const defaultInitialState = {
  // Auth
  isAuthenticated: false,
  currentUser: null,         // fan or staff object
  userRole: null,            // 'fan' | 'organizer' | 'volunteer' | 'security'

  // Stadium
  crowdCounts: DEMO_CROWD_COUNTS,
  incidents: DEMO_INCIDENTS,
  match: DEMO_MATCH,
  rules: DEMO_RULES,

  // Emergency mode
  emergencyMode: false,
  emergencyGateAssignments: {},  // { zone: gateId }

  // SOS state
  activeSOS: null,               // { incident_id, status, assigned_staff }

  // Chat
  chatMessages: [],
};

const loadInitialState = () => {
  const stored = localStorage.getItem('pathai_stadium_shared_state');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        ...defaultInitialState,
        crowdCounts: parsed.crowdCounts || defaultInitialState.crowdCounts,
        incidents: parsed.incidents || defaultInitialState.incidents,
        rules: parsed.rules || defaultInitialState.rules,
        emergencyMode: parsed.emergencyMode !== undefined ? parsed.emergencyMode : defaultInitialState.emergencyMode,
        emergencyGateAssignments: parsed.emergencyGateAssignments || defaultInitialState.emergencyGateAssignments,
      };
    } catch (e) {
      console.error("Failed to load initial shared state", e);
    }
  }
  return defaultInitialState;
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, currentUser: action.payload.user, userRole: action.payload.role };
    case 'LOGOUT':
      return { ...defaultInitialState };
    case 'UPDATE_PROFILE':
      return { ...state, currentUser: { ...state.currentUser, ...action.payload } };

    case 'SET_CROWD_COUNTS':
      return { ...state, crowdCounts: action.payload };
    case 'UPDATE_CROWD_ZONE':
      return {
        ...state,
        crowdCounts: state.crowdCounts.map(z =>
          z.zone === action.payload.zone ? { ...z, current: action.payload.count } : z
        )
      };

    case 'ADD_INCIDENT':
      return { ...state, incidents: [action.payload, ...state.incidents] };
    case 'CLAIM_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.map(i =>
          i.incident_id === action.payload.incident_id
            ? { ...i, status: 'claimed', assigned_staff_id: action.payload.staff_id }
            : i
        )
      };
    case 'RESOLVE_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.map(i =>
          i.incident_id === action.payload ? { ...i, status: 'resolved' } : i
        )
      };

    case 'SET_ACTIVE_SOS':
      return { ...state, activeSOS: action.payload };
    case 'CLEAR_SOS':
      return { ...state, activeSOS: null };

    case 'TRIGGER_EMERGENCY':
      return { ...state, emergencyMode: true, emergencyGateAssignments: action.payload };
    case 'CLEAR_EMERGENCY':
      return { ...state, emergencyMode: false, emergencyGateAssignments: {} };

    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'CLEAR_CHAT':
      return { ...state, chatMessages: [] };

    case 'UPDATE_RULES':
      return { ...state, rules: action.payload };

    case 'SYNC_SHARED_STATE':
      return {
        ...state,
        crowdCounts: action.payload.crowdCounts || state.crowdCounts,
        incidents: action.payload.incidents || state.incidents,
        rules: action.payload.rules || state.rules,
        emergencyMode: action.payload.emergencyMode !== undefined ? action.payload.emergencyMode : state.emergencyMode,
        emergencyGateAssignments: action.payload.emergencyGateAssignments || state.emergencyGateAssignments,
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadInitialState);

  // Sync state to localStorage
  useEffect(() => {
    if (!state) return;
    const shared = {
      crowdCounts: state.crowdCounts,
      incidents: state.incidents,
      rules: state.rules,
      emergencyMode: state.emergencyMode,
      emergencyGateAssignments: state.emergencyGateAssignments,
    };
    localStorage.setItem('pathai_stadium_shared_state', JSON.stringify(shared));
  }, [state]);

  // Sync from localStorage on external storage updates (other tabs/windows)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'pathai_stadium_shared_state' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          dispatch({ type: 'SYNC_SHARED_STATE', payload: parsed });
        } catch (err) {
          console.error("Failed to parse shared state storage event:", err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Simulate live crowd count fluctuation (demo)
  useEffect(() => {
    if (!state?.crowdCounts) return;
    const interval = setInterval(() => {
      const zones = ["A","B","C","D","E","F","G","H"];
      const zone = zones[Math.floor(Math.random() * zones.length)];
      const delta = Math.floor(Math.random() * 20) - 10;
      dispatch({
        type: 'UPDATE_CROWD_ZONE',
        payload: {
          zone,
          count: Math.max(0, (state.crowdCounts.find(z => z.zone === zone)?.current || 0) + delta)
        }
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [state?.crowdCounts]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

// Helpers are now exported from authHelpers.js to avoid Fast Refresh component export warnings
