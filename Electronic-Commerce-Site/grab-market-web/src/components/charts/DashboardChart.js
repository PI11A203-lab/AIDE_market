import React, { useEffect, useMemo, useState } from 'react';
import { SimpleLineChart } from './LineChart';
import { SimpleBarChart } from './BarChart';
import { api } from '../../config/api';
import {
  salesLabels as mockSalesLabels,
  salesDatasets as mockSalesDatasets,
  couponLabels as mockCouponLabels,
  couponDatasets as mockCouponDatasets,
} from '../../routes/profile/admin/mock.data';

const ADMIN_MOCK_EMAIL = 'admin@email.com';

function isAdminMockAccount() {
  try {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!raw) return false;
    const user = JSON.parse(raw);
    return (user.email || '').toLowerCase() === ADMIN_MOCK_EMAIL;
  } catch {
    return false;
  }
}

/**
 * 관리자 대시보드 그래프 카드
 * 월별 매출 / 쿠폰 사용량 탭 전환 지원
 * admin@email.com 계정일 때만 판매·쿠폰 mock 데이터 표시
 */
export const DashboardChart = () => {
  const [activeChart, setActiveChart] = useState('sales'); // 'sales' | 'coupons'
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({ labels: [], datasets: [] });
  const [couponData, setCouponData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const loadCharts = async () => {
      setLoading(true);
      const useMock = isAdminMockAccount();

      try {
        // admin@email.com 이면 API 무시하고 항상 mock 사용 (그래프가 있어 보이도록)
        if (useMock) {
          setSalesData({ labels: mockSalesLabels, datasets: mockSalesDatasets });
          setCouponData({ labels: mockCouponLabels, datasets: mockCouponDatasets });
          setLoading(false);
          return;
        }

        // 매출/판매 차트
        const salesRes = await api.admin.getSalesChart();
        console.log('Sales chart response:', salesRes.data);
        const salesRaw = Array.isArray(salesRes.data) ? salesRes.data : [];
        const salesLabels = salesRaw.map((item) => item.month || item.Month || '');
        const salesCounts = salesRaw.map((item) => Number(item.sales ?? item.Sales ?? 0));
        const revenue = salesRaw.map((item) => Number(item.revenue ?? item.Revenue ?? 0));

        setSalesData({
          labels: salesLabels,
          datasets: [
            {
              label: 'Revenue (¥)',
              data: revenue,
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Sales Count',
              data: salesCounts,
              borderColor: 'rgb(59, 130, 246)',
              borderDash: [5, 5],
              borderWidth: 2,
              fill: false,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        });

        // 쿠폰 사용량 (월별)
        const couponRes = await api.admin.getCouponUsage();
        console.log('Coupon usage response:', couponRes.data);
        const couponRaw = Array.isArray(couponRes.data) ? couponRes.data : [];
        const couponLabels = couponRaw.map((item) => item.month || item.Month || '');
        const couponUsage = couponRaw.map((item) => Number(item.usageCount ?? item.UsageCount ?? 0));

        setCouponData({
          labels: couponLabels,
          datasets: [
            {
              label: 'Usage Count',
              data: couponUsage,
              backgroundColor: 'rgba(99, 102, 241, 0.8)',
              borderColor: 'rgb(99, 102, 241)',
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        });
      } catch (error) {
        console.error('Failed to load dashboard charts:', error);
        console.error('Error details:', error.response?.data || error.message);
        if (useMock) {
          setSalesData({ labels: mockSalesLabels, datasets: mockSalesDatasets });
          setCouponData({ labels: mockCouponLabels, datasets: mockCouponDatasets });
        } else {
          setSalesData({ labels: [], datasets: [] });
          setCouponData({ labels: [], datasets: [] });
        }
      } finally {
        setLoading(false);
      }
    };

    loadCharts();
  }, []);

  // salesEmpty: labels가 없거나 모든 데이터가 0인 경우만 true
  // 하지만 labels가 있으면 그래프를 표시 (0 값도 표시)
  const salesEmpty = useMemo(
    () => !salesData.labels.length || salesData.labels.length === 0,
    [salesData]
  );

  const couponEmpty = useMemo(
    () => !couponData.labels.length || !couponData.datasets.some((d) => (d.data || []).some((v) => Number(v) > 0)),
    [couponData]
  );

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
        {loading ? (
          <div style={{ 
            height: '300px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#FAFAFA',
            borderRadius: '8px',
            color: '#9CA3AF',
            fontSize: '14px'
          }}>
            Loading chart data...
          </div>
        ) : activeChart === 'sales' ? (
          <SimpleLineChart
            labels={salesData.labels}
            datasets={salesData.datasets}
            height={300}
            loading={false}
            emptyMessage={salesEmpty ? 'No sales data available. Sales data will appear here once you have completed orders.' : undefined}
          />
        ) : (
          <SimpleBarChart
            labels={couponData.labels}
            datasets={couponData.datasets}
            height={300}
            loading={false}
            horizontal={false}
            emptyMessage={couponEmpty ? 'No coupon usage data available. Coupon usage data will appear here once customers use coupons.' : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardChart;