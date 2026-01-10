import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PurchaseHeader() {
  const { t } = useTranslation();

  return (
    <header className="profile-header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">AIDE Market</span>
        </Link>
        <Link 
          to="/"
          className="btn-back-to-home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {t('purchase.header.backHome')}
        </Link>
      </div>
    </header>
  );
}
