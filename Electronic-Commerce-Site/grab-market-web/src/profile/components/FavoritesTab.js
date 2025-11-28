import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { API_URL } from '../../config/constants';
import { api } from '../../config/api';
import { message } from 'antd';

export default function FavoritesTab({ favorites, userId, onRemove }) {
  const handleRemove = async (e, favoriteId, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await api.favorites.delete(userId, productId);
      message.success('찜목록에서 제거되었습니다.');
      if (onRemove) {
        onRemove(favoriteId);
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      message.error('찜목록에서 제거하는데 실패했습니다.');
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16 px-8">
        <p className="text-lg text-gray-600 mb-4">찜목록이 비어있습니다.</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          상품 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {favorites.map((fav) => (
        <Link 
          key={fav.id || fav.favorite_id} 
          to={`/products/${fav.product_id || fav.id}`}
          className="bg-white border border-gray-200 rounded-2xl p-6 text-center transition-all hover:shadow-lg hover:border-red-300 no-underline"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            {fav.product?.imageUrl ? (
              <img 
                src={`${API_URL}/${fav.product.imageUrl}`}
                alt={fav.product.name}
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.textContent = (fav.product?.name || 'AI').substring(0, 2);
                }}
              />
            ) : (
              (fav.product?.name || fav.name || 'AI').substring(0, 2)
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{fav.product?.name || fav.name}</h3>
          <p className="text-gray-600 mb-3">{fav.product?.category_name || fav.category || 'NLP'}</p>
          <div className="flex items-center justify-center gap-1 mb-4">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-gray-700 font-semibold">
              {parseFloat(fav.product?.rating_average || fav.rating || 0).toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              ¥{(fav.product?.price || fav.price || 0).toLocaleString()}
            </span>
            <button 
              className="p-2 bg-transparent border-none cursor-pointer rounded-lg transition-colors hover:bg-red-50"
              onClick={(e) => {
                const favoriteId = fav.id || fav.favorite_id;
                const productId = fav.product_id;
                if (!productId) {
                  message.error('상품 정보를 찾을 수 없습니다.');
                  return;
                }
                handleRemove(e, favoriteId, productId);
              }}
            >
              <Heart className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}
