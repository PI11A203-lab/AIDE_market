import React from 'react';
import { Calendar, CreditCard, CheckCircle2 } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/formatters';

export default function PaymentInfoCard({ subscription }) {
  if (!subscription) return null;

  const subscriptionTotal = subscription.items?.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">결제 정보</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 다음 결제일 */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">다음 결제일</p>
            <p className="text-xl font-bold text-gray-900">
              {formatDate(subscription.next_payment_date, subscription.user_language)}
            </p>
          </div>
        </div>

        {/* 결제 금액 */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">결제 금액</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(subscriptionTotal)}
            </p>
            {subscription.coupon && (
              <p className="text-sm text-green-600 mt-1">
                쿠폰 적용됨
              </p>
            )}
          </div>
        </div>

        {/* 결제 수단 */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">결제 수단</p>
            <p className="text-lg font-semibold text-gray-900">
              {subscription.creditCard?.card_company || '카드 정보 없음'}
            </p>
            <p className="text-sm text-gray-500">
              {subscription.creditCard?.exp_month && subscription.creditCard?.exp_year
                ? `만료: ${subscription.creditCard.exp_month}/${subscription.creditCard.exp_year}`
                : ''}
            </p>
          </div>
        </div>

        {/* 마지막 결제일 */}
        {subscription.last_payment_date && (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">마지막 결제일</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(subscription.last_payment_date, subscription.user_language)}
              </p>
              {subscription.last_payment_status && (
                <p className={`text-sm mt-1 ${
                  subscription.last_payment_status === 'success' ? 'text-green-600' :
                  subscription.last_payment_status === 'failed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {subscription.last_payment_status === 'success' ? '결제 완료' :
                   subscription.last_payment_status === 'failed' ? '결제 실패' : '대기 중'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

