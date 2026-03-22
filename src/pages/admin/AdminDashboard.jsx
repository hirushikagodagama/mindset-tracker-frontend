import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminCard from '../../components/admin/AdminCard';
import { getDashboardMetrics, getUserGrowthChart, getRevenueChart, getConversionChart } from '../../services/adminApi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Users, Activity, Clock, XCircle, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics]         = useState(null);
  const [growthData, setGrowthData]   = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [convData, setConvData]       = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [m, g, r, c] = await Promise.all([
          getDashboardMetrics(),
          getUserGrowthChart(),
          getRevenueChart(),
          getConversionChart(),
        ]);
        setMetrics(m);
        setGrowthData(g.chart);
        setRevenueData(r.chart);
        setConvData(c.chart);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const fmt = (n) => (n == null ? '—' : n.toLocaleString());
  const usd = (n) => (n == null ? '—' : `$${n.toFixed(2)}`);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="Dashboard" />
        <div className="admin-content">

          {/* KPI Cards */}
          <div className="admin-cards-grid">
            <AdminCard title="Total Users"           value={loading ? '…' : fmt(metrics?.totalUsers)}         icon={Users}      color="blue"   />
            <AdminCard title="Active Subscriptions"  value={loading ? '…' : fmt(metrics?.activeSubscriptions)} icon={Activity}   color="green"  />
            <AdminCard title="Trial Users"           value={loading ? '…' : fmt(metrics?.trialUsers)}          icon={Clock}      color="purple" />
            <AdminCard title="Expired Trials"        value={loading ? '…' : fmt(metrics?.expiredTrials)}       icon={XCircle}    color="red"    />
            <AdminCard title="Monthly Revenue"       value={loading ? '…' : usd(metrics?.monthlyRevenue)}      icon={DollarSign} color="orange" />
            <AdminCard title="Total Revenue"         value={loading ? '…' : usd(metrics?.totalRevenue)}        icon={TrendingUp} color="blue"   />
          </div>

          {/* Charts */}
          <div className="admin-charts-grid">
            {/* User Growth */}
            <div className="admin-chart-card">
              <h3 className="admin-chart-card__title">User Growth (last 30 days)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#gUsers)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue */}
            <div className="admin-chart-card">
              <h3 className="admin-chart-card__title">Revenue (last 30 days)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} formatter={(v) => [`$${v}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#gRev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Conversions */}
            <div className="admin-chart-card admin-chart-card--wide">
              <h3 className="admin-chart-card__title">Trial Conversions (last 6 months)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={convData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                  <Bar dataKey="trial"   name="Trial"   fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active"  name="Active"  fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expired" name="Expired" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
