import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PriceSidebar({ developer, onBuyNow, onAddToCart, isPurchased }) {
  const { t, i18n } = useTranslation();
  
  // 날짜를 언어에 맞게 포맷팅하는 함수
  const formatJoinedDate = (dateString) => {
    if (!dateString) return '';
    
    // 이미 포맷된 문자열인 경우 (예: "November 2025")
    if (typeof dateString === 'string' && !dateString.includes('-') && !dateString.includes('/')) {
      // 날짜 파싱 시도
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // 파싱 실패 시 원본 반환
        return dateString;
      }
      
      const localeMap = {
        'ko': 'ko-KR',
        'ja': 'ja-JP',
        'en': 'en-US'
      };
      
      const locale = localeMap[i18n.language] || 'en-US';
      
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long'
      });
    }
    
    // ISO 형식이나 다른 형식인 경우
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const localeMap = {
      'ko': 'ko-KR',
      'ja': 'ja-JP',
      'en': 'en-US'
    };
    
    const locale = localeMap[i18n.language] || 'en-US';
    
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long'
    });
  };
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 relative ${isPurchased ? 'opacity-60' : ''}`}>
      {isPurchased && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-1.5 rounded-full text-[13px] font-semibold z-10">
          {t('product.price.purchased')}
        </div>
      )}
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">{t('product.price.label')}</div>
        <div className="text-[42px] font-bold text-gray-900 mb-6">
          ¥{developer.price.toLocaleString()}
        </div>
      </div>
      <button 
        onClick={onBuyNow}
        disabled={isPurchased}
        className={`w-full py-3.5 rounded-lg text-base font-semibold transition mb-3 ${
          isPurchased
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-900'
        }`}
      >
        {t('product.price.buyNow')}
      </button>
      
      <button 
        onClick={onAddToCart}
        disabled={isPurchased}
        className={`w-full py-3.5 border rounded-lg text-base font-semibold transition ${
          isPurchased
            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
        }`}
      >
        {t('product.price.addToCart')}
      </button>
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{t('product.price.location')}: {developer.location}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{t('product.price.joined', { date: formatJoinedDate(developer.joined) })}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{t('product.price.respondsIn', { time: developer.responseTime })}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="7"/>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
          </svg>
          <span>{t('product.price.topDeveloper')}</span>
        </div>
      </div>
    </div>
  );
}

