import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfileHeader() {
  return (
    <header className="profile-header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">AIDE Market</span>
        </Link>
      </div>
    </header>
  );
}

