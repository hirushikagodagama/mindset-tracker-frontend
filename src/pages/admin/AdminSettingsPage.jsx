import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { User, Lock, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const { adminUser } = useAdminAuth();
  const [msg, setMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setMsg('✅ Settings saved (UI only – connect to PUT /api/v1/admin/account to persist).');
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="Admin Settings" />
        <div className="admin-content">

          <div className="admin-section-card" style={{ maxWidth: 540 }}>
            <h2 className="admin-section-card__title"><User size={18} /> Account Info</h2>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Name</label>
                  <input className="admin-input" defaultValue={adminUser?.name} />
                </div>
                <div className="admin-form-group">
                  <label>Email</label>
                  <input className="admin-input" type="email" defaultValue={adminUser?.email} disabled />
                </div>
              </div>
              <div className="admin-form-footer">
                {msg && <span className="admin-save-msg">{msg}</span>}
                <button type="submit" className="admin-btn admin-btn--primary">
                  <Save size={16} /> Save
                </button>
              </div>
            </form>
          </div>

{/* 
          <div className="admin-section-card" style={{ maxWidth: 540 }}>
            <h2 className="admin-section-card__title"><Lock size={18} /> Change Password</h2>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Current Password</label>
                  <input className="admin-input" type="password" placeholder="••••••••" />
                </div>
                <div className="admin-form-group">
                  <label>New Password</label>
                  <input className="admin-input" type="password" placeholder="••••••••" />
                </div>
                <div className="admin-form-group">
                  <label>Confirm New Password</label>
                  <input className="admin-input" type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="admin-form-footer">
                <button type="submit" className="admin-btn admin-btn--primary">
                  <Save size={16} /> Update Password
                </button>
              </div>
            </form>
          </div>
*/}

        </div>
      </div>
    </div>
  );
}
