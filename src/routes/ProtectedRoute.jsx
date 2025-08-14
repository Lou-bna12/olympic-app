import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { authReady, isAuthenticated } = useAuth() ?? {};
  if (!authReady) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
