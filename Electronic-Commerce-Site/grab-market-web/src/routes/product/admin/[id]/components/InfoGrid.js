import React from 'react';
import { useTranslation } from 'react-i18next';

export default function InfoGrid({ product, formatCurrency, formatDate }) {
  const { t } = useTranslation();
  if (!product) return null;

  const items = [
    { label: t('productAdmin.detail.info.name'), value: product.name },
    { label: t('productAdmin.detail.info.price'), value: formatCurrency(product.price) },
    { label: t('productAdmin.detail.info.category'), value: product.category },
    { label: t('productAdmin.detail.info.created'), value: formatDate(product.createdAt) },
    { label: t('productAdmin.detail.info.views'), value: (product.views || 0).toLocaleString() },
    { label: t('productAdmin.detail.info.favorites'), value: (product.favorites || 0).toLocaleString() },
  ];

  return (
    <section className="admin-product-detail__info">
      <div className="info-card-unified">
        {items.map((item, i) => (
          <div key={i} className="info-row">
            <span className="info-row__label">{item.label}</span>
            <span className="info-row__value">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

