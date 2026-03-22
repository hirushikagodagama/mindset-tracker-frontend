import api from './api';

/** Create a checkout session (returns data needed for Paddle.Checkout.open) */
export const createCheckoutSession = (plan) => 
  api.post('/payments/create-checkout-session', { 
    plan, 
    returnUrl: `${window.location.origin}/dashboard?payment=success` 
  });

/** Verify a completed checkout transaction */
export const verifyCheckout = (transactionId) => 
  api.post('/payments/verify-checkout', { transactionId });

/** Change existing subscription plan */
export const changePlan = (plan) => 
  api.post('/payments/change-plan', { plan });

/** Cancel existing subscription */
export const cancelSubscription = (effectiveFrom) => 
  api.post('/payments/cancel-subscription', { effectiveFrom });

/** Get user's payment history */
export const getMyPayments = () => 
  api.get('/payments/my');
