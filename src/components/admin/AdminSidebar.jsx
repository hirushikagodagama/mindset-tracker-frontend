import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  LayoutDashboard, Users, CreditCard, DollarSign,
  Megaphone, Tag, BarChart3, Settings, LogOut, ShieldCheck
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users',          icon: Users,            label: 'Users' },
  { to: '/admin/subscriptions',  icon: CreditCard,       label: 'Subscriptions' },
  { to: '/admin/payments',       icon: DollarSign,       label: 'Payments' },
  { to: '/admin/marketing',      icon: Megaphone,        label: 'Marketing' },
  { to: '/admin/pricing',        icon: Tag,              label: 'Pricing' },
  { to: '/admin/analytics',      icon: BarChart3,        label: 'Analytics' },
  { to: '/admin/settings',       icon: Settings,         label: 'Settings' },
];

export default function AdminSidebar() {
  const { logout } = useAdminAuth();
  const navigate   = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar__logo">
        <ShieldCheck size={22} className="admin-sidebar__logo-icon" />
        <span>Admin Panel</span>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar__nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} className="admin-sidebar__logout">
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
