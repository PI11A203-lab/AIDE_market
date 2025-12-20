import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { formatDate, calculateDaysUntil } from '../utils/formatters';

export default function GracePeriodAlert({ subscription, onRetryPayment }) {
  if (!subscription.grace_period_end_date) return null;

  const graceDaysRemaining = calculateDaysUntil(subscription.grace_period_end_date);
  const isGracePeriodActive = graceDaysRemaining > 0;

  if (!isGracePeriodActive && subscription.status === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-2">결제 실패 - 유예 기간 만료</h3>
            <p className="text-red-700 mb-2">
              유예 기간이 만료되었습니다. 활성화 코드가 정지되었을 수 있습니다. 즉시 재결제해주세요.
            </p>
            {onRetryPayment && (
              <button
                onClick={() => onRetryPayment(subscription.subscription_id)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                재결제하기
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isGracePeriodActive && subscription.status === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <Clock className="w-6 h-6 text-red-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-2">결제 실패 - 유예 기간</h3>
            <p className="text-red-700 mb-2">
              결제가 실패했습니다. {graceDaysRemaining}일 후까지 재결제하지 않으면 활성화 코드가 정지됩니다.
            </p>
            <p className="text-sm text-red-600">
              유예 기간 종료: {formatDate(subscription.grace_period_end_date, subscription.user_language)}
            </p>
            {onRetryPayment && (
              <button
                onClick={() => onRetryPayment(subscription.subscription_id)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                재결제하기
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

