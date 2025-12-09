import React from 'react';
import { API_URL } from '../../../config/constants';
import { useTranslation } from 'react-i18next';

export default function DeveloperCard({ developer, isSelected, isFull, onAdd, onRemove }) {
  const { t } = useTranslation();
  return (
    <div 
      className={`developer-card ${isSelected ? 'developer-card-selected' : ''}`}
    >
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
          <div className="stat-value">{developer.stats.technical}</div>
          <div className="stat-label">{t('developerCard.tech')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{developer.stats.creativity}</div>
          <div className="stat-label">{t('developerCard.creative')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{developer.stats.reliability}</div>
          <div className="stat-label">{t('developerCard.reliable')}</div>
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