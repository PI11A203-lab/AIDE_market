import React from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/constants';

const RankingSection = ({ topProducts }) => {
  if (topProducts.length === 0) {
    return null;
  }

  return (
    <div className="ranking-list">
      {topProducts.map((product) => (
        <Link 
          key={product.id} 
          to={`/products/${product.id}`}
          className="ranking-item"
        >
          <div className="ranking-badge">{product.rank}</div>
          <div className="ranking-avatar">
            <img 
              src={`${API_URL}/${product.imageUrl}`} 
              alt={product.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.textContent = product.name.substring(0, 2);
              }}
            />
          </div>
          <div className="ranking-info">
            <div className="ranking-name">{product.name}</div>
            <div className="ranking-stats-row">
              <span className="ranking-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FCD34D" stroke="#FCD34D">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                {parseFloat(product.rating_average || 0).toFixed(1)}
              </span>
              <span className="ranking-stat">{(product.download_count || 0)} projects</span>
              <span className="ranking-stat">{Math.round(parseFloat(product.rating_average || 0) * 20)}% skill</span>
            </div>
          </div>
          <div className="ranking-price">¥{product.price.toLocaleString()}</div>
        </Link>
      ))}
    </div>
  );
};

export default RankingSection;
