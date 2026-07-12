import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { state } = useApp();
  if (!state.isAuthenticated) return <Navigate to="/auth" replace />;
  if (allowedRoles && !allowedRoles.includes(state.userRole)) {
    return <Navigate to={state.userRole === 'fan' ? '/fan' : '/staff'} replace />;
  }
  return children;
}
