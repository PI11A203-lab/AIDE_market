import React, { useMemo } from 'react';
import TeamStatsChart from './TeamStatsChart';
import TeamBenefits from './TeamBenefits';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { API_URL } from '../../../config/constants';
import { TEMPLATE_DETAILS_MAP, getTemplateIdByTeamName } from '../../templates/templateData';

export default function TeamSidebar({ 
  selectedTeam, 
  maxTeamSize, 
  teamStats, 
  synergyScore, 
  totalPrice, 
  onRemoveFromTeam,
  onRemoveTemplateTeam,
  onDeleteTemplateTeam,
  selectedTemplateTeamIds = new Set(),
  templateTeams = [],
  onAddTemplateTeam
}) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'ko').startsWith('ja') ? 'ja' : (i18n.language || 'ko').startsWith('en') ? 'en' : 'ko';
  const langKey = lang === 'ja' ? '_ja' : lang === 'en' ? '_en' : '';

  // 선택된 팀에 포함된 첫 번째 템플릿 ID (상품 아래 패널용)
  const templateIdForPanel = useMemo(() => {
    const firstWithTemplate = selectedTeam.find(dev => dev.templateTeamName);
    if (!firstWithTemplate?.templateTeamName) return null;
    return getTemplateIdByTeamName(firstWithTemplate.templateTeamName);
  }, [selectedTeam]);

  const templateInfo = templateIdForPanel != null ? TEMPLATE_DETAILS_MAP[templateIdForPanel] : null;
  const keyStrengths = templateInfo?.keyStrengths;

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
    
    // 매핑되지 않은 경우, "템플릿" 부분만 현재 언어로 번역 (3개국어)
    const templateLabel = t('teamBuilder.template');
    
    // 기존 이름에서 "템플릿", "テンプレート", "template" 제거 후 번역된 접미사 추가
    let translatedName = name
      .replace(/템플릿/gi, '')
      .replace(/テンプレート/gi, '')
      .replace(/template/gi, '')
      .trim();
    
    if (translatedName) {
      return `${translatedName} ${templateLabel}`;
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
            {/* 선택된 AI 표시 - 세로형 카드 */}
            <div className="selected-ais-cards">
              {selectedTeam.map((dev) => (
                <div 
                  key={dev.id} 
                  className="selected-ai-card"
                >
                  <button
                    className="selected-ai-card-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromTeam(dev.id);
                    }}
                    title={t('developerCard.removeFromTeam') || '팀에서 제거'}
                  >
                    <X size={16} />
                  </button>
                  {/* 세로형 이미지 영역 */}
                  <div className="selected-ai-card-image">
                    {dev.imageUrl ? (
                      <img
                        src={`${API_URL}/${dev.imageUrl}`}
                        alt={dev.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement.querySelector('.selected-ai-card-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="selected-ai-card-fallback"
                      style={{ display: dev.imageUrl ? 'none' : 'flex' }}
                    >
                      {dev.name.substring(0, 2)}
                    </div>
                  </div>
                  {/* 상품 정보 */}
                  <div className="selected-ai-card-info">
                    <span className="selected-ai-card-name">{dev.name}</span>
                    {dev.category && (
                      <span className="selected-ai-card-category">{dev.category}</span>
                    )}
                    {dev.price != null && (
                      <span className="selected-ai-card-price">¥{Number(dev.price).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 템플릿별 정보: 주요 강점 (상품 밑, 팀 통계 위) */}
            {keyStrengths?.length > 0 && (
              <div className="template-info-panel">
                <h3 className="template-info-section-title">{t('teamBuilder.keyStrengthsTitle')}</h3>
                <div className="template-info-strengths">
                  {keyStrengths.map((item, idx) => (
                    <div key={idx} className="template-info-strength-card">
                      <h4 className="template-info-strength-title">
                        {item[`title${langKey}`] || item.title}
                      </h4>
                      <p className="template-info-strength-desc">
                        {item[`description${langKey}`] || item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 팀 스탯 (강점 카드와 간격·구분선) */}
            <div className="team-stats-section">
              <TeamStatsChart teamStats={teamStats} selectedTeam={selectedTeam} />
              <TeamBenefits teamStats={teamStats} selectedTeam={selectedTeam} />
            </div>
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
              {templateTeams.map((team) => {
                const isAdded = selectedTemplateTeamIds.has(team.id);
                const addedMembers = isAdded && selectedTeam
                  ? selectedTeam.filter(dev => {
                      const devTemplateId = typeof dev.templateTeamId === 'string' ? parseInt(dev.templateTeamId) : dev.templateTeamId;
                      return devTemplateId === team.id;
                    })
                  : [];

                return (
                  <div 
                    key={team.id} 
                    className={`template-card ${isAdded ? 'template-card-added' : ''}`}
                    onClick={!isAdded && onAddTemplateTeam ? async () => {
                      try {
                        await onAddTemplateTeam(team);
                      } catch (error) {
                        console.error('템플릿 팀 추가 실패:', error);
                      }
                    } : undefined}
                    style={{ cursor: isAdded ? 'default' : 'pointer' }}
                  >
                    <div className="template-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: isAdded && addedMembers.length > 0 ? '8px' : 0 }}>
                      <div className="template-name" style={{ flex: 1, minWidth: 0 }}>{translateTemplateName(team.name)}</div>
                      {onDeleteTemplateTeam && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTemplateTeam(team.id);
                          }}
                          className="template-card-delete-btn"
                          style={{
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(220, 38, 38, 0.35)',
                            borderRadius: '50%',
                            color: '#DC2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px',
                            width: '28px',
                            height: '28px',
                            flexShrink: 0
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#EF4444';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.borderColor = '#EF4444';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                            e.currentTarget.style.color = '#DC2626';
                            e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.35)';
                          }}
                          title={t('teamBuilder.deleteTemplate') || '템플릿 상품 삭제'}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {isAdded && addedMembers.length > 0 ? (
                      <div className="template-added-members">
                        {addedMembers.map((member) => (
                          <div
                            key={member.id}
                            className="template-member-badge"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px',
                              padding: '6px 10px',
                              background: '#F3F4F6',
                              borderRadius: '8px',
                            marginBottom: '6px',
                            position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  overflow: 'hidden',
                                  flexShrink: 0,
                                  background: '#FFFFFF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '10px',
                                  color: '#6B7280',
                                  fontWeight: '500'
                                }}
                              >
                                {member.imageUrl ? (
                                  <img
                                    src={`${API_URL}/${member.imageUrl}`}
                                    alt={member.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.parentElement.textContent = member.name?.substring(0, 2) || '?';
                                    }}
                                  />
                                ) : (
                                  member.name?.substring(0, 2) || '?'
                                )}
                              </div>
                              <span style={{ fontSize: '12px', color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onRemoveFromTeam) onRemoveFromTeam(member.id);
                              }}
                              className="template-product-remove-btn"
                              style={{
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(220, 38, 38, 0.3)',
                                borderRadius: '50%',
                                color: '#DC2626',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '4px',
                                width: '24px',
                                height: '24px',
                                flexShrink: 0
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#EF4444';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.borderColor = '#EF4444';
                                e.currentTarget.style.transform = 'scale(1.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                                e.currentTarget.style.color = '#DC2626';
                                e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                              title={t('developerCard.removeFromTeam') || '템플릿 상품 제거'}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="template-ais">
                        {t('teamBuilder.templateCardAIs', { 
                          count: team.members.length, 
                          synergy: team.synergyScore 
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}