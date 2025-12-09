import React from 'react';
import { useTranslation } from 'react-i18next';

export default function OrderSummary({ orderDetails, purchasedAIs }) {
  const { t } = useTranslation();
  return (
    <div className="confirmation-order-summary">
      <h3 className="confirmation-order-summary-title">{t('purchase.confirmation.summary.title')}</h3>
      <div className="confirmation-order-summary-details">
        <div className="confirmation-order-summary-row">
          <span>{t('purchase.confirmation.summary.number')}</span>
          <span className="confirmation-order-summary-value">{orderDetails.orderNumber}</span>
        </div>
        <div className="confirmation-order-summary-row">
          <span>{t('purchase.confirmation.summary.date')}</span>
          <span className="confirmation-order-summary-value">{orderDetails.orderDate}</span>
        </div>
        <div className="confirmation-order-summary-row">
          <span>{t('purchase.confirmation.summary.items', { count: purchasedAIs.length })}</span>
          <span className="confirmation-order-summary-value">
            {t('purchase.confirmation.summary.items', { count: purchasedAIs.length })}
          </span>
        </div>
        <div className="confirmation-order-summary-total">
          <span className="confirmation-order-summary-total-label">{t('purchase.confirmation.summary.total')}</span>
          <span className="confirmation-order-summary-total-value">
            ¥{orderDetails.total.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="confirmation-order-summary-success">
        <p className="confirmation-order-summary-success-text">
          ✓ {t('purchase.confirmation.summary.paid')}
        </p>
      </div>
    </div>
  );
}

