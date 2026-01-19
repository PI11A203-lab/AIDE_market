import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="confirmation-header">
      <div className="confirmation-header-container">
        <div className="confirmation-header-content">
          <Link to="/" className="confirmation-logo">
            {t('header.title')}
          </Link>
          <Link 
            to="/"
            className="confirmation-btn-back-to-home"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {t('common.backHome')}
          </Link>
        </div>
      </div>
    </header>
  );
}

