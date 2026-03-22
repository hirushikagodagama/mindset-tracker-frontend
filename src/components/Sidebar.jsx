import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, BarChart3, Brain, CalendarCheck2, FileText, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPremiumFeatureMessage, isPremiumUser } from '../utils/access';

const NAV_ITEMS = [
  { to: '/habits', label: 'Habit Tracker', icon: CalendarCheck2, premium: false },
  { to: '/dashboard', label: 'Dashboard', icon: Activity, premium: false },
  { to: '/analysis', label: 'Analysis', icon: BarChart3, premium: true, featureName: 'Analysis' },
  { to: '/mental', label: 'Mental State', icon: Brain, premium: true, featureName: 'Mental State tracking' },
  { to: '/report', label: 'Monthly Report', icon: FileText, premium: true, featureName: 'Reports' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isPremium = isPremiumUser(user);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handlePremiumNav = (featureName) => {
    navigate('/pricing', {
      state: { message: getPremiumFeatureMessage(featureName) },
    });
  };

  return (
    <nav className="sidebar">
      <div className="logo">
        <div className="logo-mark">quiet progress.</div>
        <div className="logo-sub">Personal Tracker</div>
      </div>
      <div className="nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, premium, featureName }) =>
          premium && !isPremium ? (
            <button
              key={to}
              type="button"
              className="nav-item nav-item-premium"
              onClick={() => handlePremiumNav(featureName)}
            >
              <span className="nav-icon"><Icon size={16} /></span>
              <span>{label}</span>
              <span className="nav-pill">
                <Lock size={12} />
                Premium
              </span>
            </button>
          ) : (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon"><Icon size={16} /></span>
              <span>{label}</span>
            </NavLink>
          )
        )}
      </div>
      <div className="sidebar-footer">
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              marginBottom: '6px',
              background: 'var(--bg3)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(92,110,248,0.25)',
                border: '1px solid rgba(92,110,248,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--accent)',
                flexShrink: 0,
              }}
            >
              {(user.name || user.email || '?')[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--text)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.name || 'User'}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--text3)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.email}
              </div>
              <div style={{ marginTop: '4px' }}>
                <span className={`nav-plan-pill ${isPremium ? 'is-premium' : 'is-free'}`}>
                  {isPremium ? 'Premium' : 'Free'}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          id="logout-btn"
          onClick={handleLogout}
          className="nav-item"
          style={{ width: '100%', color: 'var(--danger)', marginTop: '2px' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(232,67,67,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <span className="nav-icon">X</span>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
