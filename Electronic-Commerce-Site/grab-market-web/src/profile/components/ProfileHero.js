import React, { useState } from 'react';
import { Github, Calendar, Settings } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { API_URL } from '../../config/constants';
import StatsSection from './StatsSection';
import FollowButton from './FollowButton';
import FollowListModal from './FollowListModal';

export default function ProfileHero({ user, currentUser, followerCount, followingCount, onFollowChange }) {
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const history = useHistory();

  const handleSettingsClick = () => {
    history.push('/profile/settings');
  };

  // 프로필 이미지 또는 아바타 텍스트 표시
  const renderAvatar = () => {
    if (user.profile_image) {
      return (
        <img 
          src={`${API_URL}/${user.profile_image}`} 
          alt={user.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2rem' }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.textContent = (user.name || 'User').substring(0, 2);
          }}
        />
      );
    }
    return (user.name || 'User').substring(0, 2);
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
            <div className="profile-avatar-large">
              {renderAvatar()}
            </div>
            <div className="profile-info">
              <div className="profile-name-row">
                <h1 className="profile-name">{user.name}</h1>
                <button 
                  className="profile-settings-btn"
                  onClick={handleSettingsClick}
                  title="설정"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              {user.is_email_public && (
                <p className="profile-email">{user.email}</p>
              )}
              <div className="profile-meta">
                {user.github_url && (
                  <a 
                    href={user.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                  >
                    <Github className="w-5 h-5" />
                    {githubUsername ? `@${githubUsername}` : 'GitHub'}
                  </a>
                )}
                <div className="profile-link">
                  <Calendar className="w-5 h-5" />
                  Joined {user.joinDate}
                </div>
              </div>
              {user.tags && user.tags.length > 0 && (
                <div className="profile-tags">
                  {user.tags.map((tag, idx) => (
                    <span key={idx} className="profile-tag">#{tag}</span>
                  ))}
                </div>
              )}
              
              {/* 팔로워/팔로잉 수 및 FollowButton */}
              <div className="profile-follow-section" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* admin 권한 계정: 팔로워 수 표시 */}
                {user.role === 'admin' && (
                  <button
                    className="profile-follow-count"
                    onClick={() => setShowFollowersModal(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      color: '#374151',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    <strong style={{ color: '#111827' }}>{followerCount || 0}</strong> 팔로워
                  </button>
                )}
                
                {/* user 권한 계정: 팔로잉 수 표시 */}
                {user.role === 'user' && (
                  <button
                    className="profile-follow-count"
                    onClick={() => setShowFollowingModal(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      color: '#374151',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    <strong style={{ color: '#111827' }}>{followingCount || 0}</strong> 팔로잉
                  </button>
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
            </div>
          </div>

          <StatsSection stats={user.stats} />
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