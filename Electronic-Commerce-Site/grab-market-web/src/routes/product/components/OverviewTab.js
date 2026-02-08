import React from 'react';
import { RadarChart } from '../../../components/charts';
import { useTranslation } from 'react-i18next';

const STAT_KEYS = ['teamwork', 'stability', 'speed', 'creativity', 'productivity', 'maintainability'];

export default function OverviewTab({ hexagonStats }) {
  const { t } = useTranslation();
  const translatedStats = hexagonStats?.map(s => ({
    ...s,
    stat: STAT_KEYS.includes((s.stat || '').toLowerCase())
      ? t('chart.statNames.' + s.stat.toLowerCase())
      : s.stat
  })) || [];
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{t('product.overview.title')}</h3>
      <div className="w-full h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
        <RadarChart data={translatedStats} />
      </div>
    </div>
  );
}

