import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { API_URL } from '../../../config/constants';
import { api } from '../../../config/api';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

export default function FavoritesTab({ favorites, userId, onRemove }) {
  const { t } = useTranslation();
  const handleRemove = async (e, favoriteId, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await api.favorites.delete(userId, productId);
      message.success(t('profile.favorites.removeSuccess'));
      if (onRemove) {
        onRemove(favoriteId);
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      message.error(t('profile.favorites.removeFail'));
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">{t('profile.favorites.empty')}</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-grid">
        {favorites.map((fav) => (
          <Link 
            key={fav.id || fav.favorite_id} 
            to={`/products/${fav.product_id || fav.id}`}
            className="favorite-card"
          >
            <div className="favorite-avatar">
              {fav.product?.imageUrl ? (
                <img 
                  src={`${API_URL}/${fav.product.imageUrl}`}
                  alt={fav.product.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.textContent = (fav.product?.name || 'AI').substring(0, 2);
                  }}
                />
              ) : (
                (fav.product?.name || fav.name || 'AI').substring(0, 2)
              )}
            </div>
            <h3 className="favorite-name">{fav.product?.name || fav.name}</h3>
            <p className="favorite-category">{fav.product?.category_name || fav.category || 'NLP'}</p>
            <div className="favorite-rating">
              <svg className="star filled" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span className="favorite-rating-value">
                {parseFloat(fav.product?.rating_average || fav.rating || 0).toFixed(1)}
              </span>
            </div>
            <div className="favorite-footer">
              <span className="favorite-price">
                ¥{(fav.product?.price || fav.price || 0).toLocaleString()}
              </span>
              <button 
                className="btn-favorite-remove"
                onClick={(e) => {
                  const favoriteId = fav.id || fav.favorite_id;
                  const productId = fav.product_id;
                  if (!productId) {
                  message.error(t('profile.favorites.noProduct'));
                    return;
                  }
                  handleRemove(e, favoriteId, productId);
                }}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
