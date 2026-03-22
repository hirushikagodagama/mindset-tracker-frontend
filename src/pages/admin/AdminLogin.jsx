import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

const getLoginErrorMessage = (err) => {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (err?.code === 'ERR_NETWORK') {
    return 'Cannot reach the API server. Please check your internet connection or backend status.';
  }
  return 'Admin sign-in failed. Please try again.';
};

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login }               = useAdminAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <ShieldCheck size={36} />
        </div>
        <h1 className="admin-login__title">Admin Panel</h1>
        <p className="admin-login__subtitle">MindSetTracker – Secure Access</p>

        {error && (
          <div className="admin-login__error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-login__field">
            <label className="admin-login__label">Email</label>
            <input
              type="email"
              className="admin-login__input"
              placeholder="admin@mindsettracker.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="admin-login__field">
            <label className="admin-login__label">Password</label>
            <div className="admin-login__pw-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                className="admin-login__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="admin-login__pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label="Toggle password"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-login__btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
