/**
 * AdminCard – KPI / metric card for the dashboard.
 *
 * Props:
 *   title       – label text
 *   value       – primary value
 *   subtitle    – optional secondary text
 *   icon        – Lucide icon component
 *   color       – accent colour class suffix: 'blue' | 'green' | 'purple' | 'orange' | 'red'
 *   trend       – optional { value: number, label: string }
 */
export default function AdminCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const positive = trend && trend.value >= 0;

  return (
    <div className={`admin-card admin-card--${color}`}>
      <div className="admin-card__header">
        <span className="admin-card__title">{title}</span>
        {Icon && (
          <div className={`admin-card__icon-wrap admin-card__icon-wrap--${color}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="admin-card__value">{value}</div>
      {subtitle && <p className="admin-card__subtitle">{subtitle}</p>}
      {trend && (
        <div className={`admin-card__trend ${positive ? 'admin-card__trend--up' : 'admin-card__trend--down'}`}>
          <span>{positive ? '▲' : '▼'} {Math.abs(trend.value)}%</span>
          <span className="admin-card__trend-label">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
