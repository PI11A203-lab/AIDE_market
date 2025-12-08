import React from 'react';
import { Target } from 'lucide-react';
import { RadarChart } from '../../../components/chart';

export default function TeamStatsChart({ teamStats }) {
  return (
    <div className="team-stats-chart">
      <h4 className="chart-title">
        <Target className="chart-icon" />
        Team Stats
      </h4>
      <div style={{ width: '100%', height: '200px' }}>
        <RadarChart data={teamStats} name="Team" stroke="#3b82f6" fill="#3b82f6" />
      </div>
    </div>
  );
}

