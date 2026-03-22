import { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminTable from '../../components/admin/AdminTable';
import { getUsers, toggleSuspendUser, deleteUser, resetUserTrial } from '../../services/adminApi';
import { Search, RefreshCw, UserX, Trash2, RotateCcw } from 'lucide-react';

const STATUS_BADGE = {
  trial:   { cls: 'badge badge--yellow',  label: 'Trial' },
  active:  { cls: 'badge badge--green',   label: 'Active' },
  expired: { cls: 'badge badge--red',     label: 'Expired' },
};

export default function UsersPage() {
  const [data, setData]       = useState({ users: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [actionId, setActionId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({ page, limit: 15, search });
      setData(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSuspend = async (user) => {
    setActionId(user._id);
    try { await toggleSuspendUser(user._id); fetchUsers(); }
    finally { setActionId(null); }
  };
  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.email}?`)) return;
    setActionId(user._id);
    try { await deleteUser(user._id); fetchUsers(); }
    finally { setActionId(null); }
  };
  const handleReset = async (user) => {
    setActionId(user._id);
    try { await resetUserTrial(user._id); fetchUsers(); }
    finally { setActionId(null); }
  };

  const columns = [
    { key: '_id',    label: 'ID',     render: (v) => <code className="monospace">{v?.slice(-8)}</code> },
    { key: 'name',   label: 'Name' },
    { key: 'email',  label: 'Email' },
    { key: 'role',   label: 'Role',   render: (v) => <span className={`badge ${v === 'admin' ? 'badge--purple' : 'badge--grey'}`}>{v}</span> },
    {
      key: 'subscriptionStatus', label: 'Status',
      render: (v) => {
        const b = STATUS_BADGE[v] || { cls: 'badge badge--grey', label: v };
        return <span className={b.cls}>{b.label}</span>;
      },
    },
    { key: 'isSuspended', label: 'Suspended', render: (v) => v ? <span className="badge badge--red">Yes</span> : <span className="badge badge--green">No</span> },
    { key: 'trialStartDate', label: 'Trial Start', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'riskScore',   label: 'Risk',   render: (v) => <span className={`badge ${v > 50 ? 'badge--red' : v > 20 ? 'badge--yellow' : 'badge--green'}`}>{v ?? 0}</span> },
    {
      key: '_actions', label: 'Actions',
      render: (_, row) => (
        <div className="admin-table__actions">
          <button
            className={`admin-btn admin-btn--sm ${row.isSuspended ? 'admin-btn--success' : 'admin-btn--warning'}`}
            onClick={() => handleSuspend(row)}
            disabled={actionId === row._id || row.role === 'admin'}
            title={row.isSuspended ? 'Unsuspend' : 'Suspend'}
          >
            <UserX size={14} />
          </button>
          <button
            className="admin-btn admin-btn--sm admin-btn--info"
            onClick={() => handleReset(row)}
            disabled={actionId === row._id}
            title="Reset Trial"
          >
            <RotateCcw size={14} />
          </button>
          <button
            className="admin-btn admin-btn--sm admin-btn--danger"
            onClick={() => handleDelete(row)}
            disabled={actionId === row._id || row.role === 'admin'}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title="User Management" />
        <div className="admin-content">
          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={16} className="admin-search__icon" />
              <input
                className="admin-search__input"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <button className="admin-btn admin-btn--outline" onClick={fetchUsers}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>

          <div className="admin-table-card">
            <AdminTable
              columns={columns}
              data={data.users}
              loading={loading}
              emptyMsg="No users found"
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
