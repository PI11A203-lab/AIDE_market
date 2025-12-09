import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SummaryBar({ stats }) {
  const { t } = useTranslation();
  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span className="summary-label">{t('profile.admin.orders.summary.totalOrders')}</span>
        <span className="summary-value">{stats.totalOrders?.toLocaleString?.() ?? 0}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">{t('profile.admin.orders.summary.thisMonth')}</span>
        <span className="summary-value">¥{(stats.thisMonth || 0).toLocaleString()}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">{t('profile.admin.orders.summary.completed')}</span>
        <span className="summary-value">{stats.completed?.toLocaleString?.() ?? 0}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">{t('profile.admin.orders.summary.pending')}</span>
        <span className="summary-value">{stats.pending?.toLocaleString?.() ?? 0}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">{t('profile.admin.orders.summary.avgOrderValue')}</span>
        <span className="summary-value">¥{(stats.avgOrderValue || 0).toLocaleString()}</span>
      </div>
    </div>
  );
}


