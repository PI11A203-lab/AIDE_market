import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SynergyScore({ score }) {
  const { t } = useTranslation();

  const getScoreMessage = () => {
    if (score >= 95) return t('synergy.exceptional');
    if (score >= 85) return t('synergy.excellent');
    if (score >= 75) return t('synergy.good');
    return t('synergy.keepBuilding');
  };

  return (
    <div className="synergy-score">
      <div className="synergy-label">{t('synergy.label')}</div>
      <div className="synergy-value">{score}</div>
      <div className="synergy-message">{getScoreMessage()}</div>
    </div>
  );
}

