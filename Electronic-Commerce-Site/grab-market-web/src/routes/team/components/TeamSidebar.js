import React from 'react';
import TeamStatsChart from './TeamStatsChart';
import TeamBenefits from './TeamBenefits';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { API_URL } from '../../../config/constants';

export default function TeamSidebar({ 
  selectedTeam, 
  maxTeamSize, 
  teamStats, 
  synergyScore, 
  totalPrice, 
  onRemoveFromTeam,
  onRemoveTemplateTeam,
  selectedTemplateTeamIds = new Set(),
  templateTeams = [],
  onAddTemplateTeam
}) {
  const { t, i18n } = useTranslation();

  // 템플릿 이름 번역 함수
  const translateTemplateName = (name) => {
    if (!name) return name;
    
    const currentLang = i18n.language || 'ko';
    
    // 템플릿 이름 패턴 매핑
    const templateNameMap = {
      'android': {
        ko: 'Android 앱 템플릿',
        ja: 'Androidアプリ テンプレート',
        en: 'Android App Template'
      },
      'shopping': {
        ko: '쇼핑몰 템플릿',
        ja: 'ショッピングモール テンプレート',
        en: 'Shopping Mall Template'
      },
      'ecommerce': {
        ko: '전자상거래 템플릿',
        ja: 'Eコマース テンプレート',
        en: 'E-commerce Template'
      },
      'web': {
        ko: '웹 애플리케이션 템플릿',
        ja: 'Webアプリケーション テンプレート',
        en: 'Web Application Template'
      },
      'mobile': {
        ko: '모바일 앱 템플릿',
        ja: 'モバイルアプリ テンプレート',
        en: 'Mobile App Template'
      }
    };

    // 템플릿 이름에서 키워드 추출
    const nameLower = name.toLowerCase();
    
    // Android 관련
    if (nameLower.includes('android') || nameLower.includes('アプリ')) {
      return templateNameMap.android[currentLang] || templateNameMap.android['en'];
    }
    
    // Shopping 관련
    if (nameLower.includes('shopping') || nameLower.includes('ショッピング') || nameLower.includes('쇼핑')) {
      return templateNameMap.shopping[currentLang] || templateNameMap.shopping['en'];
    }
    
    // E-commerce 관련
    if (nameLower.includes('ecommerce') || nameLower.includes('e-commerce') || nameLower.includes('전자상거래')) {
      return templateNameMap.ecommerce[currentLang] || templateNameMap.ecommerce['en'];
    }
    
    // Web 관련
    if (nameLower.includes('web') || nameLower.includes('ウェブ') || nameLower.includes('웹')) {
      return templateNameMap.web[currentLang] || templateNameMap.web['en'];
    }
    
    // Mobile 관련
    if (nameLower.includes('mobile') || nameLower.includes('モバイル') || nameLower.includes('모바일')) {
      return templateNameMap.mobile[currentLang] || templateNameMap.mobile['en'];
    }
    
    // 매핑되지 않은 경우, "템플릿" 부분만 번역
    const templateSuffixes = {
      ko: '템플릿',
      ja: 'テンプレート',
      en: 'Template'
    };
    
    // 기존 이름에서 "템플릿", "テンプレート", "template" 제거 후 번역된 접미사 추가
    let translatedName = name
      .replace(/템플릿/gi, '')
      .replace(/テンプレート/gi, '')
      .replace(/template/gi, '')
      .trim();
    
    if (translatedName) {
      return `${translatedName} ${templateSuffixes[currentLang] || templateSuffixes['en']}`;
    }
    
    // 기본값
    return name;
  };

  return (
    <div className="team-sidebar">
      {/* 팀 구성 효과 패널 */}
      <div className="panel-section">
        <h2>{t('teamBuilder.teamTitle')}</h2>
        
        {selectedTeam.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <p>{t('teamBuilder.selectDevelopers')}</p>
          </div>
        ) : (
          <>
            {/* 선택된 AI 표시 */}
            <div className="selected-ais">
              {selectedTeam.map((dev) => (
                <div 
                  key={dev.id} 
                  className="selected-ai-badge"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '8px 12px',
                    background: '#F3F4F6',
                    borderRadius: '8px',
                    position: 'relative'
                  }}
                >
                  {/* 상품 이미지 */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#6B7280',
                      fontWeight: '500'
                    }}
                  >
                    {dev.imageUrl ? (
                      <img
                        src={`${API_URL}/${dev.imageUrl}`}
                        alt={dev.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.textContent = dev.name.substring(0, 2);
                        }}
                      />
                    ) : (
                      dev.name.substring(0, 2)
                    )}
                  </div>
                  <span style={{ flex: 1, fontSize: '14px', color: '#1F2937' }}>{dev.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromTeam(dev.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6B7280',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'all 0.2s',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#EF4444';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.color = '#6B7280';
                    }}
                    title={t('developerCard.removeFromTeam') || '팀에서 제거'}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* 팀 스탯 레이더 차트 */}
            <TeamStatsChart teamStats={teamStats} selectedTeam={selectedTeam} />

            {/* 팀 매리트 시각화 */}
            <TeamBenefits teamStats={teamStats} selectedTeam={selectedTeam} />
          </>
        )}
      </div>

      {/* 추천 템플릿 패널 */}
      {templateTeams.length > 0 && (
        <div className="panel-section">
          <h2>{t('teamBuilder.templateTeams') || '추천 템플릿'}</h2>
          <div className="template-section">
            <h3>{t('teamBuilder.quickStartTitle')}</h3>
            <div className="template-cards">
              {templateTeams.map((team) => (
                <div 
                  key={team.id} 
                  className="template-card"
                  onClick={async () => {
                    if (onAddTemplateTeam) {
                      try {
                        await onAddTemplateTeam(team);
                      } catch (error) {
                        console.error('템플릿 팀 추가 실패:', error);
                      }
                    }
                  }}
                >
                  <div className="template-name">{translateTemplateName(team.name)}</div>
                  <div className="template-ais">
                    {t('teamBuilder.templateCardAIs', { 
                      count: team.members.length, 
                      synergy: team.synergyScore 
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}