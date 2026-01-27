import React from 'react';
import { API_URL } from '../../../config/constants';
import { useTranslation } from 'react-i18next';
import { X, Check } from 'lucide-react';

export default function DeveloperCard({ developer, isSelected, isFull, onAdd, onRemove, onDeleteFromFavorites }) {
  const { t } = useTranslation();
  
  const handleCardClick = () => {
    if (!isSelected && !isFull) {
      onAdd(developer);
    }
  };

  return (
    <div 
      className={`developer-card ${isSelected ? 'developer-card-selected' : ''}`}
      onClick={handleCardClick}
      style={{ position: 'relative', cursor: isSelected ? 'default' : isFull ? 'not-allowed' : 'pointer' }}
    >
      {/* 찜목록에서 삭제 버튼 - 선택되지 않은 상태일 때만 표시 */}
      {!isSelected && onDeleteFromFavorites && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteFromFavorites(developer.id);
          }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            color: '#6B7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s',
            padding: '4px',
            width: '24px',
            height: '24px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#EF4444';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.color = '#6B7280';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title={t('developerCard.removeFromFavorites') || '찜목록에서 삭제'}
        >
          <X size={16} />
        </button>
      )}

      {/* 선택된 상태 표시 */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: '#3B82F6',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Check size={14} color="white" />
        </div>
      )}
      
      <div className="developer-card-content">
        {/* 실제 이미지 표시 */}
        <div className="developer-avatar">
          {developer.imageUrl ? (
            <img
              src={`${API_URL}/${developer.imageUrl}`}
              alt={developer.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.textContent = developer.name.substring(0, 2);
              }}
            />
          ) : (
            developer.name.substring(0, 2)
          )}
        </div>
        <div className="developer-details">
          <div className="developer-name">{developer.name}</div>
          <div className="developer-category">{developer.category}</div>
        </div>
        <div className="developer-price">¥{developer.price.toLocaleString()}</div>
      </div>
    </div>
  );
}