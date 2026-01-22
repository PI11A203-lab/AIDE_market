import React from 'react';
import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

/**
 * 기본 레이더 차트 컴포넌트
 * 여러 데이터셋을 동시에 표시할 수 있도록 개선
 */
export default function RadarChartComponent({
  data,
  name = 'Skills',
  dataKey = 'value',
  stroke = '#1a1a1a',
  fill = '#1a1a1a',
  fillOpacity = 0.6,
  multipleData = [], // 여러 데이터셋을 동시에 표시
}) {
  // 여러 데이터셋이 있는 경우
  if (multipleData.length > 0) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="stat" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
          {/* 메인 데이터 */}
          <Radar 
            name={name} 
            dataKey={dataKey} 
            stroke={stroke} 
            fill={fill} 
            fillOpacity={fillOpacity} 
          />
          {/* 추가 데이터셋들 */}
          {multipleData.map((dataset, index) => (
            <Radar
              key={index}
              name={dataset.name}
              dataKey={dataset.dataKey || 'value'}
              stroke={dataset.stroke || stroke}
              fill={dataset.fill || fill}
              fillOpacity={dataset.fillOpacity || 0.15}
            />
          ))}
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    );
  }

  // 단일 데이터셋
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="stat" tick={{ fill: '#6b7280', fontSize: 14 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7280' }} />
        <Radar name={name} dataKey={dataKey} stroke={stroke} fill={fill} fillOpacity={fillOpacity} />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
