import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

export default function ProfileHeader({ onMenuClick, showMenuButton = false }) {
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
          <span className="logo-text">AIDE Market</span>
        </Link>
      </div>
    </header>
  );
}

