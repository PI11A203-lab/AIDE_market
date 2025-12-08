import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { api } from '../../config/api';
import { API_URL } from '../../config/constants';
import './FollowListModal.css';

const FollowListModal = ({ isOpen, onClose, userId, type, userRole }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadUsers = useCallback(async (pageNum = 1, resetHasMore = false) => {
    setLoading(true);
    try {
      const response = type === 'followers' 
        ? await api.users.getFollowers(userId, { page: pageNum, limit: 20 })
        : await api.users.getFollowing(userId, { page: pageNum, limit: 20 });

      const data = type === 'followers' ? response.data.followers : response.data.following;
      const pagination = response.data.pagination;

      if (pageNum === 1 || resetHasMore) {
        setUsers(data.map(item => type === 'followers' ? item.follower : item.following).filter(Boolean));
      } else {
        setUsers(prev => [...prev, ...data.map(item => type === 'followers' ? item.follower : item.following).filter(Boolean)]);
      }

      setHasMore(pageNum < pagination.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error(`${type} 목록 로드 실패:`, error);
      alert(error.response?.data?.error || `${type === 'followers' ? '팔로워' : '팔로잉'} 목록을 불러오는 중 오류가 발생했습니다.`);
    } finally {
      setLoading(false);
    }
  }, [type, userId]);

  useEffect(() => {
    if (isOpen && userId) {
      loadUsers(1, true);
    } else {
      setUsers([]);
      setPage(1);
      setHasMore(true);
    }
  }, [isOpen, userId, type, loadUsers]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadUsers(page + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="follow-modal-overlay" onClick={onClose}>
      <div className="follow-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="follow-modal-header">
          <h2 className="follow-modal-title">
            {type === 'followers' ? '팔로워' : '팔로잉'}
          </h2>
          <button className="follow-modal-close" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="follow-modal-body">
          {loading && users.length === 0 ? (
            <div className="follow-modal-loading">로딩 중...</div>
          ) : users.length === 0 ? (
            <div className="follow-modal-empty">
              {type === 'followers' ? '팔로워가 없습니다.' : '팔로잉한 사용자가 없습니다.'}
            </div>
          ) : (
            <>
              <div className="follow-modal-list">
                {users.map((user) => (
                  <div key={user.id} className="follow-modal-item">
                    <div className="follow-modal-avatar">
                      {user.profile_image ? (
                        <img 
                          src={`${API_URL}/${user.profile_image}`} 
                          alt={user.username}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.textContent = (user.username || 'User').substring(0, 2);
                          }}
                        />
                      ) : (
                        <span>{(user.username || 'User').substring(0, 2)}</span>
                      )}
                    </div>
                    <div className="follow-modal-info">
                      <div className="follow-modal-name">{user.username}</div>
                      {user.email && (
                        <div className="follow-modal-email">{user.email}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {hasMore && (
                <button 
                  className="follow-modal-load-more"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? '로딩 중...' : '더 보기'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;

