import React, { useState } from 'react';
import { SimpleLineChart } from './LineChart';
import { SimpleBarChart } from './BarChart';
import { salesLabels, salesDatasets, couponLabels, couponDatasets } from '../../routes/profile/admin/mock.data';

/**
 * 관리자 대시보드 그래프 카드
 * 월별 매출 / 쿠폰 사용량 탭 전환 지원
 */
export const DashboardChart = () => {
  const [activeChart, setActiveChart] = useState('sales'); // 'sales' | 'coupons'
  const [loading] = useState(false);

  return (
    <div style={{
      background: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      padding: '32px',
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#1A1A1A',
          margin: 0
        }}>
          Analytics
        </h3>
        
        {/* 탭 버튼 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveChart('sales')}
            style={{
              padding: '8px 16px',
              background: activeChart === 'sales' ? '#1A1A1A' : 'white',
              color: activeChart === 'sales' ? 'white' : '#6B7280',
              border: '1px solid #E5E7EB',
              borderColor: activeChart === 'sales' ? '#1A1A1A' : '#E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Monthly Sales
          </button>
          <button
            onClick={() => setActiveChart('coupons')}
            style={{
              padding: '8px 16px',
              background: activeChart === 'coupons' ? '#1A1A1A' : 'white',
              color: activeChart === 'coupons' ? 'white' : '#6B7280',
              border: '1px solid #E5E7EB',
              borderColor: activeChart === 'coupons' ? '#1A1A1A' : '#E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Coupon Usage
          </button>
        </div>
      </div>

      {/* 그래프 영역 */}
      <div>
        {activeChart === 'sales' ? (
          <SimpleLineChart
            labels={salesLabels}
            datasets={salesDatasets}
            height={300}
            loading={loading}
            emptyMessage="No sales data available"
          />
        ) : (
          <SimpleBarChart
            labels={couponLabels}
            datasets={couponDatasets}
            height={300}
            loading={loading}
            emptyMessage="No coupon data available"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardChart;