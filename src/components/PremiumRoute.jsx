import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPremiumFeatureMessage, isPremiumUser } from '../utils/access';

const PremiumRoute = ({ children, featureName = 'This feature' }) => {
  const { user, isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading && isAuthenticated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isPremiumUser(user)) {
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
