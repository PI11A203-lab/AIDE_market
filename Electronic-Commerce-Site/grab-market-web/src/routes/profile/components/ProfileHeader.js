import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProfileHeader({ 
  onMenuClick, 
  showMenuButton = false,
  backButtonLink = "/",
  backButtonText = "common.backHome",
  showBackButton = true
}) {
  const { t } = useTranslation();
  return (
    <header className="profile-header">
      {showMenuButton && (
        <button 
          className="menu-toggle-btn"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
      )}
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">{t('header.title')}</span>
        </Link>
        {showBackButton && (
          <Link 
            to={backButtonLink}
            className="btn-back-to-home"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {t(backButtonText)}
          </Link>
        )}
      </div>
    </header>
  );
}

