import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FilterBar({ filters, products = [], onFilterChange, onReset }) {
  const { t } = useTranslation();
  const dateRanges = [
    { value: 'all', label: t('profile.admin.orders.filters.dateOptions.all') },
    { value: 'today', label: t('profile.admin.orders.filters.dateOptions.today') },
    { value: 'week', label: t('profile.admin.orders.filters.dateOptions.week') },
    { value: 'month', label: t('profile.admin.orders.filters.dateOptions.month') },
    { value: 'quarter', label: t('profile.admin.orders.filters.dateOptions.quarter') },
    { value: 'year', label: t('profile.admin.orders.filters.dateOptions.year') },
  ];

  const sortOptions = [
    { value: 'recent', label: t('profile.admin.orders.filters.sortOptions.recent') },
    { value: 'oldest', label: t('profile.admin.orders.filters.sortOptions.oldest') },
    { value: 'amount-high', label: t('profile.admin.orders.filters.sortOptions.amountHigh') },
    { value: 'amount-low', label: t('profile.admin.orders.filters.sortOptions.amountLow') },
  ];
  return (
    <div className="filter-bar">
      <div className="filter-grid">
        <div className="filter-group">
          <label className="filter-label">{t('profile.admin.orders.filters.dateRange')}</label>
          <select
            className="filter-select"
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
          >
            {dateRanges.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('profile.admin.orders.filters.product')}</label>
          <select
            className="filter-select"
            value={filters.product}
            onChange={(e) => onFilterChange('product', e.target.value)}
          >
            <option value="">{t('profile.admin.orders.filters.productAll')}</option>
            {products.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('profile.admin.orders.filters.status')}</label>
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">{t('profile.admin.orders.filters.statusAll')}</option>
            <option value="completed">{t('profile.admin.orders.filters.status.completed')}</option>
            <option value="pending">{t('profile.admin.orders.filters.status.pending')}</option>
            <option value="cancelled">{t('profile.admin.orders.filters.status.cancelled')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('profile.admin.orders.filters.sort')}</label>
          <select
            className="filter-select"
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
          >
            {sortOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <button className="btn btn-secondary btn-sm" type="button" onClick={onReset}>
            {t('profile.admin.orders.filters.reset')}
          </button>
        </div>
      </div>
    </div>
  );
}


