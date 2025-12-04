import React, { useState } from 'react';
import { Users, X, Award, Save } from 'lucide-react';
import { API_URL } from '../../config/constants';
import { api } from '../../config/api';
import { message } from 'antd';
import TeamStatsChart from './TeamStatsChart';
import SynergyScore from './SynergyScore';

export default function TeamSidebar({ 
  selectedTeam, 
  maxTeamSize, 
  teamStats, 
  synergyScore, 
  totalPrice, 
  onRemoveFromTeam 
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [teamName, setTeamName] = useState('');

  const handleSaveTeam = async () => {
    if (selectedTeam.length === 0) {
      message.warning('팀원을 선택해주세요.');
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
        message.error('로그인이 필요합니다.');
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

      message.success('팀이 저장되었습니다!');
      setTeamName('');
      setShowNameInput(false);
      
      // 저장 후 선택된 팀 초기화 (선택사항)
      // setSelectedTeam([]);
    } catch (error) {
      console.error('팀 저장 실패:', error);
      message.error('팀 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="team-sidebar">
      <div className="sidebar-card">
        <h3 className="sidebar-title">
          <span>AIチーム</span>
          <span className="team-count">
            {selectedTeam.length}/{maxTeamSize}
          </span>
        </h3>
        
        {selectedTeam.length === 0 ? (
          <div className="empty-team">
            <Users className="empty-icon" />
            <p>開発者が選択されていません</p>
            <p className="empty-subtitle">開発者を選択してください</p>
          </div>
        ) : (
          <>
            {/* 선택된 팀원 */}
            <div className="selected-team-list">
              {selectedTeam.map((dev) => (
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
                <span className="price-label">チーム合計</span>
                <span className="price-value">¥{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* 팀 이름 입력 */}
            {showNameInput && (
              <div className="team-name-input-section" style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="팀 이름을 입력하세요"
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
              {isSaving ? '저장 중...' : '팀 저장하기'}
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
              <p className="tip-title">プロダクトドキュメント</p>
              <p className="tip-description">
              異なる専門分野を持つチームを作り、最大限活用して最高の結果を得てください！
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}