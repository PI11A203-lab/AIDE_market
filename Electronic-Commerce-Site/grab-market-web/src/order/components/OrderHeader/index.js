import React from 'react';
import { useHistory } from 'react-router-dom';
import './index.css';

export default function OrderHeader({ order }) {
  const history = useHistory();

  return (
    <>
      {/* Back 버튼 */}
      <button
        onClick={() => history.push('/profile')}
        className="btn-back"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        주문 목록으로
      </button>

      {/* 페이지 헤더 */}
      <div className="page-header">
        <h1 className="page-title">주문 상세</h1>
        <div className="order-meta">
          <span className="order-number">주문번호: {order.order_number || `ORD-${order.id}`}</span>
          <span className="order-date">
            {new Date(order.purchased_at || order.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </>
  );
}

