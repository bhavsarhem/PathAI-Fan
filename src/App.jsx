import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ChatProvider } from './context/ChatContext';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';

// Fan pages
import FanDashboard from './pages/fan/Dashboard';
import FindSeat from './pages/fan/FindSeat';
import Washroom from './pages/fan/Washroom';
import Food from './pages/fan/Food';
import Parking from './pages/fan/Parking';
import Exit from './pages/fan/Exit';
import SOS from './pages/fan/SOS';
import FindPerson from './pages/fan/FindPerson';
import WomenSafety from './pages/fan/WomenSafety';
import EmergencyGuide from './pages/fan/EmergencyGuide';

// Staff pages
import StaffDashboard from './pages/staff/Dashboard';
import CrowdCount from './pages/staff/CrowdCount';
import LayoutManager from './pages/staff/LayoutManager';
import Rules from './pages/staff/Rules';
import IncidentQueue from './pages/staff/IncidentQueue';
import Broadcast from './pages/staff/Broadcast';

// Guards
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AppProvider>
      <ChatProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />

            {/* Fan routes */}
            <Route path="/fan" element={<ProtectedRoute allowedRoles={['fan']}><FanDashboard /></ProtectedRoute>} />
            <Route path="/fan/seat" element={<ProtectedRoute allowedRoles={['fan']}><FindSeat /></ProtectedRoute>} />
            <Route path="/fan/washroom" element={<ProtectedRoute allowedRoles={['fan']}><Washroom /></ProtectedRoute>} />
            <Route path="/fan/food" element={<ProtectedRoute allowedRoles={['fan']}><Food /></ProtectedRoute>} />
            <Route path="/fan/parking" element={<ProtectedRoute allowedRoles={['fan']}><Parking /></ProtectedRoute>} />
            <Route path="/fan/exit" element={<ProtectedRoute allowedRoles={['fan']}><Exit /></ProtectedRoute>} />
            <Route path="/fan/sos" element={<ProtectedRoute allowedRoles={['fan']}><SOS /></ProtectedRoute>} />
            <Route path="/fan/find-person" element={<ProtectedRoute allowedRoles={['fan']}><FindPerson /></ProtectedRoute>} />
            <Route path="/fan/women-safety" element={<ProtectedRoute allowedRoles={['fan']}><WomenSafety /></ProtectedRoute>} />
            <Route path="/fan/emergency" element={<ProtectedRoute allowedRoles={['fan']}><EmergencyGuide /></ProtectedRoute>} />

            {/* Staff routes */}
            <Route path="/staff" element={<ProtectedRoute allowedRoles={['organizer','volunteer','security']}><StaffDashboard /></ProtectedRoute>} />
            <Route path="/staff/crowd" element={<ProtectedRoute allowedRoles={['organizer','volunteer','security']}><CrowdCount /></ProtectedRoute>} />
            <Route path="/staff/layout" element={<ProtectedRoute allowedRoles={['organizer','volunteer','security']}><LayoutManager /></ProtectedRoute>} />
            <Route path="/staff/rules" element={<ProtectedRoute allowedRoles={['organizer','volunteer','security']}><Rules /></ProtectedRoute>} />
            <Route path="/staff/incidents" element={<ProtectedRoute allowedRoles={['organizer','volunteer','security']}><IncidentQueue /></ProtectedRoute>} />
            <Route path="/staff/broadcast" element={<ProtectedRoute allowedRoles={['organizer']}><Broadcast /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ChatProvider>
    </AppProvider>
  );
}
