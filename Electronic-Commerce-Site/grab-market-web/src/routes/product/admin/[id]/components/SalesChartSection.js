import React from 'react';
import { SimpleLineChart } from '../../../../../components/charts/LineChart';
import { useTranslation } from 'react-i18next';

export default function SalesChartSection({ chart }) {
  const { t } = useTranslation();
  return (
    <section className="admin-product-detail__chart">
      <div className="section-header">
        <div>
          <div className="section-title">{t('productAdmin.detail.chart.title')}</div>
          <div className="section-subtitle">{t('productAdmin.detail.chart.subtitle')}</div>
        </div>
      </div>
      <SimpleLineChart
        labels={chart.labels}
        datasets={chart.datasets}
        height={320}
        emptyMessage={t('productAdmin.detail.chart.empty')}
      />
    </section>
  );
}

