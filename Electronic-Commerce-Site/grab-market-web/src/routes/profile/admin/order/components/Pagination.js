import React from 'react';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination.totalPages || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={pagination.page === 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {[...Array(pagination.totalPages)].map((_, idx) => {
        const page = idx + 1;
        if (
          page === 1 ||
          page === pagination.totalPages ||
          (page >= pagination.page - 1 && page <= pagination.page + 1)
        ) {
          return (
            <button
              key={page}
              className={`pagination-btn ${pagination.page === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        }

        if (page === pagination.page - 2 || page === pagination.page + 2) {
          return (
            <span key={page} className="pagination-ellipsis">
              ...
            </span>
          );
        }
        return null;
      })}

      <button
        className="pagination-btn"
        disabled={pagination.page === pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}


