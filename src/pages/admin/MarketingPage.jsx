import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminTable from '../../components/admin/AdminTable';
import {
  getMarketingSettings, updateMarketingSettings,
  getPromoCodes, createPromoCode, deletePromoCode,
} from '../../services/adminApi';
import { Save, Plus, Trash2, Tag } from 'lucide-react';

export default function MarketingPage() {
  const [settings, setSettings]   = useState(null);
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState('');
  const [promos, setPromos]       = useState([]);
  const [promoLoading, setPromoLoading] = useState(true);

  // New promo form state
  const [form, setForm] = useState({ code: '', discountPercent: '', expirationDate: '', maxUses: '' });
  const [formErr, setFormErr] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p] = await Promise.all([getMarketingSettings(), getPromoCodes()]);
        setSettings(s.settings);
        setPromos(p.promoCodes);
      } catch (e) { console.error(e); }
      finally { setPromoLoading(false); }
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await updateMarketingSettings(settings);
      setSettings(res.settings);
      setSaveMsg('✅ Settings saved successfully!');
    } catch (e) { setSaveMsg('❌ Failed to save settings.'); }
    finally { setSaving(false); setTimeout(() => setSaveMsg(''), 3000); }
  };

  const handleCreatePromo = async (e) => {
    e.preventDefault();
    setFormErr('');
    try {
      const res = await createPromoCode({
        code: form.code,
        discountPercent: Number(form.discountPercent),
        expirationDate: form.expirationDate,
        maxUses: Number(form.maxUses) || 0,
      });
      setPromos((prev) => [res.promoCode, ...prev]);
      setForm({ code: '', discountPercent: '', expirationDate: '', maxUses: '' });
    } catch (e) {
      setFormErr(e?.response?.data?.message || 'Failed to create promo code');
    }
  };

  const handleDeletePromo = async (id) => {
    if (!window.confirm('Delete this promo code?')) return;
    try {
      await deletePromoCode(id);
      setPromos((prev) => prev.filter((p) => p._id !== id));
    } catch (e) { console.error(e); }
  };

  const promoCols = [
    { key: 'code',            label: 'Code',     render: (v) => <code className="monospace">{v}</code> },
    { key: 'discountPercent', label: 'Discount', render: (v) => `${v}%` },
    { key: 'maxUses',         label: 'Max Uses', render: (v) => v === 0 ? 'Unlimited' : v },
    { key: 'currentUses',     label: 'Used' },
    { key: 'expirationDate',  label: 'Expires',  render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'isActive',        label: 'Active',   render: (v) => <span className={`badge ${v ? 'badge--green' : 'badge--red'}`}>{v ? 'Yes' : 'No'}</span> },
    {
      key: '_del', label: '',
      render: (_, row) => (
        <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDeletePromo(row._id)}>
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  const set = (field) => (e) => setSettings((s) => ({ ...s, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="Marketing Controls" />
        <div className="admin-content">

          {/* Settings Form */}
          {settings && (
            <form onSubmit={handleSave} className="admin-section-card">
              <h2 className="admin-section-card__title">Marketing Settings</h2>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Free Trial Duration (days)</label>
                  <input type="number" min={1} value={settings.freeTrialDays} onChange={set('freeTrialDays')} className="admin-input" />
                </div>
                <div className="admin-form-group">
                  <label>Promotion Banner Text</label>
                  <input type="text" value={settings.promotionBannerText} onChange={set('promotionBannerText')} className="admin-input" placeholder="e.g. 🎉 50% off this week!" />
                </div>
                <div className="admin-form-group admin-form-group--toggle">
                  <label>
                    <input type="checkbox" checked={settings.promotionActive} onChange={set('promotionActive')} />
                    Show Promotion Banner
                  </label>
                </div>
                <div className="admin-form-group admin-form-group--toggle">
                  <label>
                    <input type="checkbox" checked={settings.discountActive} onChange={set('discountActive')} />
                    Enable Global Discount
                  </label>
                </div>
                {settings.discountActive && (
                  <div className="admin-form-group">
                    <label>Discount Percentage</label>
                    <input type="number" min={0} max={100} value={settings.discountPercentage} onChange={set('discountPercentage')} className="admin-input" />
                  </div>
                )}
              </div>
              <div className="admin-form-footer">
                {saveMsg && <span className="admin-save-msg">{saveMsg}</span>}
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                  <Save size={16} /> {saving ? 'Saving…' : 'Save Settings'}
                </button>
              </div>
            </form>
          )}

          {/* Create Promo Code */}
          <form onSubmit={handleCreatePromo} className="admin-section-card">
            <h2 className="admin-section-card__title">
              <Tag size={18} /> Create Promo Code
            </h2>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>Code</label>
                <input className="admin-input" placeholder="WELCOME50" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} required />
              </div>
              <div className="admin-form-group">
                <label>Discount %</label>
                <input type="number" min={1} max={100} className="admin-input" placeholder="50" value={form.discountPercent} onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))} required />
              </div>
              <div className="admin-form-group">
                <label>Expiration Date</label>
                <input type="date" className="admin-input" value={form.expirationDate} onChange={(e) => setForm((f) => ({ ...f, expirationDate: e.target.value }))} required />
              </div>
              <div className="admin-form-group">
                <label>Max Uses (0 = unlimited)</label>
                <input type="number" min={0} className="admin-input" value={form.maxUses} onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))} />
              </div>
            </div>
            {formErr && <p className="admin-form-error">{formErr}</p>}
            <div className="admin-form-footer">
              <button type="submit" className="admin-btn admin-btn--primary">
                <Plus size={16} /> Create Code
              </button>
            </div>
          </form>

          {/* Promo Code List */}
          <div className="admin-section-card">
            <h2 className="admin-section-card__title">Active Promo Codes</h2>
            <div className="admin-table-card">
              <AdminTable
                columns={promoCols}
                data={promos}
                loading={promoLoading}
                emptyMsg="No promo codes yet"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
