import React from 'react';
import { CheckCircle, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SuccessMessage({ orderNumber, isSubscription, nextPaymentDate }) {
  const { t } = useTranslation();
  return (
    <div className="confirmation-success-message">
      <div className="confirmation-success-icon-wrapper">
        <CheckCircle className="confirmation-success-icon" />
      </div>
      <h2 className="confirmation-success-title">
        {t('purchase.confirmation.success.title')}
      </h2>
      <p className="confirmation-success-subtitle">
        {t('purchase.confirmation.success.subtitle')}
      </p>
      <p className="confirmation-success-order-number">
        {t('purchase.confirmation.success.orderNumber', { number: orderNumber })}
      </p>
      {isSubscription && nextPaymentDate && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">
              {t('purchase.confirmation.success.subscription.title')}
            </span>
          </div>
          <p className="text-sm text-blue-700">
            {t('purchase.confirmation.success.subscription.nextPayment', { date: nextPaymentDate })}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {t('purchase.confirmation.success.subscription.description')}
          </p>
        </div>
      )}
    </div>
  );
}

