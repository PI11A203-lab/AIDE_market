import React from 'react';
import { Github, Calendar } from 'lucide-react';
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

  const githubUsername = getGithubUsername();

  return (
    <div className="profile-hero">
      <div className="profile-hero-content">
        <div className="profile-hero-layout">
          <div className="profile-avatar-section">
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
                  {/* 팔로워 숫자를 흰색으로 표시 */}
                  <strong style={{ color: '#FFFFFF', marginRight: '4px' }}>
                    {admin.follower_count || 0}
                  </strong>{' '}
                  {t('profile.admin.hero.followers')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


