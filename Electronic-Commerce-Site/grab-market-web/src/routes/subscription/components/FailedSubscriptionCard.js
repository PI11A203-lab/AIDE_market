import React from 'react';
import { useHistory } from 'react-router-dom';
import { Clock, AlertCircle, CreditCard, Package, RotateCcw } from 'lucide-react';
import { formatDate, formatCurrency, calculateDaysUntil } from '../utils/formatters';

export default function FailedSubscriptionCard({ 
  subscription, 
  onRetryPayment,
  retryingPayment 
}) {
  const history = useHistory();
  const graceDaysRemaining = subscription.grace_period_end_date 
    ? calculateDaysUntil(subscription.grace_period_end_date)
    : 0;
  const isGracePeriodActive = graceDaysRemaining > 0;
  const subscriptionTotal = subscription.items?.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) || 0;

  return (
    <div className="bg-white border-2 border-red-200 rounded-2xl p-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              구독 #{subscription.subscription_id}
            </h3>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              결제 실패
            </span>
          </div>
          <p className="text-sm text-gray-600">
            마지막 결제 시도: {subscription.last_payment_date ? formatDate(subscription.last_payment_date, subscription.user_language) : '-'}
          </p>
        </div>
      </div>

      {/* 유예 기간 알림 */}
      {isGracePeriodActive && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-900">
                유예 기간: {graceDaysRemaining}일 남음
              </p>
              <p className="text-sm text-yellow-700">
                유예 기간 종료: {formatDate(subscription.grace_period_end_date, subscription.user_language)}
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                기간 내 재결제하지 않으면 활성화 코드가 정지됩니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isGracePeriodActive && subscription.grace_period_end_date && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">
                유예 기간이 만료되었습니다
              </p>
              <p className="text-sm text-red-700 mt-1">
                활성화 코드가 정지되었을 수 있습니다. 즉시 재결제해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 결제 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">결제 금액</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(subscriptionTotal)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">결제 수단</p>
            <p className="font-semibold text-gray-900">
              {subscription.creditCard?.card_company || '정보 없음'}
            </p>
            <p className="text-sm text-gray-500">
              {subscription.creditCard?.exp_month && subscription.creditCard?.exp_year
                ? `만료: ${subscription.creditCard.exp_month}/${subscription.creditCard.exp_year}`
                : ''}
            </p>
          </div>
        </div>
      </div>

      {/* 실패 사유 */}
      {subscription.last_payment_status === 'failed' && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-1">실패 사유</p>
          <p className="text-sm text-gray-600">
            {subscription.failure_reason || '카드 정보 오류 또는 잔액 부족으로 인한 결제 실패'}
          </p>
        </div>
      )}

      {/* 구독 상품 목록 */}
      {subscription.items && subscription.items.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Package className="w-4 h-4" />
            구독 상품
          </p>
          <div className="space-y-2">
            {subscription.items.map((item) => (
              <div key={item.subscription_item_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{item.product?.name || '상품명 없음'}</p>
                  <p className="text-sm text-gray-600">수량: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(item.unit_price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => history.push('/profile/settings')}
          className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold"
        >
          카드 정보 변경
        </button>
        <button
          onClick={() => onRetryPayment(subscription.subscription_id)}
          disabled={retryingPayment === subscription.subscription_id}
          className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {retryingPayment === subscription.subscription_id ? (
            <>재결제 중...</>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              재결제하기
            </>
          )}
        </button>
      </div>
    </div>
  );
}

