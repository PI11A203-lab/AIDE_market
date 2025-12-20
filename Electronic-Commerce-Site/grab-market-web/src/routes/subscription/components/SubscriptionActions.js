import React from 'react';
import { useHistory } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

export default function SubscriptionActions({ subscription }) {
  const history = useHistory();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 카드 정보 변경 */}
      <button
        onClick={() => history.push('/profile/settings')}
        className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
      >
        <CreditCard className="w-5 h-5 text-gray-600" />
        <span className="font-semibold text-gray-900">카드 정보 변경</span>
      </button>
    </div>
  );
}

