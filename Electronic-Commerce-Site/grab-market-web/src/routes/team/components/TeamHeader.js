import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TeamHeader() {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <header className="profile-header">
      <div className="header-content">
        <h1 className="logo">
          <span className="logo-text">AIDE Market</span>
        </h1>
        <button 
          onClick={() => history.push('/')}
          className="btn-back"
        >
          ← {t('common.backHome')}
        </button>
      </div>
    </header>
  );
}