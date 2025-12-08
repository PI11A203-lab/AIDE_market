import React from 'react';

export default function SynergyScore({ score }) {
  const getScoreMessage = () => {
    if (score >= 95) return 'Exceptional';
    if (score >= 85) return 'Excellent';
    if (score >= 75) return 'Good';
    return 'Keep building';
  };

  return (
    <div className="synergy-score">
      <div className="synergy-label">Team Synergy</div>
      <div className="synergy-value">{score}</div>
      <div className="synergy-message">{getScoreMessage()}</div>
    </div>
  );
}

