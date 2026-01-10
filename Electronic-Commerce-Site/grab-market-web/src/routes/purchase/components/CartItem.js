import React from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../../config/constants';

export default function CartItem({ item, onRemove }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-all hover:border-gray-300 hover:shadow-md">
      <div className="flex items-center gap-5">
        {/* 상품 이미지 또는 아바타 */}
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden ${item.imageUrl ? 'bg-[#f3f4f6]' : 'bg-gradient-to-br from-gray-800 to-gray-600'}`}>
          {item.imageUrl ? (
            <img 
              src={`${API_URL}/${item.imageUrl}`} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-3xl font-bold">{item.avatar}</span>
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{item.category}</p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="btn-icon btn-delete"
              title={t('purchase.cartItem.remove')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ¥{item.price.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
