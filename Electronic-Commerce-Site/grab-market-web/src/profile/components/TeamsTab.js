import React, { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { API_URL } from '../../config/constants';
import { api } from '../../config/api';
import { message } from 'antd';

export default function TeamsTab({ teams, onTeamUpdate }) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  const openModal = (team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
    document.body.style.overflow = 'auto';
  };

  const handleEditTeam = () => {
    if (selectedTeam) {
      // 팀 편집 페이지로 이동 (팀 ID를 URL 파라미터로 전달)
      history.push(`/team?edit=${selectedTeam.id}`);
      closeModal();
    }
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return;
    
    if (window.confirm('이 팀을 삭제하시겠습니까?')) {
      try {
        await api.teamCompositions.delete(selectedTeam.id);
        message.success('팀이 삭제되었습니다.');
        closeModal();
        if (onTeamUpdate) {
          onTeamUpdate();
        }
      } catch (error) {
        console.error('팀 삭제 실패:', error);
        message.error('팀 삭제에 실패했습니다.');
      }
    }
  };

  const getSynergyMessage = (score) => {
    if (score >= 95) return 'Exceptional';
    if (score >= 85) return 'Excellent';
    if (score >= 75) return 'Great';
    if (score >= 65) return 'Good';
    return 'Fair';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (teams.length === 0) {
    return (
      <div className="empty-state">
        <Users className="empty-icon" />
        <div className="empty-text">아직 생성된 팀이 없습니다</div>
        <div className="empty-subtext">AI 개발자들로 나만의 팀을 구성해보세요</div>
      </div>
    );
  }

  return (
    <>
      <div className="teams-grid">
        {teams.map((team) => {
          const createdDate = team.created_at || team.createdAt;
          const formattedDate = createdDate 
            ? new Date(createdDate).toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            : '날짜 없음';

          return (
            <div 
              key={team.id} 
              className="team-card"
              onClick={() => openModal(team)}
            >
              <div className="team-header">
                <div>
                  <div className="team-name">{team.name || '이름 없는 팀'}</div>
                  <div className="team-date">{formattedDate}</div>
                </div>
                <div className="synergy-badge">
                  <span className="synergy-score">{team.total_synergy_score || 0}</span>
                  <div className="synergy-label">Synergy</div>
                </div>
              </div>
              <div className="team-members">
                {team.members && team.members.length > 0 ? (
                  team.members.map((member, idx) => (
                    <div key={idx} className="member-item">
                      <div className="member-avatar">
                        {member.imageUrl ? (
                          <img 
                            src={`${API_URL}/${member.imageUrl}`}
                            alt={member.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span style={{ display: member.imageUrl ? 'none' : 'flex' }}>
                          {getInitials(member.name)}
                        </span>
                      </div>
                      <div>
                        <div className="member-name">{member.name || 'Unknown'}</div>
                        <div className="member-category">{member.category || 'その他'}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>멤버 없음</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 팀 상세 모달 */}
      {isModalOpen && selectedTeam && (
        <div className="modal-overlay active" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedTeam.name || '이름 없는 팀'}</h3>
              <button className="btn-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* 팀 정보 */}
              <div className="team-info-grid">
                <div className="info-item">
                  <div className="info-label">생성일</div>
                  <div className="info-value">
                    {selectedTeam.created_at || selectedTeam.createdAt
                      ? new Date(selectedTeam.created_at || selectedTeam.createdAt).toLocaleDateString('ko-KR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : '날짜 없음'}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">팀원 수</div>
                  <div className="info-value">
                    {selectedTeam.members?.length || 0}명
                  </div>
                </div>
              </div>

              {/* 시너지 스코어 */}
              <div className="synergy-card">
                <div className="synergy-card-label">Team Synergy Score</div>
                <div className="synergy-card-value">{selectedTeam.total_synergy_score || 0}</div>
                <div className="synergy-card-message">
                  {getSynergyMessage(selectedTeam.total_synergy_score || 0)}
                </div>
              </div>

              {/* 팀원 목록 */}
              <h4 className="members-title">Team Members</h4>
              <div className="members-list">
                {selectedTeam.members && selectedTeam.members.length > 0 ? (
                  selectedTeam.members.map((member, idx) => (
                    <div key={idx} className="member-card">
                      <div className="member-card-avatar">
                        {member.imageUrl ? (
                          <img 
                            src={`${API_URL}/${member.imageUrl}`}
                            alt={member.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span style={{ display: member.imageUrl ? 'none' : 'flex' }}>
                          {getInitials(member.name)}
                        </span>
                      </div>
                      <div className="member-card-info">
                        <div className="member-card-name">{member.name || 'Unknown'}</div>
                        <div className="member-card-category">
                          {member.category === 'Image' ? 'Image Generation' : 
                           member.category === 'Infrastructure' ? 'Infrastructure' :
                           member.category || 'その他'}
                        </div>
                        <div className="member-card-stats">
                          <span className="stat">Tech: <strong>95</strong></span>
                          <span className="stat">Creative: <strong>88</strong></span>
                          <span className="stat">Reliable: <strong>93</strong></span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>멤버 없음</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-danger" onClick={handleDeleteTeam}>
                Delete Team
              </button>
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
              <button className="btn-primary" onClick={handleEditTeam}>
                Edit Team
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

