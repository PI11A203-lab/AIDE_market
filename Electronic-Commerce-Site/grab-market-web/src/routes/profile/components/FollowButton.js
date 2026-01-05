import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, UserMinus } from 'lucide-react';
import { api } from '../../../config/api';
import './FollowButton.css';

const FollowButton = ({ targetUserId, targetUsername, currentUserId, onFollowChange, className = '', showAlways = false }) => {
  const { t, i18n } = useTranslation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [canFollow, setCanFollow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // 팔로우 상태 확인
  useEffect(() => {
    if (!currentUserId || !targetUserId) {
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await api.users.checkFollowStatus(targetUserId, currentUserId);
        const { is_following, can_follow } = response.data;
        setIsFollowing(is_following);
        setCanFollow(can_follow);
      } catch (error) {
        console.error('팔로우 상태 확인 실패:', error);
        setCanFollow(false);
        // showAlways일 때는 에러가 나도 버튼 표시
        if (showAlways) {
          setIsFollowing(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [targetUserId, currentUserId, showAlways]);

  // 팔로우/언팔로우 처리
  const handleToggleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId || actionLoading) return;

    setActionLoading(true);
    try {
      if (isFollowing) {
        await api.users.unfollow(targetUserId, currentUserId);
        setIsFollowing(false);
      } else {
        await api.users.follow(targetUserId, currentUserId);
        setIsFollowing(true);
      }
      
      // 부모 컴포넌트에 변경사항 알림
      if (onFollowChange) {
        onFollowChange(!isFollowing);
      }
    } catch (error) {
      console.error('팔로우/언팔로우 실패:', error);
      alert(error.response?.data?.error || (i18n.exists('creators.followError') ? t('creators.followError') : 'An error occurred while processing the follow action.'));
    } finally {
      setActionLoading(false);
    }
  };

  // can_follow가 false면 버튼 숨김 (showAlways가 true면 항상 표시)
  if (!showAlways && (loading || !canFollow)) {
    return null;
  }

  const isCompactStyle = className.includes('follow-btn');

  // showAlways일 때 로딩 중이면 기본 상태로 표시
  const displayIsFollowing = showAlways && loading ? false : isFollowing;

  // showAlways이고 follow-btn 클래스가 있으면 follow-btn 스타일 우선 적용
  const buttonClassName = isCompactStyle 
    ? `follow-btn ${displayIsFollowing ? 'following' : ''}`
    : `follow-button ${displayIsFollowing ? 'following' : 'follow'} ${className}`;

  return (
    <button
      className={buttonClassName}
      onClick={handleToggleFollow}
      disabled={actionLoading || (showAlways && loading)}
      type="button"
    >
      {isCompactStyle ? (
        <span>
          {displayIsFollowing 
            ? (i18n.exists('creators.following') ? t('creators.following') : 'Following')
            : (i18n.exists('creators.follow') ? t('creators.follow') : 'Follow')}
        </span>
      ) : (
        <>
          {displayIsFollowing ? (
            <>
              <UserMinus className="w-4 h-4" />
              <span>{i18n.exists('creators.following') ? t('creators.following') : 'Following'}</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>{i18n.exists('creators.follow') ? t('creators.follow') : 'Follow'}</span>
            </>
          )}
        </>
      )}
    </button>
  );
};

export default FollowButton;

