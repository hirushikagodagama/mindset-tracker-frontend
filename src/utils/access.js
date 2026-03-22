const PREMIUM_STATUSES = new Set(['active']);

export const isPremiumUser = (user) => {
  if (!user) {
    return false;
  }

  if (user.accessTier === 'premium' || user.featureAccess?.tier === 'premium' || user.role === 'admin') {
    return true;
  }

  if (PREMIUM_STATUSES.has(user.subscriptionStatus)) {
    return true;
  }

  if (user.subscriptionStatus === 'cancelled' && user.subscriptionEndDate) {
    return new Date(user.subscriptionEndDate) >= new Date();
  }

  return false;
};

export const getAccessTier = (user) => (isPremiumUser(user) ? 'premium' : 'free');

export const getDefaultAppRoute = (user) => '/dashboard';

export const getPremiumFeatureMessage = (featureName = 'This feature') =>
  `${featureName} is available on Premium. Upgrade to unlock the full productivity suite.`;
