import React from 'react';

export default function EmptyState({ hasFilters }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">🧾</div>
      <div className="empty-title">No orders found</div>
      <div className="empty-description">
        {hasFilters
          ? '조건을 변경하거나 리셋해보세요.'
          : '주문 데이터가 없습니다.'}
      </div>
    </div>
  );
}


