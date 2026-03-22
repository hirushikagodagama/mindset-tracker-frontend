import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPublicPricing } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getDefaultAppRoute } from '../utils/access';
import { createCheckoutSession } from '../services/paymentService'; // Import the service

const DEFAULT_PRICING = {
  monthlyPrice: 9.99,
  yearlyPrice: 79.99,
  lifetimePrice: 199.99,
  lifetimePlanEnabled: true,
  freeTrialEnabled: false,
  freeTrialDays: 7,
  discountActive: false,
  discountPercentage: 0,
};

const fmt = (value) => `$${Number(value || 0).toFixed(2)}`;

const LOCKED_FEATURES = ['Mindset monitoring', 'Analytics & reports', 'AI coaching'];

export default function PricingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [pricing, setPricing] = useState(DEFAULT_PRICING);

  const bannerMessage =
    location.state?.message ||
    'Free includes Habit Tracker only. Upgrade to unlock mindset tracking, analytics, reports, and AI coaching.';

  useEffect(() => {
    getPublicPricing()
      .then((data) => {
        if (data) setPricing((prev) => ({ ...prev, ...data }));
      })
      .catch(console.error);
  }, []);

  const effectiveMonthly = pricing.discountActive
    ? pricing.monthlyPrice * (1 - pricing.discountPercentage / 100)
    : pricing.monthlyPrice;

  const effectiveYearly = pricing.discountActive
    ? pricing.yearlyPrice * (1 - pricing.discountPercentage / 100)
    : pricing.yearlyPrice;

  const goToSignup = () => navigate(isAuthenticated ? getDefaultAppRoute(user) : '/signup');

  const handleCheckout = async (planId) => {
    if (!isAuthenticated) {
      return navigate('/signup', { state: { planId } });
    }

    try {
      const response = await createCheckoutSession(planId);
      const checkoutData = response.data.data;

      // Use the global Paddle instance (set in App.jsx or loaded by script)
      if (window.Paddle) {
        // Paddle Billing (v3) open method
        window.Paddle.Checkout.open(checkoutData);
      } else {
        console.error('Paddle instance not found on window');
        window.alert('Payment system is still initializing. Please wait a moment and try again.');
      }
    } catch (err) {
      console.error('Checkout error detail:', err);
      const msg = err.response?.data?.message || err.message || 'Could not start checkout. Please try again later.';
      window.alert(`Checkout Error: ${msg}`);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      badge: null,
      price: '$0',
      priceSub: '/forever',
      originalPrice: null,
      description: 'Habit Tracker only — the perfect starting point.',
      features: ['Unlimited habit tracking', 'Daily habit check-ins', 'Basic progress history', 'Streak tracking'],
      lockedFeatures: LOCKED_FEATURES,
      color: 'border-white/[0.1]',
      highlight: false,
      cta: isAuthenticated ? 'Continue with Free' : 'Start for Free',
      onClick: goToSignup,
    },
    {
      id: 'monthly',
      name: 'Monthly',
      badge: 'Most Popular',
      price: pricing.freeTrialEnabled ? 'Free' : fmt(effectiveMonthly),
      priceSub: pricing.freeTrialEnabled ? `/${pricing.freeTrialDays} day trial` : '/month',
      originalPrice: pricing.freeTrialEnabled ? fmt(effectiveMonthly) : (pricing.discountActive ? fmt(pricing.monthlyPrice) : null),
      description: pricing.freeTrialEnabled
        ? `Try all premium features free for ${pricing.freeTrialDays} days. Card required.`
        : 'Full access to all features. Cancel anytime.',
      features: ['Everything in Free', 'Mindset monitoring', 'Analytics & reports', 'AI coaching', 'Custom categories', 'Data export'],
      lockedFeatures: [],
      color: 'border-accent/40',
      highlight: true,
      cta: pricing.freeTrialEnabled ? `Start Free Trial (${pricing.freeTrialDays} days)` : 'Choose Monthly',
      onClick: () => handleCheckout('monthly'),
    },
    {
      id: 'yearly',
      name: 'Yearly',
      badge: 'Best Value',
      price: fmt(effectiveYearly),
      priceSub: '/year',
      originalPrice: pricing.discountActive ? fmt(pricing.yearlyPrice) : null,
      description: 'Save more with annual billing. Full premium access all year.',
      features: ['Everything in Monthly', 'Lower annual cost', 'Priority support', 'All future features'],
      lockedFeatures: [],
      color: 'border-accent2/20',
      highlight: false,
      cta: 'Choose Yearly',
      onClick: () => handleCheckout('yearly'),
    },
    ...(pricing.lifetimePlanEnabled ? [{
      id: 'lifetime',
      name: 'Lifetime',
      badge: '✨ One-time',
      price: fmt(pricing.lifetimePrice),
      priceSub: 'one-time',
      originalPrice: null,
      description: 'Pay once, own MindSetTracker forever. No recurring fees.',
      features: ['Everything in Monthly', 'All future features included', 'Lifetime priority support', 'Founding member status'],
      lockedFeatures: [],
      color: 'border-yellow-500/25',
      highlight: false,
      cta: 'Get Lifetime Access',
      onClick: () => handleCheckout('lifetime'),
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-[450px] h-[450px] rounded-full bg-purple opacity-10 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-accent opacity-10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl">
        {/* Banner */}
        <div className="flex items-start gap-3 bg-accent/10 border border-accent/25 rounded-card px-5 py-4 mb-10 max-w-2xl mx-auto">
          <span className="text-accent text-xl mt-0.5">ℹ</span>
          <div>
            <p className="text-accent font-semibold text-sm mb-0.5">Plan access</p>
            <p className="text-txt2 text-sm">{bannerMessage}</p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-txt tracking-tight mb-3">
            Choose your <span className="text-accent">plan</span>
          </h1>
          <p className="text-txt2 text-sm">
            Free stays focused on habit tracking. Premium unlocks every other feature.
          </p>
          {pricing.freeTrialEnabled && (
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-accent2/10 border border-accent2/25 rounded-full text-sm text-accent2">
              <span className="w-2 h-2 bg-accent2 rounded-full animate-pulse" />
              🎁 Free trial active — {pricing.freeTrialDays} days of full premium access
            </div>
          )}
        </div>

        {/* Plan Grid */}
        <div className={`grid gap-6 mx-auto ${plans.length === 4 ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-bg2 border ${plan.color} rounded-card p-7 flex flex-col transition-transform hover:-translate-y-1 duration-200`}
            >
              {plan.badge && (
                <span className="absolute top-4 right-4 text-[11px] font-semibold bg-accent/20 text-accent border border-accent/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {plan.badge}
                </span>
              )}

              <p className="text-xs font-medium text-txt3 uppercase tracking-widest mb-2">{plan.name}</p>

              <div className="flex items-baseline gap-0.5 mb-2">
                {plan.originalPrice && (
                  <span className="text-base text-txt3 line-through mr-2">{plan.originalPrice}</span>
                )}
                <span className="text-4xl font-semibold text-txt">{plan.price}</span>
                <span className="text-txt3 text-sm">{plan.priceSub}</span>
              </div>

              <p className="text-txt2 text-sm mb-5">{plan.description}</p>

              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-txt2">
                    <span className="text-accent2 font-bold">+</span> {feature}
                  </li>
                ))}
                {plan.lockedFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-txt3 line-through opacity-60">
                    <span>🔒</span> {feature}
                  </li>
                ))}
              </ul>

              <button
                id={`select-${plan.id}`}
                className={`w-full py-2.5 rounded-sm text-sm font-medium transition-all duration-150 active:scale-[0.98]
                  ${plan.highlight
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-bg3 text-txt2 border border-white/[0.1] hover:text-txt hover:bg-bg4'
                  }`}
                onClick={plan.onClick}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate(isAuthenticated ? getDefaultAppRoute(user) : '/login')}
            className="text-txt3 text-sm hover:text-txt2 transition-colors underline underline-offset-2"
          >
            {isAuthenticated ? '← Back to app' : '← Back to Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
