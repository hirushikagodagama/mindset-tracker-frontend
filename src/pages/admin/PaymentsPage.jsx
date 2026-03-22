import { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminTable from '../../components/admin/AdminTable';
import { getPayments } from '../../services/adminApi';
import { RefreshCw } from 'lucide-react';

const STATUS_BADGE = {
  succeeded: 'badge badge--green',
  pending:   'badge badge--yellow',
  failed:    'badge badge--red',
  refunded:  'badge badge--grey',
};

export default function PaymentsPage() {
  const [data, setData]       = useState({ payments: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPayments({ page, limit: 20 });
      setData(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const cols = [
    { key: 'userId',   label: 'User',   render: (_, r) => r.userId ? `${r.userId.name} (${r.userId.email})` : '—' },
    { key: 'amount',   label: 'Amount', render: (v, r) => `${r.currency?.toUpperCase() || 'USD'} ${(v / 100).toFixed(2)}` },
    {
      key: 'status', label: 'Status',
      render: (v) => <span className={STATUS_BADGE[v] || 'badge badge--grey'}>{v}</span>,
    },
    { key: 'stripePaymentId', label: 'Stripe ID', render: (v) => v ? <code className="monospace">{v.slice(-16)}</code> : '—' },
    { key: 'createdAt', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="Payment History" />
        <div className="admin-content">
          <div className="admin-toolbar">
            <p className="admin-toolbar__count">
              {data.pagination?.total ?? '…'} transactions
            </p>
            <button className="admin-btn admin-btn--outline" onClick={fetchData}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
          <div className="admin-notice">
            💡 Stripe integration is pending. Payment records will populate once Stripe webhooks are configured.
          </div>
          <div className="admin-table-card">
            <AdminTable
              columns={cols}
              data={data.payments}
              loading={loading}
              emptyMsg="No payment records yet"
              pagination={data.pagination
                ? { page: data.pagination.page, pages: data.pagination.pages, onPageChange: setPage }
                : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
