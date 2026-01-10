import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { api } from '../../../config/api';
import { AlertCircle } from 'lucide-react';
import FailedSubscriptionCard from '../components/FailedSubscriptionCard';
import './index.css';

export default function PaymentFailed() {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [failedSubscriptions, setFailedSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryingPayment, setRetryingPayment] = useState(null);

  // localStorage에서 언어 설정 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadFailedSubscriptions = async () => {
      try {
        const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userFromStorage) {
          message.warning(t('subscription.paymentFailed.loginRequired'));
          history.push('/login');
          return;
        }

        const userData = JSON.parse(userFromStorage);

        // 모든 구독 조회 후 실패한 것만 필터링
        const response = await api.subscriptions.getByUser(userData.id);
        const allSubscriptions = response.data.subscriptions || [];
        const failed = allSubscriptions.filter(s => s.status === 'failed');
        setFailedSubscriptions(failed);
      } catch (error) {
        console.error('구독 목록 조회 실패:', error);
        message.error(t('subscription.paymentFailed.loadFail'));
      } finally {
        setLoading(false);
      }
    };

    loadFailedSubscriptions();
  }, [history, t]);

  const handleRetryPayment = async (subscriptionId) => {
    Modal.confirm({
      title: t('subscription.paymentFailed.retryConfirmTitle'),
      content: t('subscription.paymentFailed.retryConfirmContent'),
      okText: t('subscription.paymentFailed.retryButton'),
      cancelText: t('subscription.paymentFailed.retryCancel'),
      onOk: async () => {
        setRetryingPayment(subscriptionId);
        try {
          // 재결제는 백엔드의 processMonthlyPayment를 직접 호출하는 것이 아니라
          // subscriptionService의 특정 함수를 호출해야 함
          // 일단 주문 생성 페이지로 이동하도록 처리
          // TODO: 백엔드에 재결제 API 추가 필요
          message.info(t('subscription.paymentFailed.retryInfo'));
          
          // 임시로 구독 관리 페이지로 이동
          history.push('/subscription/manage');
        } catch (error) {
          console.error('재결제 실패:', error);
          const errorMessage = error.response?.data?.error || t('subscription.paymentFailed.retryFail');
          message.error(errorMessage);
        } finally {
          setRetryingPayment(null);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  if (failedSubscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-5 md:px-12 py-10">
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('subscription.paymentFailed.emptyTitle')}</h2>
            <p className="text-gray-600 mb-6">
              {t('subscription.paymentFailed.emptyDescription')}
            </p>
            <button
              onClick={() => history.push('/subscription/manage')}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
            >
              {t('subscription.paymentFailed.goToManage')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-5 md:px-12 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <AlertCircle className="w-10 h-10 text-red-600" />
            {t('subscription.paymentFailed.title')}
          </h1>
          <p className="text-base text-gray-600">
            {t('subscription.paymentFailed.subtitle')}
          </p>
        </div>

        {/* 전체 알림 */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">{t('subscription.paymentFailed.alertTitle')}</h3>
              <p className="text-red-700 mb-2">
                {t('subscription.paymentFailed.alertDescription', { count: failedSubscriptions.length })}
              </p>
              <p className="text-sm text-red-600">
                {t('subscription.paymentFailed.alertNote')}
              </p>
            </div>
          </div>
        </div>

        {/* 실패한 구독 목록 */}
        <div className="space-y-6">
          {failedSubscriptions.map((subscription) => (
            <FailedSubscriptionCard
              key={subscription.subscription_id}
              subscription={subscription}
              onRetryPayment={handleRetryPayment}
              retryingPayment={retryingPayment}
            />
          ))}
        </div>

        {/* 안내 섹션 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {t('subscription.paymentFailed.importantTitle')}
          </h3>
          <ul className="space-y-2 text-blue-800">
            {t('subscription.paymentFailed.importantItems', { returnObjects: true }).map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* 뒤로 가기 버튼 */}
        <div className="mt-6">
          <button
            onClick={() => history.push('/subscription/manage')}
            className="px-6 py-2 text-gray-600 hover:text-gray-900"
          >
            {t('subscription.paymentFailed.backToManage')}
          </button>
        </div>
      </div>
    </div>
  );
}
