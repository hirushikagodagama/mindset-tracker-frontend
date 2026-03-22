import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPremiumFeatureMessage, isPremiumUser } from '../utils/access';

const PremiumRoute = ({ children, featureName = 'This feature' }) => {
  const { user, isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  // Allow access to dashboard when returning from Paddle checkout with _ptxn so we can verify payment
  const hasPtxn = new URLSearchParams(location.search).get('_ptxn');
  const isPostPaymentRedirect = location.pathname === '/dashboard' && !!hasPtxn;

  if (authLoading && isAuthenticated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isPremiumUser(user) && !isPostPaymentRedirect) {
    return (
      <Navigate
        to="/pricing"
        state={{
          from: location,
          message: getPremiumFeatureMessage(featureName),
        }}
        replace
      />
    );
  }

  return children;
};

export default PremiumRoute;
