import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function OverviewTab({ hexagonStats }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Skills & Expertise</h3>
      <div className="w-full h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={hexagonStats}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="stat" tick={{ fill: '#6b7280', fontSize: 14 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7280' }} />
            <Radar name="Skills" dataKey="value" stroke="#1a1a1a" fill="#1a1a1a" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

