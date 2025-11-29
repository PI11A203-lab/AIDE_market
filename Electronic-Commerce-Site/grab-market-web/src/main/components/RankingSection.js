import React from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp } from 'lucide-react';
import { API_URL } from '../../config/constants';
import { getFilledStars } from '../../utils/ratingCache';

const RankingSection = ({ topProducts }) => {
  if (topProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">今月のトップランク開発者</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topProducts.map((product) => (
          <Link 
            key={product.id} 
            to={`/products/${product.id}`}
            className="relative bg-white rounded-2xl border-2 border-yellow-400 p-6 transition-all hover:shadow-xl hover:-translate-y-1 no-underline"
          >
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              #{product.rank}
            </div>

            {/* 실제 이미지 사용 */}
            <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 overflow-hidden">
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

            <h4 className="text-xl font-bold text-center mb-3">{product.name}</h4>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => {
                  const rating = parseFloat(product.rating_average || 0);
                  const filledStars = getFilledStars(rating);
                  return (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < filledStars 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  );
                })}
                <span className="font-semibold text-gray-900 ml-1">
                  {parseFloat(product.rating_average || 0).toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                ({(product.rating_count || 0).toLocaleString()} reviews)
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">AI/ML</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">Expert</span>
            </div>

            <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{(product.download_count || 0).toLocaleString()}</span>
              </div>
              <div>
                <span>Skill {Math.round(parseFloat(product.rating_average || 0) * 20)}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-2xl font-bold text-blue-600">¥{product.price.toLocaleString()}</span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                View Profile
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RankingSection;
