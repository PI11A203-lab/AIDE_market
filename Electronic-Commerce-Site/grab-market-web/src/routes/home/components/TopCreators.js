import React, { useState, useEffect } from 'react';
import { api } from '../../../config/api';
import { API_URL } from '../../../config/constants';
import FollowButton from '../../profile/components/FollowButton';

const TopCreators = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

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
          .slice(0, 5) // 상위 5명만 표시
          .map((user, index) => ({
            id: user.id,
            rank: index + 1,
            name: user.username,
            username: `@${user.username}`,
            initials: (user.username || 'User').substring(0, 2).toUpperCase(),
            profile_image: user.profile_image,
            follower_count: user.follower_count || 0
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

  const handleFollowChange = (creatorId) => {
    // 팔로우 상태 변경 시 목록 새로고침
    const loadCreators = async () => {
      try {
        const response = await api.users.getList({ limit: 100 });
        const allUsers = response.data?.users || [];
        
        const adminUsers = allUsers
          .filter(user => user.role === 'admin')
          .sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0))
          .slice(0, 5)
          .map((user, index) => ({
            id: user.id,
            rank: index + 1,
            name: user.username,
            username: `@${user.username}`,
            initials: (user.username || 'User').substring(0, 2).toUpperCase(),
            profile_image: user.profile_image,
            follower_count: user.follower_count || 0
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
      <div className="sidebar-card">
        <div className="sidebar-title">
          <span>Top Creators</span>
        </div>
        <div className="creator-list">
          <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="sidebar-card">
        <div className="sidebar-title">
          <span>Top Creators</span>
        </div>
        <div className="creator-list">
          <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>표시할 크리에이터가 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-card">
      <div className="sidebar-title">
        <span>Top Creators</span>
        <button 
          type="button"
          className="see-all"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          See All
        </button>
      </div>
      <div className="creator-list">
        {creators.map((creator) => (
          <div key={creator.id} className="creator-item">
            <div className="rank-number">{creator.rank}</div>
            <div className="creator-avatar">
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
            <div className="creator-info">
              <div className="creator-name">{creator.name}</div>
              <div className="creator-username">{creator.username}</div>
            </div>
            {currentUserId && currentUserId !== creator.id ? (
              <FollowButton
                targetUserId={creator.id}
                targetUsername={creator.name}
                currentUserId={currentUserId}
                onFollowChange={() => handleFollowChange(creator.id)}
                className="follow-btn"
                showAlways={true}
              />
            ) : !currentUserId ? (
              <button
                className="follow-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // 로그인 페이지로 이동하거나 로그인 모달 표시
                  window.location.href = '/login';
                }}
                type="button"
              >
                Follow
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCreators;

