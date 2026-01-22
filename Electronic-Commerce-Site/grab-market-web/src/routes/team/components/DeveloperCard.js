import React from 'react';
import { API_URL } from '../../../config/constants';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

export default function DeveloperCard({ developer, isSelected, isFull, onAdd, onRemove, onDeleteFromFavorites }) {
  const { t } = useTranslation();
  return (
    <div 
      className={`developer-card ${isSelected ? 'developer-card-selected' : ''}`}
      style={{ position: 'relative' }}
    >
      {/* 찜목록에서 삭제 버튼 */}
      {onDeleteFromFavorites && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteFromFavorites(developer.id);
          }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'none',
            border: 'none',
            color: '#6B7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s',
            padding: '4px'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#6B7280';
          }}
          title={t('developerCard.removeFromFavorites') || '찜목록에서 삭제'}
        >
          <X size={18} />
        </button>
      )}
      
      <div className="developer-card-header">
        <div className="developer-card-info">
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
            <h4 className="developer-name">{developer.name}</h4>
            <span className="developer-category">{developer.category}</span>
          </div>
        </div>
      </div>
      
      {/* 미니 스탯 */}
      <div className="developer-stats-mini">
        <div className="stat-item">
          <div className="stat-value">{developer.stats?.teamwork || 50}</div>
          <div className="stat-label">{t('developerCard.teamwork') || 'Teamwork'}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{developer.stats?.creativity || 50}</div>
          <div className="stat-label">{t('developerCard.creative') || 'Creativity'}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{developer.stats?.productivity || 50}</div>
          <div className="stat-label">{t('developerCard.productivity') || 'Productivity'}</div>
        </div>
      </div>
      
      <div className="developer-card-footer">
        <span className="developer-price">¥{developer.price.toLocaleString()}</span>
        {isSelected ? (
          <button
            onClick={() => onRemove(developer.id)}
            className="btn-remove"
          >
            {t('developerCard.remove')}
          </button>
        ) : (
          <button
            onClick={() => onAdd(developer)}
            disabled={isFull}
            className="btn-add"
          >
            {t('developerCard.add')}
          </button>
        )}
      </div>
    </div>
  );
}