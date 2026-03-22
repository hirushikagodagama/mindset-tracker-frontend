import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HabitsPage from './pages/HabitsPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import MentalStatePage from './pages/MentalStatePage';
import ReportPage from './pages/ReportPage';
import LoginPage from './pages/LoginPage';
import PricingPage from './pages/PricingPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import RefundPage from './pages/RefundPage';
import CookiesPage from './pages/CookiesPage';
import { HabitProvider } from './context/HabitContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PremiumRoute from './components/PremiumRoute';
import AdminRoute from './components/admin/AdminRoute';
import { useEffect } from 'react';
import { initializePaddle } from '@paddle/paddle-js';
import { useAuth } from './context/AuthContext';
import { getDefaultAppRoute } from './utils/access';

// ... (existing imports skipped for brevity by tool usage, but keeping structure)

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import SubscriptionsPage from './pages/admin/SubscriptionsPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import MarketingPage from './pages/admin/MarketingPage';
import AdminPricingPage from './pages/admin/PricingPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Pages that do NOT show the Sidebar (public + admin)
const NO_SIDEBAR_PATHS = ['/', '/login', '/signup', '/pricing', '/terms', '/privacy', '/refund', '/cookies'];

function RootRoute() {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated ? <Navigate to={getDefaultAppRoute(user)} replace /> : <HomePage />;
}

function FallbackRoute() {
  const { isAuthenticated, user } = useAuth();
  return <Navigate to={isAuthenticated ? getDefaultAppRoute(user) : '/'} replace />;
}

function AppLayout() {
  const location  = useLocation();
  const isAdminPath   = location.pathname.startsWith('/admin');
  const isNoSidebar   = NO_SIDEBAR_PATHS.includes(location.pathname) || isAdminPath;

  return (
    <>
      {!isNoSidebar && <Sidebar />}
      <div className={isNoSidebar ? 'w-full' : 'main'}>
        <Routes>
          {/* ── Public / Marketing ────────────────────────────────── */}
          <Route path="/"         element={<RootRoute />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/signup"   element={<SignUpPage />} />
          <Route path="/pricing"  element={<PricingPage />} />
          <Route path="/terms"    element={<TermsPage />} />
          <Route path="/privacy"  element={<PrivacyPage />} />
          <Route path="/refund"   element={<RefundPage />} />
          <Route path="/cookies"  element={<CookiesPage />} />

          {/* ── Protected user routes ─────────────────────────────── */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/habits"    element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
          <Route path="/analysis"  element={<PremiumRoute featureName="Analysis"><AnalysisPage /></PremiumRoute>} />
          <Route path="/mental"    element={<PremiumRoute featureName="Mental State tracking"><MentalStatePage /></PremiumRoute>} />
          <Route path="/report"    element={<PremiumRoute featureName="Reports"><ReportPage /></PremiumRoute>} />

          {/* ── Admin routes ───────────────────────────────────────── */}
          <Route path="/admin/login"         element={<AdminLogin />} />
          <Route path="/admin/dashboard"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users"         element={<AdminRoute><UsersPage /></AdminRoute>} />
          <Route path="/admin/subscriptions" element={<AdminRoute><SubscriptionsPage /></AdminRoute>} />
          <Route path="/admin/payments"      element={<AdminRoute><PaymentsPage /></AdminRoute>} />
          <Route path="/admin/marketing"     element={<AdminRoute><MarketingPage /></AdminRoute>} />
          <Route path="/admin/pricing"       element={<AdminRoute><AdminPricingPage /></AdminRoute>} />
          <Route path="/admin/analytics"     element={<AdminRoute><AnalyticsPage /></AdminRoute>} />
          <Route path="/admin/settings"      element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
          <Route path="/admin"               element={<Navigate to="/admin/dashboard" replace />} />

          {/* ── Fallback ───────────────────────────────────────────── */}
          <Route path="*" element={<FallbackRoute />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  useEffect(() => {
    initializePaddle({
      environment: import.meta.env.VITE_PADDLE_ENV || 'sandbox',
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
      eventCallback: function(event) {
        if (event.name === "checkout.completed") {
          const transactionId = event.data?.transaction_id || event.data?.id;
          if (transactionId) {
            window.location.href = `/dashboard?_ptxn=${transactionId}`;
          } else {
            window.location.href = '/dashboard?payment=success';
          }
        }
      }
    }).then((paddle) => {
      if (paddle) {
        window.Paddle = paddle; // Explicitly set for components
        console.log('✅ Paddle initialized successfully');
      }
    });
  }, []);

  return (
    <AdminAuthProvider>
      <AuthProvider>
        <HabitProvider>
          <Router>
            <AppLayout />
          </Router>
        </HabitProvider>
      </AuthProvider>
    </AdminAuthProvider>
  );
}

export default App;

