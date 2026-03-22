import { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminTable from '../../components/admin/AdminTable';
import { getSubscriptions, cancelSubscription, extendSubscription } from '../../services/adminApi';
import { XCircle, CalendarPlus, RefreshCw } from 'lucide-react';

const STATUS_BADGE = {
  trial:   'badge badge--yellow',
  active:  'badge badge--green',
  expired: 'badge badge--red',
};

export default function SubscriptionsPage() {
  const [data, setData]         = useState({ subscriptions: [], pagination: {} });
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [actionId, setActionId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSubscriptions({ page, limit: 15 });
      setData(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCancel = async (row) => {
    if (!window.confirm(`Cancel subscription for ${row.email}?`)) return;
    setActionId(row._id);
    try { await cancelSubscription(row._id); fetchData(); }
    finally { setActionId(null); }
  };
  const handleExtend = async (row) => {
    const days = parseInt(window.prompt('Extend by how many days?', '30'));
    if (!days || days < 1) return;
    setActionId(row._id);
    try { await extendSubscription(row._id, days); fetchData(); }
    finally { setActionId(null); }
  };

  const cols = [
    { key: 'name',  label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'subscriptionStatus', label: 'Status',
      render: (v) => <span className={STATUS_BADGE[v] || 'badge badge--grey'}>{v}</span>,
    },
    { key: 'trialStartDate',    label: 'Trial Start',  render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'subscriptionEndDate', label: 'Ends',       render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'stripeSubscriptionId', label: 'Stripe ID', render: (v) => v ? <code className="monospace">{v.slice(-12)}</code> : '—' },
    {
      key: '_actions', label: 'Actions',
      render: (_, row) => (
        <div className="admin-table__actions">
          <button
            className="admin-btn admin-btn--sm admin-btn--success"
            onClick={() => handleExtend(row)}
            disabled={actionId === row._id}
            title="Extend"
          >
            <CalendarPlus size={14} />
          </button>
          <button
            className="admin-btn admin-btn--sm admin-btn--danger"
            onClick={() => handleCancel(row)}
            disabled={actionId === row._id || row.subscriptionStatus === 'expired'}
            title="Cancel"
          >
            <XCircle size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="Subscription Management" />
        <div className="admin-content">
          <div className="admin-toolbar">
            <p className="admin-toolbar__count">
              {data.pagination?.total ?? '…'} subscriptions
            </p>
            <button className="admin-btn admin-btn--outline" onClick={fetchData}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
          <div className="admin-table-card">
            <AdminTable
              columns={cols}
              data={data.subscriptions}
              loading={loading}
              emptyMsg="No subscriptions found"
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
