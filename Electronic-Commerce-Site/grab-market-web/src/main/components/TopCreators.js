import React, { useState } from 'react';

const TopCreators = () => {
  // Mock 데이터 (나중에 관리자 유저만 추가되도록 수정 예정)
  const [creators, setCreators] = useState([
    {
      id: 1,
      rank: 1,
      name: 'Guy Hawkins',
      username: '@guyhawk',
      initials: 'GH',
      isFollowing: false
    },
    {
      id: 2,
      rank: 2,
      name: 'Jacob Jones',
      username: '@jacobjj',
      initials: 'JJ',
      isFollowing: true
    },
    {
      id: 3,
      rank: 3,
      name: 'Jenny Wilson',
      username: '@jennyw',
      initials: 'JW',
      isFollowing: false
    },
    {
      id: 4,
      rank: 4,
      name: 'Floyd Miles',
      username: '@floydm',
      initials: 'FM',
      isFollowing: false
    },
    {
      id: 5,
      rank: 5,
      name: 'Arlene McCoy',
      username: '@arlenem',
      initials: 'AM',
      isFollowing: false
    }
  ]);

  const handleFollowClick = (e, creatorId) => {
    e.stopPropagation();
    setCreators(prevCreators =>
      prevCreators.map(creator =>
        creator.id === creatorId
          ? { ...creator, isFollowing: !creator.isFollowing }
          : creator
      )
    );
  };

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
            <div className="creator-avatar">{creator.initials}</div>
            <div className="creator-info">
              <div className="creator-name">{creator.name}</div>
              <div className="creator-username">{creator.username}</div>
            </div>
            <button
              className={`follow-btn ${creator.isFollowing ? 'following' : ''}`}
              onClick={(e) => handleFollowClick(e, creator.id)}
            >
              {creator.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCreators;

