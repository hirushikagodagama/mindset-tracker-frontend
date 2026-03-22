import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { getUserGrowthChart, getRevenueChart, getConversionChart } from '../../services/adminApi';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function AnalyticsPage() {
  const [growth,  setGrowth]  = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [conv,    setConv]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [g, r, c] = await Promise.all([getUserGrowthChart(), getRevenueChart(), getConversionChart()]);
        setGrowth(g.chart);
        setRevenue(r.chart);
        setConv(c.chart);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const chartCard = (title, children) => (
    <div className="admin-chart-card">
      <h3 className="admin-chart-card__title">{title}</h3>
      {loading ? <div className="admin-spinner" /> : children}
    </div>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="Analytics" />
        <div className="admin-content">
          <div className="admin-analytics-grid">

            {chartCard('User Growth – Last 30 Days',
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={growth}>
                  <defs>
                    <linearGradient id="aUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="users" name="New Users" stroke="#6366f1" fill="url(#aUsers)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {chartCard('Revenue Trends – Last 30 Days',
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} formatter={(v) => [`$${v}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}

            {chartCard('Trial Conversion – Last 6 Months',
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={conv}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                  <Bar dataKey="trial"   name="Trial"   fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active"  name="Converted" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expired" name="Expired"  fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
