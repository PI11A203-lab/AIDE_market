import React from 'react';
import { useTranslation } from 'react-i18next';

export default function InfoGrid({ product, formatCurrency, formatDate }) {
  const { t } = useTranslation();
  if (!product) return null;

  return (
    <section className="admin-product-detail__info">
      <div className="info-card">
        <div className="info-label">{t('productAdmin.detail.info.name')}</div>
        <div className="info-value">{product.name}</div>
      </div>
      <div className="info-card">
        <div className="info-label">{t('productAdmin.detail.info.price')}</div>
        <div className="info-value">{formatCurrency(product.price)}</div>
      </div>
      <div className="info-card">
        <div className="info-label">{t('productAdmin.detail.info.category')}</div>
        <div className="info-value">{product.category}</div>
      </div>
      <div className="info-card">
        <div className="info-label">{t('productAdmin.detail.info.created')}</div>
        <div className="info-value">{formatDate(product.createdAt)}</div>
      </div>
      <div className="info-card">
        <div className="info-label">{t('productAdmin.detail.info.views')}</div>
        <div className="info-value">{(product.views || 0).toLocaleString()}</div>
      </div>
      <div className="info-card">
        <div className="info-label">{t('productAdmin.detail.info.favorites')}</div>
        <div className="info-value">{(product.favorites || 0).toLocaleString()}</div>
      </div>
    </section>
  );
}

