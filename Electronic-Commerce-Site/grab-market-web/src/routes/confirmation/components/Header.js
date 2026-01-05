import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="confirmation-header">
      <div className="confirmation-header-container">
        <div className="confirmation-header-content">
          <h1 className="confirmation-header-title">
            <span className="confirmation-header-text">
              {t('purchase.confirmation.headerTitle')}
            </span>
          </h1>
        </div>
      </div>
    </header>
  );
}

