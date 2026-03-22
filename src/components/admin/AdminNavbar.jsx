import { useAdminAuth } from '../../context/AdminAuthContext';
import { Bell, User } from 'lucide-react';

export default function AdminNavbar({ title = 'Dashboard' }) {
  const { adminUser } = useAdminAuth();

  return (
    <header className="admin-navbar">
      <h1 className="admin-navbar__title">{title}</h1>
      <div className="admin-navbar__right">
        <button className="admin-navbar__icon-btn" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <div className="admin-navbar__user">
          <div className="admin-navbar__avatar">
            <User size={16} />
          </div>
          <div className="admin-navbar__user-info">
            <span className="admin-navbar__user-name">{adminUser?.name || 'Admin'}</span>
            <span className="admin-navbar__user-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
