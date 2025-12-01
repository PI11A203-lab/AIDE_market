import React from 'react';
import { useHistory, Link } from 'react-router-dom';

export default function ProfileHeader() {
  const history = useHistory();

  return (
    <header className="profile-header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">AIDE Market</span>
        </Link>
        <button 
          onClick={() => history.push('/')}
          className="btn-back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </button>
      </div>
    </header>
  );
}

