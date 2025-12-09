import React from 'react';
import { RadarChart } from '../../../components/charts';
import { useTranslation } from 'react-i18next';

export default function OverviewTab({ hexagonStats }) {
  const { t } = useTranslation();
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{t('product.overview.title')}</h3>
      <div className="w-full h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
        <RadarChart data={hexagonStats} />
      </div>
    </div>
  );
}

