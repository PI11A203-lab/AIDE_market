import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SummaryBar({ stats }) {
  const { t } = useTranslation();
  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span className="summary-label">{t('productAdmin.list.summary.totalProducts')}</span>
        <span className="summary-value">{stats.totalProducts}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">{t('productAdmin.list.summary.totalSales')}</span>
        <span className="summary-value">{stats.totalSales.toLocaleString()}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">{t('productAdmin.list.summary.totalRevenue')}</span>
        <span className="summary-value">¥{stats.totalRevenue.toLocaleString()}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">{t('productAdmin.list.summary.avgRating')}</span>
        <span className="summary-value">{stats.avgRating}</span>
      </div>
    </div>
  );
}

