import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { api } from '../../config/api';
import { API_URL } from '../../config/constants';
import ProfileHeader from '../profile/components/ProfileHeader';
import FollowButton from '../profile/components/FollowButton';
import './index.css';

export default function CreatorsPage() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        setCurrentUserId(userData.id);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    // admin 권한 사용자 목록 가져오기
    const loadCreators = async () => {
      try {
        const response = await api.users.getList({ limit: 100 });
        const allUsers = response.data?.users || [];
        
        // role='admin'인 사용자만 필터링하고 follower_count 기준으로 정렬
        const adminUsers = allUsers
          .filter(user => user.role === 'admin')
          .sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0))
          .map((user, index) => ({
            id: user.id,
            rank: index + 1,
            name: user.username,
            username: `@${user.username}`,
            initials: (user.username || 'User').substring(0, 2).toUpperCase(),
            profile_image: user.profile_image,
            follower_count: user.follower_count || 0,
            github_url: user.github_url || null,
            tags: Array.isArray(user.tags) ? user.tags.map(t => typeof t === 'object' ? t.name : t) : []
          }));
        
        setCreators(adminUsers);
      } catch (error) {
        console.error('Top Creators 로드 실패:', error);
        setCreators([]);
      } finally {
        setLoading(false);
      }
    };

    loadCreators();
  }, []);

  const handleCreatorClick = (creatorId) => {
    history.push(`/creators/${creatorId}`);
  };

  const handleFollowChange = (creatorId) => {
    // 팔로우 상태 변경 시 목록 새로고침
    const loadCreators = async () => {
      try {
        const response = await api.users.getList({ limit: 100 });
        const allUsers = response.data?.users || [];
        
        const adminUsers = allUsers
          .filter(user => user.role === 'admin')
          .sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0))
          .map((user, index) => ({
            id: user.id,
            rank: index + 1,
            name: user.username,
            username: `@${user.username}`,
            initials: (user.username || 'User').substring(0, 2).toUpperCase(),
            profile_image: user.profile_image,
            follower_count: user.follower_count || 0,
            github_url: user.github_url || null,
            tags: Array.isArray(user.tags) ? user.tags.map(t => typeof t === 'object' ? t.name : t) : []
          }));
        
        setCreators(adminUsers);
      } catch (error) {
        console.error('Top Creators 새로고침 실패:', error);
      }
    };

    loadCreators();
  };

  if (loading) {
    return (
      <div className="creators-page">
        <ProfileHeader />
        <main className="creators-main">
          <div className="creators-container">
            <h1 className="creators-title">Top Creators</h1>
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
              로딩 중...
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="creators-page">
      <ProfileHeader />
      <main className="creators-main">
        <div className="creators-container">
          <h1 className="creators-title">Top Creators</h1>
          <p className="creators-subtitle">AI 마켓플레이스의 인기 크리에이터들을 만나보세요</p>
          
          {creators.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
              표시할 크리에이터가 없습니다.
            </div>
          ) : (
            <div className="creators-grid">
              {creators.map((creator) => (
                <div key={creator.id} className="creator-card">
                  <div 
                    className="creator-card-header"
                    onClick={() => handleCreatorClick(creator.id)}
                  >
                    <div className="creator-rank-badge">#{creator.rank}</div>
                    <div className="creator-avatar-large">
                      {creator.profile_image ? (
                        <img 
                          src={`${API_URL}/${creator.profile_image}`} 
                          alt={creator.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.textContent = creator.initials;
                          }}
                        />
                      ) : (
                        creator.initials
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className="creator-card-body"
                    onClick={() => handleCreatorClick(creator.id)}
                  >
                    <h3 className="creator-card-name">{creator.name}</h3>
                    <p className="creator-card-username">{creator.username}</p>
                    
                    {creator.tags && creator.tags.length > 0 && (
                      <div className="creator-card-tags">
                        {creator.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="creator-tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    
                    <div className="creator-card-stats">
                      <div className="creator-stat">
                        <span className="creator-stat-value">{creator.follower_count || 0}</span>
                        <span className="creator-stat-label">팔로워</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="creator-card-footer">
                    {currentUserId && currentUserId !== creator.id ? (
                      <FollowButton
                        targetUserId={creator.id}
                        targetUsername={creator.name}
                        currentUserId={currentUserId}
                        onFollowChange={() => handleFollowChange(creator.id)}
                        className="follow-btn-card"
                        showAlways={true}
                      />
                    ) : !currentUserId ? (
                      <button
                        className="follow-btn-card"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          history.push('/login');
                        }}
                        type="button"
                      >
                        Follow
                      </button>
                    ) : null}
                    
                    <button
                      className="view-profile-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCreatorClick(creator.id);
                      }}
                      type="button"
                    >
                      프로필 보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

