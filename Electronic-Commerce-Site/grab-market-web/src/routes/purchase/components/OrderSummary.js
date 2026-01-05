import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle2 } from 'lucide-react';

// 다음 결제일 계산 (한 달 후 말일)
const getNextPaymentDate = () => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // 다음 달 말일
  return nextMonth;
};

const formatNextPaymentDate = (date, locale) => {
  const localeMap = {
    'ko': 'ko-KR',
    'en': 'en-US',
    'ja': 'ja-JP'
  };
  const dateLocale = localeMap[locale] || 'en-US';
  
  return date.toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function OrderSummary({ 
  cartItems, 
  subtotal, 
  studentDiscount = 0,
  discount, 
  tax, 
  total, 
  appliedCoupon,
  isStudent = false,
  onCheckout,
  isProcessing,
  isSubscription: initialIsSubscription = true,
  onSubscriptionChange
}) {
  const { t, i18n } = useTranslation();
  const [isSubscription, setIsSubscription] = useState(initialIsSubscription); // 기본값: 정기결제 동의
  const nextPaymentDate = getNextPaymentDate();

  // isSubscription prop이 변경되면 상태 업데이트
  useEffect(() => {
    setIsSubscription(initialIsSubscription);
  }, [initialIsSubscription]);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('purchase.summary.title')}</h3>
      <div className="flex flex-col">
        {/* 원가 표시 */}
        <div className="flex justify-between py-3 text-[15px] text-gray-600">
          <span>{t('purchase.summary.subtotal', { count: cartItems.length })}</span>
          <span className={studentDiscount > 0 ? 'line-through text-gray-400' : ''}>
            ¥{subtotal.toLocaleString()}
          </span>
        </div>
        
        {/* 학생 할인 표시 */}
        {isStudent && studentDiscount > 0 && (
          <div className="flex justify-between py-3 text-[15px] text-blue-700">
            <span>학생 할인 (50%)</span>
            <span>-¥{studentDiscount.toLocaleString()}</span>
          </div>
        )}
        
        {/* 쿠폰 할인 표시 */}
        {appliedCoupon && discount > studentDiscount && (
          <div className="flex justify-between py-3 text-[15px] text-green-700">
            <span>{t('purchase.summary.discount', { label: appliedCoupon.label })}</span>
            <span>-¥{Math.round(discount - studentDiscount).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between py-3 text-[15px] text-gray-600">
          <span>{t('purchase.summary.tax')}</span>
          <span>¥{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between pt-4 mt-4 border-t border-gray-200 text-xl font-bold text-gray-900">
          <span>{t('purchase.summary.total')}</span>
          <span className={isStudent && studentDiscount > 0 ? 'text-blue-700' : ''}>
            ¥{Math.round(total).toLocaleString()}
          </span>
        </div>
      </div>

      {/* 정기결제 동의 섹션 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={isSubscription}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsSubscription(checked);
              if (onSubscriptionChange) {
                onSubscriptionChange(checked);
              }
            }}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
            disabled={isProcessing}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">
                {t('purchase.summary.subscription.agree')}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              {t('purchase.summary.subscription.description')}
            </p>
            {isSubscription && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">
                  {t('purchase.summary.subscription.nextPayment', { 
                    date: formatNextPaymentDate(nextPaymentDate, i18n.language)
                  })}
                </span>
              </div>
            )}
          </div>
        </label>
      </div>
      <button
        onClick={onCheckout}
        disabled={isProcessing}
        className="w-full mt-6 py-4 px-4 bg-black text-white border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 hover:bg-gray-900 hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
        {isProcessing ? t('purchase.summary.processing') : t('purchase.summary.checkout')}
        {!isProcessing && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        )}
      </button>
      <div className="flex items-center justify-center gap-1.5 mt-3 text-[13px] text-gray-500">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span>{t('purchase.summary.secure')}</span>
      </div>
    </div>
  );
}
