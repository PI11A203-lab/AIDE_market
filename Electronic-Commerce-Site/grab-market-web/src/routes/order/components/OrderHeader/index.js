import React from 'react';
import { useHistory } from 'react-router-dom';
import './index.css';
import { useTranslation } from 'react-i18next';

export default function OrderHeader({ order }) {
  const history = useHistory();
  const { t, i18n } = useTranslation();

  const formattedDate = new Date(order.purchased_at || order.createdAt).toLocaleDateString(
    i18n.language === 'ko' ? 'ko-KR' : i18n.language === 'ja' ? 'ja-JP' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="page-header">
        <div className="page-header-top">
          <h1 className="page-title">{t('order.title')}</h1>
          <button 
            onClick={() => history.push('/profile')}
            className="btn-back-to-profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {t('order.backToProfile')}
          </button>
        </div>
        <div className="order-meta">
          <span className="order-number">{t('order.badge', { number: order.order_number || `ORD-${order.id}` })}</span>
          <span className="order-date">
            {formattedDate}
          </span>
        </div>
      </div>
    </>
  );
}

