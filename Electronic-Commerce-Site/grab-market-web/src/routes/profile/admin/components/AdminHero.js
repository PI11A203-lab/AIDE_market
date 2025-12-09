import React from 'react';
import { Github, Calendar } from 'lucide-react';
import { API_URL } from '../../../../config/constants';
import { useTranslation } from 'react-i18next';

export default function AdminHero({ admin }) {
  const { t } = useTranslation();
  const getGithubUsername = () => {
    if (!admin?.github_url) return null;
    try {
      const url = new URL(admin.github_url);
      const pathParts = url.pathname.split('/').filter((p) => p);
      return pathParts[pathParts.length - 1] || null;
    } catch (e) {
      return null;
    }
  };

  const renderAvatar = () => {
    if (admin?.profile_image) {
      return (
        <img
          src={`${API_URL}/${admin.profile_image}`}
          alt={admin.username}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2rem' }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.textContent = (admin.username || 'Admin').substring(0, 2);
          }}
        />
      );
    }
    return (admin?.username || 'Admin').substring(0, 2);
  };

  const githubUsername = getGithubUsername();

  return (
    <div className="profile-hero">
      <div className="profile-hero-content">
        <div className="profile-hero-layout">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {renderAvatar()}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{admin.username}</h1>
              <p className="profile-email">{admin.email}</p>
              <div className="profile-meta">
                {admin.github_url && (
                  <a
                    href={admin.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                  >
                    <Github size={20} />
                    {githubUsername ? `@${githubUsername}` : t('profile.admin.hero.github')}
                  </a>
                )}
                <div className="profile-link">
                  <Calendar size={20} />
                  <strong style={{ color: '#111827', marginRight: '4px' }}>{admin.follower_count || 0}</strong> {t('profile.admin.hero.followers')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


