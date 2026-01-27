import React, { useState } from 'react';
import { Github, Settings, GraduationCap } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import StatsSection from './StatsSection';
import FollowButton from './FollowButton';
import FollowListModal from './FollowListModal';
import { useTranslation } from 'react-i18next';

export default function ProfileHero({ user, currentUser, followerCount, followingCount, onStatClick, onFollowChange }) {
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();

  const handleSettingsClick = () => {
    history.push('/profile/settings');
  };

  const handleStudentVerificationClick = () => {
    history.push('/profile/student-verification');
  };

  // 깃허브 사용자명 추출
  const getGithubUsername = () => {
    if (!user.github_url) return null;
    try {
      const url = new URL(user.github_url);
      const pathParts = url.pathname.split('/').filter(p => p);
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
              <div className="profile-name-row">
                <h1 className="profile-name">{user.name}</h1>
                <button 
                  className="profile-settings-btn"
                  onClick={handleSettingsClick}
                  title={t('profile.hero.settings')}
                >
                  <Settings size={24} />
                </button>
              </div>
              {/* GitHub + 팔로워/팔로잉을 한 줄에 배치 */}
              <div className="profile-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {user.github_url && (
                  <a 
                    href={user.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: 500 }}
                  >
                    <Github className="w-5 h-5" />
                    {githubUsername ? `@${githubUsername}` : t('profile.hero.github')}
                  </a>
                )}
                {/* 학생 인증 버튼 - 본인 프로필일 때만 표시 */}
                {currentUser && currentUser.id === user.id && (
                  <button
                    onClick={handleStudentVerificationClick}
                    className="profile-link"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      color: 'rgba(255,255,255,0.9)', 
                      fontSize: '15px', 
                      fontWeight: 500,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      fontFamily: 'inherit'
                    }}
                    title={t('profile.hero.studentVerification')}
                  >
                    <GraduationCap className="w-5 h-5" />
                    {t('profile.hero.studentVerification')}
                  </button>
                )}
                {user.role === 'admin' && (
                  <span
                    className="profile-follow-count"
                    onClick={() => setShowFollowersModal(true)}
                    style={{
                      cursor: 'pointer',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '15px',
                      fontWeight: 500,
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center'
                    }}
                  >
                    <strong style={{ color: '#FFFFFF' }}>{followerCount || 0}</strong> {t('profile.hero.followers')}
                  </span>
                )}
                {user.role === 'user' && (
                  <span
                    className="profile-follow-count"
                    onClick={() => setShowFollowingModal(true)}
                    style={{
                      cursor: 'pointer',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '15px',
                      fontWeight: 500,
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center'
                    }}
                  >
                    <strong style={{ color: '#FFFFFF' }}>{followingCount || 0}</strong> {t('profile.hero.following')}
                  </span>
                )}
                
                {/* FollowButton: admin 권한이고 본인이 아닌 경우에만 표시 */}
                {currentUser && currentUser.id !== user.id && user.role === 'admin' && (
                  <FollowButton
                    targetUserId={user.id}
                    targetUsername={user.name}
                    currentUserId={currentUser.id}
                    onFollowChange={onFollowChange}
                  />
                )}
              </div>

              {user.is_email_public && (
                <p className="profile-email">{user.email}</p>
              )}
              {user.tags && user.tags.length > 0 && (
                <div className="profile-tags">
                  {user.tags.map((tag, idx) => (
                    <span key={idx} className="profile-tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <StatsSection stats={user.stats} onStatClick={onStatClick} />
        </div>
      </div>
      
      {/* 팔로워/팔로잉 목록 모달 */}
      {user.role === 'admin' && (
        <FollowListModal
          isOpen={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          userId={user.id}
          type="followers"
          userRole={user.role}
        />
      )}
      {user.role === 'user' && (
        <FollowListModal
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
          userId={user.id}
          type="following"
          userRole={user.role}
        />
      )}
    </div>
  );
}