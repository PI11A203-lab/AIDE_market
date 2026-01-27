import React from 'react';
import { TrendingUp, Users, Zap, Shield, Lightbulb, Rocket, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TeamBenefits({ teamStats, selectedTeam = [] }) {
  const { t } = useTranslation();

  // 개별 상품들의 평균 스탯 계산
  const calculateIndividualAverage = () => {
    if (selectedTeam.length === 0) return null;

    const statKeys = ['teamwork', 'stability', 'speed', 'creativity', 'productivity', 'maintainability'];
    const statLabels = ['Teamwork', 'Stability', 'Speed', 'Creativity', 'Productivity', 'Maintainability'];
    
    // selectedTeam에 stats가 있는 멤버만 필터링
    const teamMembersWithStats = selectedTeam.filter(dev => dev.stats && typeof dev.stats === 'object');
    
    if (teamMembersWithStats.length === 0) {
      console.warn('TeamBenefits: stats를 가진 멤버가 없습니다', selectedTeam);
      return null;
    }
    
    const individualAverages = statKeys.map((key, idx) => {
      const sum = teamMembersWithStats.reduce((acc, dev) => {
        // stats가 없거나 해당 키가 없으면 기본값 50 사용
        const statValue = dev.stats?.[key];
        return acc + (statValue !== undefined && statValue !== null ? statValue : 50);
      }, 0);
      const avg = sum / teamMembersWithStats.length;
      return {
        stat: statLabels[idx],
        value: Math.round(avg)
      };
    });

    return individualAverages;
  };

  // 팀 스탯과 개별 평균 비교
  const getStatComparison = () => {
    const individualAvg = calculateIndividualAverage();
    if (!individualAvg || !teamStats || teamStats.length === 0) {
      console.warn('TeamBenefits: individualAvg 또는 teamStats가 없습니다', { individualAvg, teamStats, selectedTeam });
      return null;
    }

    return teamStats.map((teamStat) => {
      const individualStat = individualAvg.find(s => s.stat === teamStat.stat);
      
      // 디버깅: individualStat를 찾지 못한 경우
      if (!individualStat) {
        console.warn(`TeamBenefits: individualStat를 찾을 수 없습니다. teamStat.stat: ${teamStat.stat}`, {
          teamStat,
          individualAvg,
          availableStats: individualAvg.map(s => s.stat)
        });
      }
      
      const individualValue = individualStat?.value ?? 0;
      const improvement = individualStat 
        ? Math.round(teamStat.value - individualValue)
        : 0;
      const improvementPercent = individualStat && individualValue > 0
        ? Math.round((improvement / individualValue) * 100)
        : 0;

      return {
        ...teamStat,
        individualValue,
        improvement,
        improvementPercent
      };
    });
  };

  const statIcons = {
    'Teamwork': Users,
    'Stability': Shield,
    'Speed': Zap,
    'Creativity': Lightbulb,
    'Productivity': Rocket,
    'Maintainability': Wrench
  };

  const comparisons = getStatComparison();
  if (!comparisons || selectedTeam.length === 0) return null;

  // 전체 평균 개선도 계산
  const totalImprovement = comparisons.reduce((sum, comp) => sum + comp.improvement, 0) / comparisons.length;
  const totalImprovementPercent = comparisons.reduce((sum, comp) => sum + comp.improvementPercent, 0) / comparisons.length;

  return (
    <div className="team-benefits">
      <div className="benefits-header">
        <TrendingUp className="benefits-icon" />
        <div>
          <h4 className="benefits-title">{t('teamBenefits.title')}</h4>
          <p className="benefits-subtitle">{t('teamBenefits.subtitle')}</p>
        </div>
      </div>

      {/* 전체 개선도 요약 */}
      <div className="improvement-summary">
        <div className="improvement-card">
          <div className="improvement-value">
            +{Math.round(totalImprovement)}
          </div>
          <div className="improvement-label">{t('teamBenefits.avgImprovement')}</div>
        </div>
        <div className="improvement-card highlight">
          <div className="improvement-value">
            +{Math.round(totalImprovementPercent)}%
          </div>
          <div className="improvement-label">{t('teamBenefits.percentImprovement')}</div>
        </div>
      </div>

      {/* 스탯별 상세 비교 */}
      <div className="stat-comparisons">
        {comparisons.map((comp) => {
          const Icon = statIcons[comp.stat] || TrendingUp;
          const isPositive = comp.improvement > 0;
          
          return (
            <div key={comp.stat} className="stat-comparison-item">
              <div className="stat-comparison-header">
                <div className="stat-comparison-icon-wrapper">
                  <Icon className="stat-comparison-icon" />
                </div>
                <div className="stat-comparison-info">
                  <div className="stat-comparison-name">{comp.stat}</div>
                  <div className="stat-comparison-values">
                    <span className="stat-value-individual">
                      {t('teamBenefits.individual')}: {comp.individualValue}
                    </span>
                    <span className="stat-value-team">
                      {t('teamBenefits.team')}: {comp.value}
                    </span>
                  </div>
                </div>
                {isPositive && (
                  <div className="stat-improvement-badge">
                    +{comp.improvement} (+{comp.improvementPercent}%)
                  </div>
                )}
              </div>
              
              {/* 진행 바 */}
              <div className="stat-comparison-bars">
                <div className="stat-bar-container">
                  <div className="stat-bar-label">{t('teamBenefits.individual')}</div>
                  <div className="stat-bar">
                    <div 
                      className="stat-bar-fill individual" 
                      style={{ width: `${comp.individualValue}%` }}
                    />
                  </div>
                  <div className="stat-bar-value">{comp.individualValue}</div>
                </div>
                <div className="stat-bar-container">
                  <div className="stat-bar-label">{t('teamBenefits.team')}</div>
                  <div className="stat-bar">
                    <div 
                      className="stat-bar-fill team" 
                      style={{ width: `${comp.value}%` }}
                    />
                  </div>
                  <div className="stat-bar-value">{comp.value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
