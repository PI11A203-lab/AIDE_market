import React, { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { API_URL } from '../../../config/constants';
import { api } from '../../../config/api';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

export default function TeamsTab({ teams, onTeamUpdate }) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();
  const { t, i18n } = useTranslation();

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
    
    if (window.confirm(t('profile.teams.deleteConfirm'))) {
      try {
        await api.teamCompositions.delete(selectedTeam.id);
        message.success(t('profile.teams.deleteSuccess'));
        closeModal();
        if (onTeamUpdate) {
          onTeamUpdate();
        }
      } catch (error) {
        console.error('팀 삭제 실패:', error);
        message.error(t('profile.teams.deleteFail'));
      }
    }
  };

  const getSynergyMessage = (score) => {
    if (score >= 95) return t('synergy.exceptional');
    if (score >= 85) return t('synergy.excellent');
    if (score >= 75) return t('synergy.good');
    if (score >= 65) return t('synergy.keepBuilding');
    return t('synergy.keepBuilding');
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
        <div className="empty-text">{t('profile.teams.emptyTitle')}</div>
        <div className="empty-subtext">{t('profile.teams.emptySubtitle')}</div>
      </div>
    );
  }

  return (
    <>
      <div className="teams-grid">
        {teams.map((team) => {
          const createdDate = team.created_at || team.createdAt;
          const formattedDate = createdDate 
            ? new Date(createdDate).toLocaleDateString(i18n.language, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            : t('profile.teams.noDate');

          return (
            <div 
              key={team.id} 
              className="team-card"
              onClick={() => openModal(team)}
            >
              <div className="team-header">
                <div className="team-info" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div className="team-name" style={{ textAlign: 'left', width: '100%' }}>{team.name || t('common.untitled')}</div>
                  <div className="team-date" style={{ textAlign: 'left', width: '100%' }}>{formattedDate}</div>
                </div>
                <div className="synergy-badge">
                  <span className="synergy-score">{team.total_synergy_score || 0}</span>
                  <div className="synergy-label">{t('profile.teams.synergy')}</div>
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
                        <div className="member-name">{member.name || t('common.unknown')}</div>
                        <div className="member-category">{member.category || t('common.other')}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{t('profile.teams.noMembers')}</p>
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
              <h3 className="modal-title">{selectedTeam.name || t('common.untitled')}</h3>
              <button className="btn-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* 팀 정보 */}
              <div className="team-info-grid">
                <div className="info-item">
                  <div className="info-label">{t('profile.teams.createdAt')}</div>
                  <div className="info-value">
                    {selectedTeam.created_at || selectedTeam.createdAt
                      ? new Date(selectedTeam.created_at || selectedTeam.createdAt).toLocaleDateString(i18n.language, { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : t('profile.teams.noDate')}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">{t('profile.teams.memberCount')}</div>
                  <div className="info-value">
                    {t('profile.teams.membersLabel', { count: selectedTeam.members?.length || 0 })}
                  </div>
                </div>
              </div>

              {/* 시너지 스코어 */}
              <div className="synergy-card">
                <div className="synergy-card-label">{t('profile.teams.synergyScore')}</div>
                <div className="synergy-card-value">{selectedTeam.total_synergy_score || 0}</div>
                <div className="synergy-card-message">
                  {getSynergyMessage(selectedTeam.total_synergy_score || 0)}
                </div>
              </div>

              {/* 팀원 목록 */}
              <h4 className="members-title">{t('profile.teams.membersTitle')}</h4>
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
                        <div className="member-card-name">{member.name || t('common.unknown')}</div>
                        <div className="member-card-category">
                          {member.category === 'Image' ? t('profile.teams.categories.image') : 
                           member.category === 'Infrastructure' ? t('profile.teams.categories.infrastructure') :
                           member.category === 'documents' ? t('profile.teams.categories.documents') :
                           member.category || t('common.other')}
                        </div>
                        <div className="member-card-stats">
                          <span className="stat">{t('developerCard.tech')}: <strong>95</strong></span>
                          <span className="stat">{t('developerCard.creative')}: <strong>88</strong></span>
                          <span className="stat">{t('developerCard.reliable')}: <strong>93</strong></span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{t('profile.teams.noMembers')}</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-danger" onClick={handleDeleteTeam}>
                {t('profile.teams.deleteConfirm')}
              </button>
              <button className="btn-secondary" onClick={closeModal}>
                {t('common.close')}
              </button>
              <button className="btn-primary" onClick={handleEditTeam}>
                {t('profile.teams.edit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

