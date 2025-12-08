import React from 'react';
import { RadarChart } from '../../../components/chart';

export default function OverviewTab({ hexagonStats }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Skills & Expertise</h3>
      <div className="w-full h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
        <RadarChart data={hexagonStats} />
      </div>
    </div>
  );
}

