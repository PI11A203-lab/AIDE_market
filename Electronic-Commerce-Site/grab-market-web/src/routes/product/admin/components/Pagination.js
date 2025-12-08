import React from 'react';

export default function Pagination({ pagination, onPageChange }) {
  if (pagination.totalPages <= 1) {
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
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      {[...Array(pagination.totalPages)].map((_, i) => {
        const pageNum = i + 1;
        // 최대 5개 페이지만 표시
        if (
          pageNum === 1 ||
          pageNum === pagination.totalPages ||
          (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
        ) {
          return (
            <button
              key={pageNum}
              className={`pagination-btn ${pagination.page === pageNum ? 'active' : ''}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        } else if (pageNum === pagination.page - 2 || pageNum === pagination.page + 2) {
          return <span key={pageNum} className="pagination-ellipsis">...</span>;
        }
        return null;
      })}
      <button
        className="pagination-btn"
        disabled={pagination.page === pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  );
}

