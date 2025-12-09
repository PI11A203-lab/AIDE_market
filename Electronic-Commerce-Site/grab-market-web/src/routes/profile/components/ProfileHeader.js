import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProfileHeader({ onMenuClick, showMenuButton = false }) {
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
      </div>
    </header>
  );
}

