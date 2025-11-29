import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, Heart } from 'lucide-react';
import { API_URL } from '../../config/constants';
import { api } from '../../config/api';
import { message } from 'antd';
import { getFilledStars } from '../../utils/ratingCache';

const ProductList = ({ products }) => {
  const [favorites, setFavorites] = useState(new Set());
  const [user, setUser] = useState(null);

  // 사용자 정보 가져오기
  useEffect(() => {
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        setUser(userData);
        // 사용자의 찜목록 가져오기
        loadFavorites(userData.id);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  // 찜목록 로드
  const loadFavorites = async (userId) => {
    try {
      const response = await api.favorites.getByUser(userId);
      const favoritesList = response.data?.favorites || [];
      const favoriteIds = new Set(favoritesList.map(fav => fav.product_id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  // 찜목록 토글
  const toggleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      message.warning('로그인이 필요합니다.');
      return;
    }

    try {
      const isFavorite = favorites.has(productId);
      
      if (isFavorite) {
        // 찜목록에서 제거
        await api.favorites.delete(user.id, productId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        message.success('찜목록에서 제거되었습니다.');
      } else {
        // 찜목록에 추가
        await api.favorites.create({
          user_id: user.id,
          product_id: productId,
        });
        setFavorites(prev => new Set(prev).add(productId));
        message.success('찜목록에 추가되었습니다.');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      message.error('찜목록 업데이트에 실패했습니다.');
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">All AI Developers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const isFavorite = favorites.has(product.id);
          
          return (
            <Link 
              key={product.id} 
              to={`/products/${product.id}`}
              className={`relative bg-white rounded-2xl border border-gray-200 p-6 transition-all hover:shadow-lg hover:-translate-y-1 no-underline ${
                product.soldout === 1 ? 'opacity-50' : ''
              }`}
            >
              {product.soldout === 1 && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-2xl backdrop-blur-sm z-10" />
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                  <img
                    src={`${API_URL}/${product.imageUrl}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.textContent = product.name.substring(0, 2);
                    }}
                  />
                </div>
                <button 
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorite 
                      ? 'bg-red-50 text-red-500' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
                  }`}
                  onClick={(e) => toggleFavorite(e, product.id)}
                  title={isFavorite ? '찜목록에서 제거' : '찜목록에 추가'}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h4 className="text-lg font-bold text-gray-900 mb-3">{product.name}</h4>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => {
                    const rating = parseFloat(product.rating_average || 0);
                    const filledStars = getFilledStars(rating);
                    return (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < filledStars 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="font-semibold text-gray-900">
                  {parseFloat(product.rating_average || 0).toFixed(1)}
                </span>
                <span className="text-sm text-gray-600">
                  ({(product.rating_count || 0).toLocaleString()})
                </span>
              </div>

              <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{(product.download_count || 0).toLocaleString()}</span>
                </div>
                <span className="font-medium">
                  Skill {Math.round(parseFloat(product.rating_average || 0) * 20)}%
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xl font-bold text-blue-600">¥{product.price.toLocaleString()}</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  View
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
