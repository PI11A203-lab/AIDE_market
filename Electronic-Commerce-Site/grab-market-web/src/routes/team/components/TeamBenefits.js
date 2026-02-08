import React from 'react';
import { TrendingUp, Users, Zap, Shield, Lightbulb, Rocket, Wrench, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TeamBenefits({ teamStats, selectedTeam = [] }) {
  const { t } = useTranslation();

  // 개별 상품들의 평균 스탯 계산
  const calculateIndividualAverage = () => {
    if (selectedTeam.length === 0) return null;

    const statKeys = ['teamwork', 'stability', 'speed', 'creativity', 'productivity', 'maintainability'];
    const statLabels = ['Teamwork', 'Stability', 'Speed', 'Creativity', 'Productivity', 'Maintainability'];
    const teamMembersWithStats = selectedTeam.filter(dev => dev.stats && typeof dev.stats === 'object');

    if (teamMembersWithStats.length === 0) return null;

    return statKeys.map((key, idx) => {
      const sum = teamMembersWithStats.reduce((acc, dev) => {
        const statValue = dev.stats?.[key];
        return acc + (statValue !== undefined && statValue !== null ? statValue : 50);
      }, 0);
      return {
        stat: statLabels[idx],
        value: Math.round(sum / teamMembersWithStats.length)
      };
    });
  };

  const getStatComparison = () => {
    const individualAvg = calculateIndividualAverage();
    if (!individualAvg || !teamStats || teamStats.length === 0) return null;

    return teamStats.map((teamStat) => {
      const individualStat = individualAvg.find(s => s.stat === teamStat.stat);
      const individualValue = individualStat?.value ?? 0;
      const improvement = individualStat ? Math.round(teamStat.value - individualValue) : 0;
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

  const totalImprovementPercent = Math.round(
    comparisons.reduce((sum, comp) => sum + comp.improvementPercent, 0) / comparisons.length
  );

  return (
    <div className="team-benefits-v2">
      {/* 헤더: 한 문장으로 개념 설명 */}
      <div className="benefits-v2-header">
        <h4 className="benefits-v2-title">{t('teamBenefits.title')}</h4>
        <p className="benefits-v2-subtitle">{t('teamBenefits.subtitle')}</p>
      </div>

      {/* 개념 시각화: 개별 → 팀 = 시너지 */}
      <div className="benefits-v2-concept">
        <div className="benefits-v2-concept-item individual">
          <span className="benefits-v2-concept-label">{t('teamBenefits.individual')}</span>
          <span className="benefits-v2-concept-desc">{t('teamBenefits.individualDesc') || '각 AI 단독 사용'}</span>
        </div>
        <ArrowRight className="benefits-v2-arrow" size={24} strokeWidth={2.5} />
        <div className="benefits-v2-concept-item team">
          <span className="benefits-v2-concept-label">{t('teamBenefits.team')}</span>
          <span className="benefits-v2-concept-desc">{t('teamBenefits.teamDesc') || '팀으로 조합'}</span>
        </div>
        <div className="benefits-v2-result">
          <span className="benefits-v2-result-value">+{totalImprovementPercent}%</span>
          <span className="benefits-v2-result-label">{t('teamBenefits.percentImprovement')}</span>
        </div>
      </div>

      {/* 스탯별 시너지 바로 - 하나의 바에 개별(회색) + 시너지(파랑) */}
      <div className="benefits-v2-legend">
        <span className="benefits-v2-legend-item">
          <span className="benefits-v2-legend-dot individual" />
          {t('teamBenefits.individual')}
        </span>
        <span className="benefits-v2-legend-item">
          <span className="benefits-v2-legend-dot synergy" />
          {t('teamBenefits.synergyGain') || '시너지'}
        </span>
      </div>

      <div className="benefits-v2-stats">
        {comparisons.map((comp) => {
          const Icon = statIcons[comp.stat] || TrendingUp;
          const isPositive = comp.improvement > 0;

          return (
            <div key={comp.stat} className="benefits-v2-stat-row">
              <div className="benefits-v2-stat-info">
                {comp.stat !== 'Teamwork' && <Icon className="benefits-v2-stat-icon" size={16} />}
                <span className="benefits-v2-stat-name">{t('chart.statNames.' + comp.stat.toLowerCase())}</span>
              </div>
              <div className="benefits-v2-stat-bar-wrap">
                <div className="benefits-v2-stat-bar">
                  <div
                    className="benefits-v2-bar-segment individual"
                    style={{ width: `${comp.individualValue}%` }}
                  />
                  {isPositive && (
                    <div
                      className="benefits-v2-bar-segment synergy"
                      style={{ width: `${comp.improvement}%` }}
                    />
                  )}
                </div>
              </div>
              <div className="benefits-v2-stat-values">
                <span className="benefits-v2-stat-from">{comp.individualValue}</span>
                <ArrowRight size={12} strokeWidth={2} className="benefits-v2-stat-arrow" />
                <span className="benefits-v2-stat-to">{comp.value}</span>
                {isPositive && (
                  <span className="benefits-v2-stat-gain">+{comp.improvement}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
