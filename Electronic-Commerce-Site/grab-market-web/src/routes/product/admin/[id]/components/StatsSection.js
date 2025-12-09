import React from 'react';
import { useTranslation } from 'react-i18next';

export default function StatsSection({ stats, formatCurrency }) {
  const { t } = useTranslation();
  return (
    <section className="admin-product-detail__stats">
      <div className="stat-card">
        <div className="stat-label">{t('productAdmin.detail.stats.totalSales')}</div>
        <div className="stat-value">{(stats.totalSales || 0).toLocaleString()}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">{t('productAdmin.detail.stats.totalRevenue')}</div>
        <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">{t('productAdmin.detail.stats.avgRating')}</div>
        <div className="stat-value">{Number(stats.avgRating || 0).toFixed(1)}</div>
      </div>
    </section>
  );
}

