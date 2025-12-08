import React from 'react';
import './index.css';

export default function OrderSummary({ order }) {
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '결제 대기';
      case 'completed':
        return '완료';
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'completed':
        return '';
      default:
        return '';
    }
  };

  return (
    <div className="order-summary">
      <h2 className="section-title">주문 요약</h2>
      <div className="summary-row">
        <span className="summary-label">주문 상태</span>
        <span className={`summary-value status ${getStatusClass(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </div>
      <div className="summary-row">
        <span className="summary-label">총 주문 금액</span>
        <span className="summary-value total">¥{order.total_amount?.toLocaleString() || '0'}</span>
      </div>
    </div>
  );
}

