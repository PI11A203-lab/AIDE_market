import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SuccessMessage({ orderNumber }) {
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
    </div>
  );
}

