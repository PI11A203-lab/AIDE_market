import React from 'react';

export default function InfoGrid({ product, formatCurrency, formatDate }) {
  if (!product) return null;

  return (
    <section className="admin-product-detail__info">
      <div className="info-card">
        <div className="info-label">Name</div>
        <div className="info-value">{product.name}</div>
      </div>
      <div className="info-card">
        <div className="info-label">Price</div>
        <div className="info-value">{formatCurrency(product.price)}</div>
      </div>
      <div className="info-card">
        <div className="info-label">Category</div>
        <div className="info-value">{product.category}</div>
      </div>
      <div className="info-card">
        <div className="info-label">Created</div>
        <div className="info-value">{formatDate(product.createdAt)}</div>
      </div>
      <div className="info-card">
        <div className="info-label">Views</div>
        <div className="info-value">{(product.views || 0).toLocaleString()}</div>
      </div>
      <div className="info-card">
        <div className="info-label">Favorites</div>
        <div className="info-value">{(product.favorites || 0).toLocaleString()}</div>
      </div>
    </section>
  );
}

