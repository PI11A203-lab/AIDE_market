import React from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../../config/constants';
import { useTranslation } from 'react-i18next';

// 카테고리 ID를 번역 키로 변환
const getCategoryKey = (categoryId) => {
  const categoryMap = {
    1: 'fe',
    2: 'be',
    3: 'design',
    4: 'mg',
    5: 'inf',
    6: 'sec',
    7: 'doc'
  };
  return categoryMap[categoryId] || null;
};

const ProductList = ({ products }) => {
  const { t } = useTranslation();

  return (
    <div className="products-grid">
      {products.map((product) => {
        const isPurchased = product.is_purchased === 1 || product.is_purchased === true;
        
        return (
          <Link 
            key={product.id} 
            to={`/products/${product.id}`}
            className="product-card"
            style={{ position: 'relative' }}
          >
            {isPurchased && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(229, 231, 235, 0.8)',
                borderRadius: '8px',
                zIndex: 10,
                pointerEvents: 'none'
              }} />
            )}
            
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
                {(() => {
                  const categoryKey = getCategoryKey(product.category_id);
                  return categoryKey 
                    ? t(`home.tabs.${categoryKey}`)
                    : (product.category_name || t('purchase.productCard.categoryFallback'));
                })()}
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
        );
      })}
    </div>
  );
};

export default ProductList;
