import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * AdminTable – generic data table component.
 *
 * Props:
 *   columns  – [{ key, label, render? }]
 *   data     – array of row objects
 *   loading  – bool
 *   emptyMsg – string (shown when data is empty)
 *   pagination – { page, pages, total, onPageChange }
 */
export default function AdminTable({ columns = [], data = [], loading = false, emptyMsg = 'No data found', pagination }) {
  if (loading) {
    return (
      <div className="admin-table__placeholder">
        <div className="admin-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="admin-table__th">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="admin-table__empty">{emptyMsg}</td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row._id || idx} className="admin-table__row">
                {columns.map((col) => (
                  <td key={col.key} className="admin-table__td">
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="admin-pagination">
          <button
            className="admin-pagination__btn"
            disabled={pagination.page <= 1}
            onClick={() => pagination.onPageChange(pagination.page - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="admin-pagination__info">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            className="admin-pagination__btn"
            disabled={pagination.page >= pagination.pages}
            onClick={() => pagination.onPageChange(pagination.page + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
