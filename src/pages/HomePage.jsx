import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import { getPublicPricing } from '../services/api';

const DEFAULT_PRICING = {
  monthlyPrice: 9.99,
  yearlyPrice: 79.99,
  lifetimePrice: 199.99,
  lifetimePlanEnabled: true,
  freeTrialEnabled: false,
  freeTrialDays: 7,
  discountActive: false,
  discountPercentage: 0,
  promotionActive: false,
  promotionBannerText: '',
};

const FEATURES = [
  {
    icon: '✅',
    title: 'Habit Tracking',
    description:
      'Build powerful daily habits with a visual tracker. Log completions, set goals, and watch your streaks grow day after day.',
    gradient: 'from-accent to-purple',
  },
  {
    icon: '🧠',
    title: 'Mindset Monitoring',
    description:
      'Track mood, focus, energy, and motivation every day. Understand how your mental state influences your performance.',
    gradient: 'from-purple to-teal',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboards',
    description:
      "Beautiful charts and graphs that surface patterns in your data. See exactly when and why you're at your best.",
    gradient: 'from-teal to-accent2',
  },
  {
    icon: '🔥',
    title: 'Productivity Streaks',
    description:
      'Stay motivated with streak tracking. Gamify your consistency and celebrate milestones that keep you moving forward.',
    gradient: 'from-accent3 to-accent',
  },
  {
    icon: '📈',
    title: 'Weekly Insights',
    description:
      'Receive AI-powered weekly performance summaries. Identify your strongest days and discover opportunities to improve.',
    gradient: 'from-accent2 to-teal',
  },
];

const STEPS = [
  {
    num: '01',
    icon: '👤',
    title: 'Create an Account',
    description: 'Sign up in under a minute. Start with the free plan — no credit card required.',
  },
  {
    num: '02',
    icon: '📝',
    title: 'Track Your Habits',
    description: 'Add habits to track, then check them off daily. Simple, fast, and satisfying.',
  },
  {
    num: '03',
    icon: '🧘',
    title: 'Monitor Your Mindset',
    description: 'Log your mood, focus, energy, and motivation. Get a complete picture of your mental state.',
  },
  {
    num: '04',
    icon: '🔍',
    title: 'Analyze Your Progress',
    description: 'Upgrade to unlock powerful analytics and AI coaching that continuously level you up.',
  },
];

const BENEFITS = [
  { icon: '💡', title: 'Build Better Habits', desc: "Consistency is the foundation of growth. Our daily tracker makes it easy to show up every day." },
  { icon: '🌿', title: 'Improve Mental Clarity', desc: 'Identify what drains you and what energizes you. Make smarter daily decisions.' },
  { icon: '⚡', title: 'Increase Productivity', desc: "When habits and mindset align, output soars. Track what matters and eliminate what doesn't." },
  { icon: '🎯', title: 'Understand Your Patterns', desc: 'Data reveals what intuition misses. Spot your peak performance windows and lean into them.' },
];

const fmt = (value) => `$${Number(value || 0).toFixed(2)}`;

// ── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection({ pricing }) {
  const { freeTrialEnabled, freeTrialDays } = pricing;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-accent2/10 rounded-full blur-3xl" />
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {freeTrialEnabled ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs text-accent font-medium mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-accent2 rounded-full animate-pulse" />
            🎁 Start Free Trial — {freeTrialDays} days of full premium access
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs text-accent font-medium mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-accent2 rounded-full animate-pulse" />
            Free forever — Habit Tracker included at no cost
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6">
          <span className="text-txt">Track Your Habits.</span>
          <br />
          <span className="bg-gradient-to-r from-accent via-purple to-accent2 bg-clip-text text-transparent">
            Improve Your Mindset.
          </span>
          <br />
          <span className="text-txt">Build a Better Life.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-txt2 leading-relaxed mb-10">
          MindSetTracker combines habit logging, mental state monitoring, and powerful analytics
          into one beautiful dashboard — so you always know where you stand and where to grow.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="group px-8 py-4 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl transition-all duration-200 shadow-xl shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-0.5 text-base"
          >
            {freeTrialEnabled ? `Start Free Trial (${freeTrialDays} days)` : 'Get Started Free'}
            <span className="ml-2 group-hover:ml-3 transition-all duration-200">→</span>
          </Link>
          <a
            href="#features"
            onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="px-8 py-4 border border-white/20 text-txt hover:text-white hover:border-white/40 hover:bg-white/5 font-medium rounded-xl transition-all duration-200 text-base backdrop-blur-sm"
          >
            Learn More
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-txt3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-accent2 font-semibold text-base">10k+</span>
            <span>active users</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-accent2 font-semibold text-base">4.9★</span>
            <span>average rating</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-accent2 font-semibold text-base">2M+</span>
            <span>habits tracked</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Features ─────────────────────────────────────────────────────────────────
function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold uppercase tracking-widest rounded-full border border-accent/20 mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-txt tracking-tight mb-4">
            Everything you need to thrive
          </h2>
          <p className="max-w-xl mx-auto text-txt2 text-base leading-relaxed">
            A complete toolkit for personal development — from daily habit tracking to deep mindset analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-bg2">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-accent2/10 text-accent2 text-xs font-semibold uppercase tracking-widest rounded-full border border-accent2/20 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-txt tracking-tight mb-4">
            Up and running in minutes
          </h2>
          <p className="max-w-lg mx-auto text-txt2 text-base leading-relaxed">
            Four simple steps to unlock your full potential.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-accent/30 to-transparent z-0" style={{ width: 'calc(100% - 48px)', left: 'calc(50% + 28px)' }} />
              )}

              <div className="relative bg-bg3 border border-white/10 rounded-card p-6 hover:border-accent2/30 transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent2/20 to-accent/10 border border-accent2/20 flex items-center justify-center text-lg">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-bold text-accent2/30 font-mono tracking-tight group-hover:text-accent2/50 transition-colors">{step.num}</span>
                </div>
                <h3 className="text-sm font-semibold text-txt mb-2">{step.title}</h3>
                <p className="text-xs text-txt2 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Benefits ──────────────────────────────────────────────────────────────────
function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-purple/10 text-purple text-xs font-semibold uppercase tracking-widest rounded-full border border-purple/20 mb-4">
              Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-txt tracking-tight mb-5 leading-tight">
              The life upgrade<br />
              <span className="bg-gradient-to-r from-purple to-accent bg-clip-text text-transparent">you've been waiting for</span>
            </h2>
            <p className="text-txt2 text-base leading-relaxed mb-8">
              Small, consistent actions compound into extraordinary results. MindSetTracker gives you the clarity and accountability to make every day count.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-accent/25 hover:-translate-y-0.5 text-sm"
            >
              Get Started Free →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="bg-bg2 border border-white/10 rounded-card p-5 hover:border-purple/30 hover:shadow-lg hover:shadow-purple/5 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple/20 to-accent/10 border border-purple/20 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform duration-200">
                  {b.icon}
                </div>
                <h3 className="text-sm font-semibold text-txt mb-1.5">{b.title}</h3>
                <p className="text-xs text-txt2 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function PricingSection({ pricing }) {
  const {
    monthlyPrice, yearlyPrice, lifetimePrice,
    lifetimePlanEnabled, freeTrialEnabled, freeTrialDays,
    discountActive, discountPercentage,
  } = pricing;

  const effectiveMonthly = discountActive ? monthlyPrice * (1 - discountPercentage / 100) : monthlyPrice;
  const effectiveYearly  = discountActive ? yearlyPrice  * (1 - discountPercentage / 100) : yearlyPrice;

  const freeFeatures  = ['Unlimited habit tracking', 'Daily streak tracking', 'Basic habit stats'];
  const premiumFeatures = [
    'Everything in Free',
    'Mindset metrics dashboard',
    'Advanced analytics & reports',
    'AI-powered weekly summary',
    'Custom habit categories',
    'Data export (CSV & PDF)',
    'Priority support',
  ];

  const PlanCheck = ({ premium }) => (
    <span
      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
      style={{
        background: premium ? 'rgba(var(--color-accent-rgb, 139,92,246),0.2)' : 'rgba(var(--color-accent2-rgb, 52,211,153),0.2)',
        color: premium ? 'var(--color-accent, #8b5cf6)' : 'var(--color-accent2, #34d399)',
      }}
    >✓</span>
  );

  const PlanLock = () => (
    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 text-txt3 flex items-center justify-center text-xs">🔒</span>
  );

  return (
    <section id="pricing" className="py-24 px-6 bg-bg2">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-accent3/10 text-accent3 text-xs font-semibold uppercase tracking-widest rounded-full border border-accent3/20 mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-txt tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="max-w-md mx-auto text-txt2 text-base leading-relaxed">
            Start for free. Upgrade when you want more.
          </p>

          {freeTrialEnabled && (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent/15 to-purple/15 border border-accent/25 rounded-full text-sm text-txt backdrop-blur-sm">
              <span className="w-2 h-2 bg-accent2 rounded-full animate-pulse" />
              🎁 <span className="font-semibold text-accent">Free Trial active</span> — {freeTrialDays} days of full premium access, add a card to start
            </div>
          )}
        </div>

        <div className={`grid gap-6 max-w-5xl mx-auto ${lifetimePlanEnabled ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>

          {/* ── Free Plan ─────────────────────────── */}
          <div className="bg-bg3 border border-white/10 rounded-card p-8 flex flex-col">
            <div className="mb-6">
              <div className="text-xs text-txt3 uppercase tracking-widest font-semibold mb-2">Free</div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-5xl font-bold text-txt tracking-tight">$0</span>
                <span className="text-txt3 text-sm">/ forever</span>
              </div>
              <p className="text-txt2 text-sm leading-relaxed">
                Habit Tracker only. Perfect for building your first habits.
              </p>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {freeFeatures.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-txt2">
                  <PlanCheck premium={false} />
                  {item}
                </li>
              ))}
              {['Mindset monitoring', 'Analytics & reports', 'AI coaching'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-txt3 line-through">
                  <PlanLock />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/signup"
              className="w-full text-center px-6 py-3 border border-white/20 text-txt hover:border-accent/40 hover:bg-accent/5 font-medium rounded-xl transition-all duration-200 text-sm"
            >
              Start for Free
            </Link>
          </div>

          {/* ── Monthly Plan ──────────────────────── */}
          <div className="relative bg-gradient-to-br from-accent/10 via-bg2 to-purple/10 border border-accent/30 rounded-card p-8 flex flex-col shadow-2xl shadow-accent/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent to-purple rounded-full text-xs text-white font-semibold shadow-lg shadow-accent/30">
              Most Popular
            </div>

            <div className="mb-6">
              <div className="text-xs text-accent uppercase tracking-widest font-semibold mb-2">Monthly</div>
              <div className="flex items-baseline gap-1 mb-3">
                {freeTrialEnabled ? (
                  <>
                    <span className="text-lg text-txt3 line-through mr-1">{fmt(effectiveMonthly)}</span>
                    <span className="text-3xl font-bold text-accent2 tracking-tight">Free</span>
                    <span className="text-txt3 text-xs">/ {freeTrialDays} day trial</span>
                  </>
                ) : (
                  <>
                    {discountActive && (
                      <span className="text-lg text-txt3 line-through mr-2">{fmt(monthlyPrice)}</span>
                    )}
                    <span className="text-5xl font-bold text-txt tracking-tight">{fmt(effectiveMonthly)}</span>
                    <span className="text-txt3 text-sm">/ month</span>
                  </>
                )}
              </div>
              <p className="text-txt2 text-sm leading-relaxed">
                Full premium access. Cancel anytime.
              </p>
            </div>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {premiumFeatures.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-txt2">
                  <PlanCheck premium />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/signup"
              className="w-full text-center px-6 py-3.5 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-accent/30 hover:shadow-accent/50 text-sm"
            >
              {freeTrialEnabled ? `Start Free Trial (${freeTrialDays} days) →` : 'Choose Monthly →'}
            </Link>
          </div>

          {/* ── Yearly Plan ───────────────────────── */}
          <div className="bg-bg3 border border-white/10 rounded-card p-8 flex flex-col">
            <div className="mb-6">
              <div className="text-xs text-accent2 uppercase tracking-widest font-semibold mb-2">Yearly</div>
              <div className="flex items-baseline gap-1 mb-3">
                {discountActive && (
                  <span className="text-lg text-txt3 line-through mr-2">{fmt(yearlyPrice)}</span>
                )}
                <span className="text-5xl font-bold text-txt tracking-tight">{fmt(effectiveYearly)}</span>
                <span className="text-txt3 text-sm">/ year</span>
              </div>
              <p className="text-txt2 text-sm leading-relaxed">
                Save more with annual billing. Full premium access.
              </p>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {premiumFeatures.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-txt2">
                  <PlanCheck premium={false} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/signup"
              className="w-full text-center px-6 py-3 border border-accent2/30 text-accent2 hover:bg-accent2/10 font-medium rounded-xl transition-all duration-200 text-sm"
            >
              Choose Yearly →
            </Link>
          </div>

          {/* ── Lifetime Plan (conditional) ───────── */}
          {lifetimePlanEnabled && (
            <div className="bg-bg3 border border-yellow-500/20 rounded-card p-8 flex flex-col relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-500/80 to-amber-500/80 rounded-full text-xs text-white font-semibold shadow-lg">
                ✨ Lifetime
              </div>

              <div className="mb-6">
                <div className="text-xs text-yellow-400 uppercase tracking-widest font-semibold mb-2">Lifetime</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-5xl font-bold text-txt tracking-tight">{fmt(lifetimePrice)}</span>
                  <span className="text-txt3 text-sm">one-time</span>
                </div>
                <p className="text-txt2 text-sm leading-relaxed">
                  Pay once, own it forever. No recurring fees ever.
                </p>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {[...premiumFeatures, 'All future features included', 'Lifetime priority support'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-txt2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className="w-full text-center px-6 py-3 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 font-medium rounded-xl transition-all duration-200 text-sm"
              >
                Get Lifetime Access →
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-txt3 text-xs mt-10">
          All paid plans include a 14-day money-back guarantee.{' '}
          <Link to="/refund" className="text-accent2 hover:underline">Refund policy applies.</Link>
        </p>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-block px-3 py-1 bg-teal/10 text-teal text-xs font-semibold uppercase tracking-widest rounded-full border border-teal/20 mb-4">
          About Us
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold text-txt tracking-tight mb-6">
          Built by people who care about{' '}
          <span className="bg-gradient-to-r from-teal to-accent2 bg-clip-text text-transparent">your growth</span>
        </h2>
        <p className="text-txt2 text-base leading-relaxed mb-6 max-w-2xl mx-auto">
          MindSetTracker was born from a simple belief: <strong className="text-txt">self-awareness is the first step to self-improvement</strong>.
          We built this platform because we struggled ourselves — juggling habits, managing energy, and trying to stay consistent without any real visibility into our patterns.
        </p>
        <p className="text-txt2 text-base leading-relaxed max-w-2xl mx-auto">
          Our mission is to give every person a clear, honest mirror of their daily life — so they can make informed decisions, build resilient habits, and become the person they want to be.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🎯', label: 'Our Mission', text: 'Empower individuals through data-driven self-awareness and habit science.' },
            { icon: '🌍', label: 'Our Vision', text: 'A world where everyone has the tools to understand and unlock their full potential.' },
            { icon: '❤️', label: 'Our Values', text: 'Transparency, privacy, and genuine care for the people who trust us with their data.' },
          ].map((item) => (
            <div key={item.label} className="bg-bg2 border border-white/10 rounded-card p-6 text-left hover:border-teal/20 transition-all duration-300">
              <div className="text-2xl mb-3">{item.icon}</div>
              <div className="text-xs text-teal font-semibold uppercase tracking-widest mb-2">{item.label}</div>
              <p className="text-sm text-txt2 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
function CtaBanner({ pricing }) {
  const { freeTrialEnabled, freeTrialDays } = pricing;

  return (
    <section className="py-20 px-6 bg-bg2">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative rounded-2xl bg-gradient-to-br from-accent/20 via-bg3 to-purple/20 border border-accent/20 p-12 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent/20 blur-3xl rounded-full pointer-events-none" />

          <h2 className="relative text-2xl sm:text-3xl font-semibold text-txt tracking-tight mb-4">
            Ready to transform your daily life?
          </h2>
          <p className="relative text-txt2 text-base leading-relaxed mb-8">
            Join thousands of people already building better habits and a clearer mindset.{' '}
            {freeTrialEnabled
              ? `Your ${freeTrialDays}-day free trial is waiting.`
              : 'Start for free with the Habit Tracker — no credit card required.'}
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="group px-8 py-4 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl transition-all duration-200 shadow-xl shadow-accent/30 hover:-translate-y-0.5 text-sm"
            >
              {freeTrialEnabled ? `Start Free Trial (${freeTrialDays} days)` : 'Get Started Free'}
              <span className="ml-2 group-hover:ml-3 transition-all duration-200">→</span>
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border border-white/20 text-txt hover:border-white/40 hover:bg-white/5 font-medium rounded-xl transition-all duration-200 text-sm"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [pricing, setPricing] = useState(DEFAULT_PRICING);

  useEffect(() => {
    let active = true;

    getPublicPricing()
      .then((data) => {
        if (active && data) {
          // api.js getPublicPricing() returns the pricing object directly
          setPricing((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((error) => {
        console.error('Failed to load pricing settings', error);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main>
        <HeroSection pricing={pricing} />
        <FeaturesSection />
        <HowItWorksSection />
        <BenefitsSection />
        <PricingSection pricing={pricing} />
        <AboutSection />
        <CtaBanner pricing={pricing} />
      </main>
      <Footer />
    </div>
  );
}
