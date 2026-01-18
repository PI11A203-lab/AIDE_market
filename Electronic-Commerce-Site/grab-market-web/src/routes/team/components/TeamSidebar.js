import React, { useState } from 'react';
import { Users, X, Award, Save } from 'lucide-react';
import { API_URL } from '../../../config/constants';
import { api } from '../../../config/api';
import { message } from 'antd';
import TeamStatsChart from './TeamStatsChart';
import SynergyScore from './SynergyScore';
import { useTranslation } from 'react-i18next';

export default function TeamSidebar({ 
  selectedTeam, 
  maxTeamSize, 
  teamStats, 
  synergyScore, 
  totalPrice, 
  onRemoveFromTeam,
  onRemoveTemplateTeam,
  selectedTemplateTeamIds = new Set()
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [teamName, setTeamName] = useState('');
  const { t } = useTranslation();

  const handleSaveTeam = async () => {
    if (selectedTeam.length === 0) {
      message.warning(t('teamBuilder.messages.selectMembers'));
      return;
    }

    // 팀 이름이 없으면 입력 받기
    if (!teamName.trim()) {
      setShowNameInput(true);
      return;
    }

    // 팀 이름이 있으면 저장 진행
    await saveTeamToServer();
  };

  const saveTeamToServer = async () => {
    setIsSaving(true);

    try {
      // 사용자 정보 가져오기
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userFromStorage) {
        message.error(t('teamBuilder.messages.loginRequired'));
        setIsSaving(false);
        return;
      }

      const userData = JSON.parse(userFromStorage);
      const userId = userData.id;

      // 1. 팀 구성 생성
      const teamCompositionResponse = await api.teamCompositions.create({
        user_id: userId,
        name: teamName.trim(),
        total_synergy_score: synergyScore
      });

      const teamId = teamCompositionResponse.data.teamComposition.id;

      // 2. 각 팀원을 팀 멤버로 추가
      const memberPromises = selectedTeam.map((dev, index) => 
        api.teamMembers.create({
          team_id: teamId,
          product_id: dev.id,
          category_id: dev.categoryId,
          position: index + 1
        })
      );

      await Promise.all(memberPromises);

      message.success(t('teamBuilder.messages.saveSuccess'));
      setTeamName('');
      setShowNameInput(false);
      
      // 저장 후 선택된 팀 초기화 (선택사항)
      // setSelectedTeam([]);
    } catch (error) {
      console.error('팀 저장 실패:', error);
      message.error(t('teamBuilder.messages.saveFail'));
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="team-sidebar">
      <div className="sidebar-card">
        <h3 className="sidebar-title">
          <span>{t('teamBuilder.teamTitle')}</span>
          <span className="team-count">
            {selectedTeam.length}/{maxTeamSize}
          </span>
        </h3>
        
        {selectedTeam.length === 0 ? (
          <div className="empty-team">
            <Users className="empty-icon" />
            <p>{t('teamBuilder.noDevelopers')}</p>
            <p className="empty-subtitle">{t('teamBuilder.selectDevelopers')}</p>
          </div>
        ) : (
          <>
            {/* 선택된 팀원 */}
            <div className="selected-team-list">
              {/* 템플릿 팀 그룹 */}
              {(() => {
                console.log('TeamSidebar 렌더링:', {
                  selectedTeamCount: selectedTeam.length,
                  selectedTemplateTeamIds: Array.from(selectedTemplateTeamIds),
                  selectedTeam: selectedTeam.map(dev => ({
                    id: dev.id,
                    name: dev.name,
                    templateTeamId: dev.templateTeamId
                  }))
                });
                return null;
              })()}
              {Array.from(selectedTemplateTeamIds).map((templateTeamId) => {
                const templateTeamMembers = selectedTeam.filter(dev => dev.templateTeamId === templateTeamId);
                console.log(`템플릿 팀 ${templateTeamId} 멤버:`, templateTeamMembers);
                if (templateTeamMembers.length === 0) return null;
                
                const templateTeamName = templateTeamMembers[0]?.templateTeamName || 'Template Team';
                const templateTeamTotalPrice = templateTeamMembers.reduce((sum, dev) => sum + dev.price, 0);
                
                return (
                  <div key={`template-${templateTeamId}`} style={{ marginBottom: '1rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                      padding: '0.5rem',
                      background: '#F3F4F6',
                      borderRadius: '0.5rem'
                    }}>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1A1A', margin: 0 }}>
                          {templateTeamName}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0.25rem 0 0 0' }}>
                          {templateTeamMembers.length}명 · ¥{templateTeamTotalPrice.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveTemplateTeam(templateTeamId)}
                        className="team-member-remove"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <X className="remove-icon" style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                      </button>
                    </div>
                    {templateTeamMembers.map((dev) => (
                      <div key={dev.id} className="team-member-item" style={{ marginLeft: '1rem', marginBottom: '0.5rem' }}>
                        <div className="team-member-avatar">
                          {dev.imageUrl ? (
                            <img
                              src={`${API_URL}/${dev.imageUrl}`}
                              alt={dev.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.textContent = dev.name.substring(0, 2);
                              }}
                            />
                          ) : (
                            dev.name.substring(0, 2)
                          )}
                        </div>
                        <div className="team-member-info">
                          <h4 className="team-member-name">{dev.name}</h4>
                          <p className="team-member-price">¥{dev.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              
              {/* 개별 상품 (템플릿 팀에 속하지 않은 멤버) */}
              {selectedTeam
                .filter(dev => !dev.templateTeamId)
                .map((dev) => (
                  <div key={dev.id} className="team-member-item">
                    <div className="team-member-avatar">
                      {dev.imageUrl ? (
                        <img
                          src={`${API_URL}/${dev.imageUrl}`}
                          alt={dev.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.textContent = dev.name.substring(0, 2);
                          }}
                        />
                      ) : (
                        dev.name.substring(0, 2)
                      )}
                    </div>
                    <div className="team-member-info">
                      <h4 className="team-member-name">{dev.name}</h4>
                      <p className="team-member-price">¥{dev.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => onRemoveFromTeam(dev.id)}
                      className="team-member-remove"
                    >
                      <X className="remove-icon" />
                    </button>
                  </div>
                ))}
            </div>

            {/* 팀 스탯 레이더 차트 */}
            <TeamStatsChart teamStats={teamStats} />

            {/* 시너지 스코어 */}
            <SynergyScore score={synergyScore} />

            {/* 총 가격 */}
            <div className="team-price-section">
              <div className="price-row">
                <span className="price-label">{t('teamBuilder.teamTotal')}</span>
                <span className="price-value">¥{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* 팀 이름 입력 */}
            {showNameInput && (
              <div className="team-name-input-section" style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder={t('teamBuilder.namePlaceholder')}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && teamName.trim()) {
                      saveTeamToServer();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                  autoFocus
                />
              </div>
            )}

            {/* 팀 저장 버튼 */}
            <button 
              className="btn-confirm"
              onClick={handleSaveTeam}
              disabled={isSaving || selectedTeam.length === 0}
            >
              <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              {isSaving ? t('teamBuilder.saving') : t('teamBuilder.save')}
            </button>
          </>
        )}
      </div>

      {/* 팁 */}
      {selectedTeam.length > 0 && (
        <div className="team-tip">
          <div className="tip-content">
            <Award className="tip-icon" />
            <div className="tip-text">
              <p className="tip-title">{t('teamBuilder.tipTitle')}</p>
              <p className="tip-description">
                {t('teamBuilder.tipDescription')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}