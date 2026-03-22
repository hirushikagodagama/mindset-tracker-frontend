import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

/**
 * AdminRoute – wraps admin-only pages.
 * Redirects to /admin/login if the admin JWT is not present.
 */
export default function AdminRoute({ children }) {
  const { isAdminAuthenticated } = useAdminAuth();
  return isAdminAuthenticated ? children : <Navigate to="/admin/login" replace />;
}
