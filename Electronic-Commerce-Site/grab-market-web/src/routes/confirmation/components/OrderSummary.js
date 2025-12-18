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
      {orderDetails.isSubscription && orderDetails.nextPaymentDate && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-sm font-semibold text-gray-900">
              {t('purchase.confirmation.summary.subscription.title')}
            </span>
          </div>
          <p className="text-sm text-gray-700">
            {t('purchase.confirmation.summary.subscription.nextPayment', { date: orderDetails.nextPaymentDate })}
          </p>
        </div>
      )}
    </div>
  );
}

