import React from 'react';
import './index.css';
import { useTranslation } from 'react-i18next';

export default function OrderSummary({ order }) {
  const { t } = useTranslation();
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return t('order.status.pending');
      case 'completed':
        return t('order.status.completed');
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
      <div className="summary-row">
        <span className="summary-label">{t('order.statusLabel')}</span>
        <span className={`summary-value status ${getStatusClass(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </div>
      <div className="summary-row">
        <span className="summary-label">{t('order.totalLabel')}</span>
        <span className="summary-value total">¥{order.total_amount?.toLocaleString() || '0'}</span>
      </div>
    </div>
  );
}

