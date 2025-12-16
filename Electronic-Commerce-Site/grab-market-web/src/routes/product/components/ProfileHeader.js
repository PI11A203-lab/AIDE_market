import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import { API_URL } from '../../../config/constants';
import { getFilledStars } from '../../../utils/ratingCache';

export default function ProfileHeader({ developer, isLiked, onLikeToggle, onShare }) {
  // 별점을 숫자로 변환
  const rating = parseFloat(developer.rating) || 0;
  const filledStars = getFilledStars(rating);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6">
      <div className="flex items-start gap-6 mb-6">
        {/* 아바타 - 120px */}
        <div className="w-[120px] h-[120px] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
          {developer.imageUrl ? (
            <img 
              src={`${API_URL}/${developer.imageUrl}`} 
              alt={developer.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                if (parent) {
                  parent.textContent = developer.name.substring(0, 2);
                  parent.className = 'w-[120px] h-[120px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-900 text-5xl font-bold flex-shrink-0';
                }
              }}
            />
          ) : (
            <span className="text-gray-900 text-5xl font-bold">
              {developer.name.substring(0, 2)}
            </span>
          )}
        </div>
        {/* 기본 정보 */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[32px] font-bold text-gray-900 mb-1.5">{developer.name}</h2>
              <p className="text-base text-gray-500">@{developer.username}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={onLikeToggle}
                className={`w-11 h-11 border border-gray-200 rounded-lg flex items-center justify-center transition-all ${
                  isLiked 
                    ? 'bg-red-50 border-red-600 text-red-600' 
                    : 'bg-white hover:border-gray-900 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={onShare}
                className="w-11 h-11 border border-gray-200 rounded-lg flex items-center justify-center bg-white hover:border-gray-900 hover:bg-gray-50 transition-all"
                title="공유"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* 평점 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  className={`w-5 h-5 ${
                    i < filledStars 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-200 fill-gray-200'
                  }`}
                  viewBox="0 0 24 24"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <span className="text-lg font-bold text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-[15px] text-gray-500">({developer.reviewCount} reviews)</span>
          </div>
          {/* 태그 - 해시태그 스타일 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {developer.tags.map((tag, idx) => (
              <span key={idx} className="px-3.5 py-1.5 bg-gray-100 text-gray-900 rounded-md text-sm font-medium">
                <span className="text-gray-500">#</span>{tag}
              </span>
            ))}
          </div>
          <p className="text-[15px] text-gray-600 leading-[1.7]">{developer.bio}</p>
        </div>
      </div>
      {/* 통계 - 4단 그리드 */}
      <div className="grid grid-cols-4 gap-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-[28px] font-bold text-gray-900 mb-1">{developer.downloads}</div>
          <div className="text-[13px] text-gray-500">Total Hires</div>
        </div>
        <div className="text-center">
          <div className="text-[28px] font-bold text-gray-900 mb-1">{developer.completionRate}</div>
          <div className="text-[13px] text-gray-500">Completion Rate</div>
        </div>
        <div className="text-center">
          <div className="text-[28px] font-bold text-gray-900 mb-1">{developer.responseTime}</div>
          <div className="text-[13px] text-gray-500">Response Time</div>
        </div>
        <div className="text-center">
          <div className="text-[28px] font-bold text-gray-900 mb-1">{developer.skill}%</div>
          <div className="text-[13px] text-gray-500">Skill Level</div>
        </div>
      </div>
    </div>
  );
}