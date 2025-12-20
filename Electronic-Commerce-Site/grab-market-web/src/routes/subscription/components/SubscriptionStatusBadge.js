import React from 'react';

export default function SubscriptionStatusBadge({ status }) {
  const statusConfig = {
    'active': { label: '활성', className: 'bg-green-100 text-green-800' },
    'failed': { label: '결제 실패', className: 'bg-red-100 text-red-800' },
    'paused': { label: '일시정지', className: 'bg-yellow-100 text-yellow-800' },
    'cancelled': { label: '취소됨', className: 'bg-gray-100 text-gray-800' }
  };
  
  const config = statusConfig[status] || statusConfig['cancelled'];
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}

