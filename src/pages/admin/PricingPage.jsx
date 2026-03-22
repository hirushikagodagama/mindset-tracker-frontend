import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { getPricingSettings, updatePricingSettings } from '../../services/adminApi';
import { DollarSign, Save, Percent, Clock, Infinity, ToggleLeft, ToggleRight } from 'lucide-react';

const DEFAULT = {
  monthlyPrice: 9.99,
  yearlyPrice: 79.99,
  lifetimePrice: 199.99,
  lifetimePlanEnabled: true,
  freeTrialEnabled: false,
  freeTrialDays: 7,
  discountActive: false,
  discountPercentage: 0,
};

export default function PricingPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState('');

  useEffect(() => {
    getPricingSettings()
      .then((r) => setSettings({ ...DEFAULT, ...(r.pricing || r.settings || r) }))
      .catch(console.error);
  }, []);

  const setField = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked
      : e.target.type === 'number' ? parseFloat(e.target.value)
      : e.target.value;
    setSettings((s) => ({ ...s, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await updatePricingSettings({
        monthlyPrice: settings.monthlyPrice,
        yearlyPrice: settings.yearlyPrice,
        lifetimePrice: settings.lifetimePrice,
        lifetimePlanEnabled: settings.lifetimePlanEnabled,
        freeTrialEnabled: settings.freeTrialEnabled,
        freeTrialDays: settings.freeTrialDays,
        discountActive: settings.discountActive,
        discountPercentage: settings.discountPercentage,
      });
      setMsg('✅ Pricing saved successfully!');
    } catch {
      setMsg('❌ Failed to save pricing.');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3500);
    }
  };

  if (!settings) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <AdminNavbar title="Pricing & Marketing" />
          <div className="admin-content"><div className="admin-spinner" /></div>
        </div>
      </div>
    );
  }

  const effectiveMonthly = settings.discountActive
    ? settings.monthlyPrice * (1 - settings.discountPercentage / 100)
    : settings.monthlyPrice;
  const effectiveYearly = settings.discountActive
    ? settings.yearlyPrice * (1 - settings.discountPercentage / 100)
    : settings.yearlyPrice;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="Pricing & Marketing" />
        <div className="admin-content">

          {/* ── Plan Preview Cards ─────────────────────────────────────── */}
          <div className="admin-pricing-preview">
            {/* Free */}
            <div className="admin-pricing-card">
              <div className="admin-pricing-card__label">Free</div>
              <div className="admin-pricing-card__price">
                <span className="admin-pricing-card__current">$0</span>
              </div>
              <div className="admin-pricing-card__period">habit tracker only</div>
            </div>

            {/* Monthly */}
            <div className="admin-pricing-card admin-pricing-card--featured">
              <div className="admin-pricing-card__label">Monthly</div>
              <div className="admin-pricing-card__price">
                {settings.discountActive && (
                  <span className="admin-pricing-card__original">${settings.monthlyPrice.toFixed(2)}</span>
                )}
                <span className="admin-pricing-card__current">${effectiveMonthly.toFixed(2)}</span>
              </div>
              <div className="admin-pricing-card__period">
                {settings.freeTrialEnabled
                  ? `Free trial: ${settings.freeTrialDays} days`
                  : 'per month'}
              </div>
            </div>

            {/* Yearly */}
            <div className="admin-pricing-card">
              <div className="admin-pricing-card__label">Yearly</div>
              <div className="admin-pricing-card__price">
                {settings.discountActive && (
                  <span className="admin-pricing-card__original">${settings.yearlyPrice.toFixed(2)}</span>
                )}
                <span className="admin-pricing-card__current">${effectiveYearly.toFixed(2)}</span>
              </div>
              <div className="admin-pricing-card__period">per year</div>
            </div>

            {/* Lifetime */}
            {settings.lifetimePlanEnabled && (
              <div className="admin-pricing-card">
                <div className="admin-pricing-card__label">Lifetime</div>
                <div className="admin-pricing-card__price">
                  <span className="admin-pricing-card__current">${(settings.lifetimePrice || 0).toFixed(2)}</span>
                </div>
                <div className="admin-pricing-card__period">one-time payment</div>
              </div>
            )}
          </div>

          {/* ── Free Trial Control ─────────────────────────────────────── */}
          <div className="admin-section-card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="admin-section-card__title">
              <Clock size={18} /> Free Trial Control
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', marginBottom: '1.25rem' }}>
              When enabled, the home page shows a strikethrough on the monthly price and a "Start Free Trial (X days)" CTA.
              Users must add a payment card via Paddle to activate their trial.
            </p>
            <div className="admin-form-grid">
              <div className="admin-form-group admin-form-group--toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.freeTrialEnabled}
                    onChange={setField('freeTrialEnabled')}
                  />
                  {settings.freeTrialEnabled
                    ? <><ToggleRight size={16} style={{ color: 'var(--admin-accent)' }} /> Trial Enabled</>
                    : <><ToggleLeft size={16} /> Trial Disabled</>}
                </label>
              </div>
              {settings.freeTrialEnabled && (
                <div className="admin-form-group">
                  <label>Trial Duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    className="admin-input"
                    value={settings.freeTrialDays}
                    onChange={setField('freeTrialDays')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Lifetime Plan Control ──────────────────────────────────── */}
          <div className="admin-section-card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="admin-section-card__title">
              <Infinity size={18} /> Lifetime Plan
            </h2>
            <div className="admin-form-grid">
              <div className="admin-form-group admin-form-group--toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.lifetimePlanEnabled}
                    onChange={setField('lifetimePlanEnabled')}
                  />
                  {settings.lifetimePlanEnabled
                    ? <><ToggleRight size={16} style={{ color: 'var(--admin-accent)' }} /> Lifetime Plan Visible</>
                    : <><ToggleLeft size={16} /> Lifetime Plan Hidden</>}
                </label>
              </div>
              {settings.lifetimePlanEnabled && (
                <div className="admin-form-group">
                  <label>Lifetime Price (USD, one-time)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="admin-input"
                    value={settings.lifetimePrice}
                    onChange={setField('lifetimePrice')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Subscription Pricing ──────────────────────────────────── */}
          <form onSubmit={handleSave} className="admin-section-card">
            <h2 className="admin-section-card__title">
              <DollarSign size={18} /> Subscription Pricing
            </h2>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>Monthly Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="admin-input"
                  value={settings.monthlyPrice}
                  onChange={setField('monthlyPrice')}
                />
              </div>
              <div className="admin-form-group">
                <label>Yearly Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="admin-input"
                  value={settings.yearlyPrice}
                  onChange={setField('yearlyPrice')}
                />
              </div>
              <div className="admin-form-group admin-form-group--toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.discountActive}
                    onChange={setField('discountActive')}
                  />
                  <Percent size={14} /> Activate Discount
                </label>
              </div>
              {settings.discountActive && (
                <div className="admin-form-group">
                  <label>Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="admin-input"
                    value={settings.discountPercentage}
                    onChange={setField('discountPercentage')}
                  />
                </div>
              )}
            </div>
            <div className="admin-form-footer">
              {msg && <span className="admin-save-msg">{msg}</span>}
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving…' : 'Save All Pricing'}
              </button>
            </div>
          </form>

          <div className="admin-notice">
            💡 All pricing changes are reflected in real-time on the public
            <strong> /pricing</strong> endpoint and the home page pricing section.
          </div>
        </div>
      </div>
    </div>
  );
}
