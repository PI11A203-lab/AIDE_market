import React from 'react';
import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

/**
 * 기본 레이더 차트 컴포넌트
 */
export default function RadarChartComponent({
  data,
  name = 'Skills',
  dataKey = 'value',
  stroke = '#1a1a1a',
  fill = '#1a1a1a',
  fillOpacity = 0.6,
}) {
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

