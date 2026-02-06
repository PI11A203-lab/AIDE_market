import React, { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { API_URL } from '../../../config/constants';
import { api } from '../../../config/api';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import TeamStatsChart from '../../team/components/TeamStatsChart';

export default function TeamsTab({ teams, onTeamUpdate }) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    setShowDeleteConfirm(false);
    document.body.style.overflow = 'auto';
  };

  const handleEditTeam = () => {
    if (selectedTeam) {
      // 팀 편집 페이지로 이동 (팀 ID를 URL 파라미터로 전달)
      history.push(`/team?edit=${selectedTeam.id}`);
      closeModal();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTeam) return;
    
    try {
      await api.teamCompositions.delete(selectedTeam.id);
      message.success(t('profile.teams.deleteSuccess'));
      setShowDeleteConfirm(false);
      closeModal();
      if (onTeamUpdate) {
        onTeamUpdate();
      }
    } catch (error) {
      console.error('팀 삭제 실패:', error);
      message.error(t('profile.teams.deleteFail'));
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
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

  // 팀 통계 계산 (team 페이지와 동일한 로직)
  const calculateTeamStats = (members) => {
    if (!members || members.length === 0) {
      return [
        { stat: 'Technical', value: 0 },
        { stat: 'Communication', value: 0 },
        { stat: 'Creativity', value: 0 },
        { stat: 'Speed', value: 0 },
        { stat: 'Reliability', value: 0 },
        { stat: 'Innovation', value: 0 }
      ];
    }

    const avgStats = members.reduce((acc, dev) => {
      const stats = dev.stats || {
        technical: 95,
        communication: 90,
        creativity: 88,
        speed: 92,
        reliability: 93,
        innovation: 90
      };
      return {
        technical: acc.technical + stats.technical,
        communication: acc.communication + stats.communication,
        creativity: acc.creativity + stats.creativity,
        speed: acc.speed + stats.speed,
        reliability: acc.reliability + stats.reliability,
        innovation: acc.innovation + stats.innovation
      };
    }, { technical: 0, communication: 0, creativity: 0, speed: 0, reliability: 0, innovation: 0 });

    const teamSize = members.length;
    return [
      { stat: 'Technical', value: Math.round(avgStats.technical / teamSize) },
      { stat: 'Communication', value: Math.round(avgStats.communication / teamSize) },
      { stat: 'Creativity', value: Math.round(avgStats.creativity / teamSize) },
      { stat: 'Speed', value: Math.round(avgStats.speed / teamSize) },
      { stat: 'Reliability', value: Math.round(avgStats.reliability / teamSize) },
      { stat: 'Innovation', value: Math.round(avgStats.innovation / teamSize) }
    ];
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
              <div className="team-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <div className="team-info" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: '1 1 auto', minWidth: 0, width: '100%', maxWidth: 'none', overflow: 'visible' }}>
                  <div className="team-name" style={{ textAlign: 'left', width: 'fit-content', minWidth: '240px', maxWidth: 'none', writingMode: 'horizontal-tb', whiteSpace: 'nowrap', display: 'inline-block', direction: 'ltr', unicodeBidi: 'embed', textTransform: 'none', letterSpacing: 'normal', overflow: 'visible' }}>{team.name || t('common.untitled')}</div>
                  <div className="team-date" style={{ textAlign: 'left', width: '100%', writingMode: 'horizontal-tb', whiteSpace: 'normal' }}>{formattedDate}</div>
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

              {/* 팀 통계 그래프 */}
              {selectedTeam.members && selectedTeam.members.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <TeamStatsChart teamStats={calculateTeamStats(selectedTeam.members)} />
                </div>
              )}

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
              {!showDeleteConfirm ? (
                <>
                  <button className="btn-secondary" onClick={closeModal}>
                    {t('common.close')}
                  </button>
                  <button className="btn-primary" onClick={handleEditTeam}>
                    {t('profile.teams.edit')}
                  </button>
                  <button className="btn-danger" onClick={handleDeleteClick}>
                    {t('profile.teams.delete')}
                  </button>
                </>
              ) : (
                <>
                  <div className="delete-confirm-message">
                    {t('profile.teams.deleteConfirm')}
                  </div>
                  <button className="btn-secondary" onClick={handleDeleteCancel}>
                    {t('profile.reviews.cancel')}
                  </button>
                  <button className="btn-danger" onClick={handleDeleteConfirm}>
                    {t('profile.teams.delete')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

