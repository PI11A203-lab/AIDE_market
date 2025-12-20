import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { message, Modal } from 'antd';
import { api } from '../../../config/api';
import { AlertCircle } from 'lucide-react';
import FailedSubscriptionCard from '../components/FailedSubscriptionCard';
import './index.css';

export default function PaymentFailed() {
  const history = useHistory();
  const [failedSubscriptions, setFailedSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryingPayment, setRetryingPayment] = useState(null);

  useEffect(() => {
    const loadFailedSubscriptions = async () => {
      try {
        const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userFromStorage) {
          message.warning('로그인이 필요합니다.');
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
        message.error('구독 목록을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadFailedSubscriptions();
  }, [history]);

  const handleRetryPayment = async (subscriptionId) => {
    Modal.confirm({
      title: '재결제 확인',
      content: '등록된 결제 수단으로 즉시 재결제를 시도하시겠습니까?',
      okText: '재결제하기',
      cancelText: '취소',
      onOk: async () => {
        setRetryingPayment(subscriptionId);
        try {
          // 재결제는 백엔드의 processMonthlyPayment를 직접 호출하는 것이 아니라
          // subscriptionService의 특정 함수를 호출해야 함
          // 일단 주문 생성 페이지로 이동하도록 처리
          // TODO: 백엔드에 재결제 API 추가 필요
          message.info('재결제 기능은 준비 중입니다. 고객센터로 문의해주세요.');
          
          // 임시로 구독 관리 페이지로 이동
          history.push('/subscription/manage');
        } catch (error) {
          console.error('재결제 실패:', error);
          const errorMessage = error.response?.data?.error || '재결제에 실패했습니다.';
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
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (failedSubscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-5 md:px-12 py-10">
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 실패한 구독이 없습니다</h2>
            <p className="text-gray-600 mb-6">
              모든 구독이 정상적으로 결제되고 있습니다.
            </p>
            <button
              onClick={() => history.push('/subscription/manage')}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
            >
              구독 관리로 이동
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
            결제 실패 관리
          </h1>
          <p className="text-base text-gray-600">
            결제가 실패한 구독을 확인하고 재결제해주세요
          </p>
        </div>

        {/* 전체 알림 */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">결제 실패 안내</h3>
              <p className="text-red-700 mb-2">
                {failedSubscriptions.length}개의 구독 결제가 실패했습니다. 유예 기간 내에 재결제하지 않으면 활성화 코드가 정지됩니다.
              </p>
              <p className="text-sm text-red-600">
                유예 기간은 결제 실패 후 3일입니다. 기간 내 재결제를 완료해주세요.
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
            중요 안내
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• 결제 실패 후 3일의 유예 기간이 제공됩니다.</li>
            <li>• 유예 기간 내 재결제하지 않으면 활성화 코드가 정지됩니다.</li>
            <li>• 정지된 활성화 코드는 재결제 후 자동으로 복구됩니다.</li>
            <li>• 결제 수단을 변경하려면 프로필 설정에서 카드를 등록하세요.</li>
            <li>• 문제가 계속되면 고객센터로 문의해주세요.</li>
          </ul>
        </div>

        {/* 뒤로 가기 버튼 */}
        <div className="mt-6">
          <button
            onClick={() => history.push('/subscription/manage')}
            className="px-6 py-2 text-gray-600 hover:text-gray-900"
          >
            ← 구독 관리로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
