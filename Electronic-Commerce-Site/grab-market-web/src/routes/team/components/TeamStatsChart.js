import React, { useState } from 'react';
import { RadarChart } from '../../../components/charts';
import { useTranslation } from 'react-i18next';

export default function TeamStatsChart({ teamStats, selectedTeam = [] }) {
  const { t } = useTranslation();
  const [showIndividualComparison, setShowIndividualComparison] = useState(false);

  // 개별 상품 스탯을 레이더 차트 형식으로 변환
  const getIndividualStats = (dev) => {
    if (!dev.stats) return null;
    return [
      { stat: 'Teamwork', value: dev.stats.teamwork || 50 },
      { stat: 'Stability', value: dev.stats.stability || 50 },
      { stat: 'Speed', value: dev.stats.speed || 50 },
      { stat: 'Creativity', value: dev.stats.creativity || 50 },
      { stat: 'Productivity', value: dev.stats.productivity || 50 },
      { stat: 'Maintainability', value: dev.stats.maintainability || 50 }
    ];
  };

  // 카테고리별 색상 매핑
  const getCategoryColor = (category) => {
    const colorMap = {
      'フロントエンド': '#3b82f6', // Blue
      'バックエンド': '#10b981', // Green
      'インフラ': '#f59e0b', // Orange
      'セキュリティ': '#ef4444', // Red
      'デザイン': '#8b5cf6', // Purple
      'マネジメント': '#ec4899', // Pink
      'その他': '#6b7280' // Gray
    };
    return colorMap[category] || '#6b7280';
  };

  // 개별 상품 색상 (순서대로)
  const individualColors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Orange
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange-600
    '#a855f7'  // Purple-600
  ];

  return (
    <div className="team-stats-chart" style={{ position: 'relative' }}>
      <h4 className="chart-title" style={{ margin: '0 0 12px 0' }}>
        {t('chart.title')}
      </h4>

      {/* 비교 모드 토글 */}
      {selectedTeam.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '13px', 
            color: '#6b7280',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={showIndividualComparison}
              onChange={(e) => setShowIndividualComparison(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>{t('chart.showIndividualComparison')}</span>
          </label>
        </div>
      )}

      {/* 레이더 차트 */}
      <div style={{ width: '100%', height: '200px', position: 'relative' }}>
        {showIndividualComparison && selectedTeam.length > 0 ? (
          // 개별 상품과 팀 전체 비교 모드
          (() => {
            const individualDataSets = selectedTeam
              .map((dev) => {
                const individualStats = getIndividualStats(dev);
                if (!individualStats) return null;
                const color = getCategoryColor(dev.category) || individualColors[selectedTeam.indexOf(dev) % individualColors.length];
                return {
                  name: dev.name,
                  data: individualStats,
                  stroke: color,
                  fill: color,
                  fillOpacity: 0.15
                };
              })
              .filter(Boolean);

            // 모든 데이터를 같은 형식으로 변환 (stat 이름 기준으로 통합)
            const allStats = ['Teamwork', 'Stability', 'Speed', 'Creativity', 'Productivity', 'Maintainability'];
            const combinedData = allStats.map(statName => {
              const result = { stat: statName };
              // 팀 평균
              const teamStat = teamStats.find(s => s.stat === statName);
              result.value = teamStat ? teamStat.value : 0;
              // 개별 상품들
              individualDataSets.forEach((dataset, idx) => {
                const individualStat = dataset.data.find(s => s.stat === statName);
                result[`value${idx}`] = individualStat ? individualStat.value : 0;
              });
              return result;
            });

            return (
              <RadarChart
                data={combinedData}
                name={t('chart.teamAverage')}
                stroke="#1a1a1a"
                fill="#1a1a1a"
                fillOpacity={0.3}
                multipleData={individualDataSets.map((dataset, idx) => ({
                  name: dataset.name,
                  dataKey: `value${idx}`,
                  stroke: dataset.stroke,
                  fill: dataset.fill,
                  fillOpacity: dataset.fillOpacity
                }))}
              />
            );
          })()
        ) : (
          // 팀 전체만 표시
          <RadarChart 
            data={teamStats} 
            name={t('chart.teamAverage')} 
            stroke="#1a1a1a" 
            fill="#1a1a1a"
            fillOpacity={0.3}
          />
        )}
      </div>

      {/* 범례 (개별 비교 모드일 때) */}
      {showIndividualComparison && selectedTeam.length > 0 && (
        <div style={{ 
          marginTop: '16px', 
          paddingTop: '16px',
          paddingBottom: '24px',
          borderTop: '1px solid #e5e7eb',
          fontSize: '12px'
        }}>
          <div style={{ marginBottom: '12px', fontWeight: '600', color: '#1a1a1a' }}>
            {t('chart.legend')}:
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            paddingBottom: '8px'
          }}>
            <div className="legend-item" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              minHeight: '24px',
              padding: '4px 0'
            }}>
              <div style={{ 
                width: '14px', 
                height: '14px', 
                background: '#1a1a1a', 
                borderRadius: '2px',
                opacity: 0.3,
                flexShrink: 0
              }} />
              <span style={{ 
                color: '#6b7280', 
                lineHeight: '1.5',
                fontSize: '13px',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                flex: 1,
                minWidth: 0
              }}>{t('chart.teamAverage')}</span>
            </div>
            {selectedTeam.map((dev, index) => {
              const color = getCategoryColor(dev.category) || individualColors[index % individualColors.length];
              return (
                <div 
                  key={dev.id}
                  className="legend-item"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    minHeight: '24px',
                    padding: '4px 0'
                  }}
                >
                  <div style={{ 
                    width: '14px', 
                    height: '14px', 
                    background: color, 
                    borderRadius: '2px',
                    flexShrink: 0
                  }} />
                  <span style={{ 
                    color: '#6b7280', 
                    lineHeight: '1.5',
                    fontSize: '13px',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    flex: 1,
                    minWidth: 0
                  }}>{dev.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
