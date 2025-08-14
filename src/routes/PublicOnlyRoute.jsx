import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicOnlyRoute() {
  const { authReady, isAuthenticated } = useAuth() ?? {};
  if (!authReady) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
