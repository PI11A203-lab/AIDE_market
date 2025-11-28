import React from 'react';
import { Github, Calendar, Settings } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import StatsSection from './StatsSection';

export default function ProfileHero({ user }) {
  const history = useHistory();

  const handleSettingsClick = () => {
    history.push('/profile/settings');
  };

  return (
    <div className="profile-hero">
      <div className="profile-hero-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">
            {user.avatar}
          </div>
          <div className="profile-info">
            <div className="profile-name-container">
              <h2 className="profile-name">{user.name}</h2>
              <button 
                className="profile-settings-btn"
                onClick={handleSettingsClick}
                title="설정"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <p className="profile-email">{user.email}</p>
            <div className="profile-tags">
              {user.tags.map((tag, idx) => (
                <span key={idx} className="profile-tag">#{tag}</span>
              ))}
            </div>
            <div className="profile-links">
              <a 
                href="https://github.com/PI11A203-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-github"
              >
                <Github className="w-5 h-5" />
                @PI11A203-lab
              </a>
              <div className="profile-join">
                <Calendar className="w-5 h-5" />
                Joined {user.joinDate}
              </div>
            </div>
          </div>
        </div>

        <StatsSection stats={user.stats} />
      </div>
    </div>
  );
}