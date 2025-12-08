import React from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../../../config/constants';

export default function RecentProducts({ products }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        marginBottom: '40px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
          내 상품 최근 5개
        </h2>
        <Link
          to="/profile/products"
          style={{
            fontSize: '14px',
            color: '#1A1A1A',
            textDecoration: 'none',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #E5E7EB',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#FAFAFA';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          모든 상품 보기 →
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">등록된 상품이 없습니다</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="product-card"
            >
              <div className="card-image">
                <div className="avatar-large">
                  <img
                    src={`${API_URL}/${product.imageUrl}`}
                    alt={product.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.textContent = product.name.substring(0, 2);
                    }}
                  />
                </div>
              </div>
              <div className="card-content">
                <div className="card-category">
                  {product.category_name || 'AI Developer'}
                </div>
                <div className="card-header">
                  <h3 className="card-title">{product.name}</h3>
                </div>
                <div className="card-rating">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FCD34D" stroke="#FCD34D">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span className="rating-value">{parseFloat(product.rating_average || 0).toFixed(1)}</span>
                  <span className="rating-count">({(product.rating_count || 0).toLocaleString()})</span>
                </div>
                <div className="card-footer">
                  <span className="price">¥{product.price.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


