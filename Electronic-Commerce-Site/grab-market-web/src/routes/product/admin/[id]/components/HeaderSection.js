import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Edit3, Layers } from 'lucide-react';

export default function HeaderSection({ product, productMeta }) {
  if (!product) return null;

  return (
    <section className="admin-product-detail__header">
      <div className="admin-product-detail__header-left">
        <div className="admin-product-detail__avatar">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            (product.name || 'AI').substring(0, 2)
          )}
        </div>
        <div>
          <div className="admin-product-detail__title">{product.name}</div>
          <div className="admin-product-detail__category">
            <Layers size={14} />
            <span>{product.category}</span>
          </div>
          <div className="admin-product-detail__meta">
            {productMeta.map((item) => (
              <span key={item.label}>{item.label}: {item.value}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="admin-product-detail__actions">
        <Link to={`/profile/products/${product.id}/edit`} className="btn btn-secondary">
          <Edit3 size={16} />
          Edit
        </Link>
        <Link to={`/products/${product.id}`} className="btn btn-primary" target="_blank" rel="noreferrer">
          <ExternalLink size={16} />
          View Product Page
        </Link>
      </div>
    </section>
  );
}

