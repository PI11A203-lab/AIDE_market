import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../index.css';
import '../../profile/index.css';

export default function ProductHeader() {
  const { t } = useTranslation();

  return (
    <header className="product-header profile-header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">{t('header.title')}</span>
        </Link>
        <Link 
          to="/"
          className="btn-back-to-home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {t('common.backHome')}
        </Link>
      </div>
    </header>
  );
}
