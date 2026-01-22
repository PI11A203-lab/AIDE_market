import React from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, message } from 'antd';
import { Calendar, CreditCard, Package, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../config/api';
import SubscriptionStatusBadge from './SubscriptionStatusBadge';
import { formatDate, formatCurrency } from '../utils/formatters';

export default function SubscriptionCard({ 
  subscription, 
  onUpdate 
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const handleCancelSubscription = async () => {
    Modal.confirm({
      title: '구독 취소 확인',
      content: '정말 이 구독을 취소하시겠습니까? 취소 후에도 현재 결제된 기간까지는 사용할 수 있습니다.',
      okText: '취소하기',
      cancelText: '닫기',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.subscriptions.cancel(subscription.subscription_id);
          message.success(t('notifications.subscription.cancelled'));
          if (onUpdate) onUpdate();
        } catch (error) {
          console.error('구독 취소 실패:', error);
          const errorMessage = error.response?.data?.error || t('notifications.subscription.cancelFail');
          message.error(errorMessage);
        }
      }
    });
  };

  const handleViewDetails = async () => {
    try {
      const response = await api.subscriptions.getById(subscription.subscription_id);
      const subscriptionDetail = response.data.subscription;
      
      if (subscriptionDetail.reminder_token) {
        history.push(`/subscription/reminder/${subscriptionDetail.reminder_token}`);
      } else {
        message.info(t('notifications.subscription.emailLinkInfo'));
      }
    } catch (error) {
      console.error('구독 정보 조회 실패:', error);
      message.error(t('notifications.subscription.loadFail'));
    }
  };

  const subscriptionTotal = subscription.items?.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) || 0;

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 ${subscription.status !== 'active' ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              구독 #{subscription.subscription_id}
            </h3>
            <SubscriptionStatusBadge status={subscription.status} />
          </div>
          <p className="text-sm text-gray-600">
            생성일: {formatDate(subscription.created_at, subscription.user_language)}
          </p>
          {subscription.status === 'cancelled' && subscription.updated_at && (
            <p className="text-sm text-gray-600">
              취소일: {formatDate(subscription.updated_at, subscription.user_language)}
            </p>
          )}
        </div>
        {subscription.status === 'active' && (
          <button
            onClick={handleCancelSubscription}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>구독 취소</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">다음 결제일</p>
            <p className="font-semibold text-gray-900">
              {formatDate(subscription.next_payment_date, subscription.user_language)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">결제 금액</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(subscriptionTotal)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-sm text-gray-600">결제 수단</p>
            <p className="font-semibold text-gray-900">
              {subscription.creditCard?.card_company || '정보 없음'}
            </p>
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      {subscription.items && subscription.items.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Package className="w-4 h-4" />
            구독 상품:
          </p>
          <div className="flex flex-wrap gap-2">
            {subscription.items.map((item) => (
              <span
                key={item.subscription_item_id}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
              >
                {item.product?.name || '상품명 없음'} (x{item.quantity})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      {subscription.status === 'active' && (
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => history.push('/profile/settings')}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition"
          >
            결제 수단 변경
          </button>
          <button
            onClick={handleViewDetails}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            상세 정보
          </button>
        </div>
      )}
    </div>
  );
}

