// 관리자 대시보드 그래프용 목 데이터 (admin@email.com 계정 전용 데모)
// 2025-04 ~ 2026-03 (12개월)

/** 상단 카드 표시용 (総商品・総売上・フォロワー・レビュー) */
export const mockStats = {
  totalProducts: 42,
  totalRevenue: 1850000,
  followers: 128,
  reviews: 96,
};

export const salesLabels = [
  '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09',
  '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03'
];

export const salesDatasets = [
  {
    label: 'Revenue (¥)',
    data: [1240000, 1380000, 1310000, 1520000, 1680000, 1590000, 1850000, 1720000, 1980000, 2150000, 2080000, 2280000],
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
    data: [142, 168, 155, 189, 208, 196, 224, 218, 248, 272, 262, 288],
    borderColor: 'rgb(59, 130, 246)',
    borderDash: [5, 5],
    borderWidth: 2,
    fill: false,
    tension: 0.4,
    pointRadius: 4,
    pointHoverRadius: 6,
  }
];

export const couponLabels = ['WELCOME10', 'SUMMER20', 'NEWYEAR', 'FLASH50', 'SPECIAL15'];

export const couponDatasets = [
  {
    label: 'Usage Count',
    data: [45, 23, 67, 12, 34],
    backgroundColor: 'rgba(99, 102, 241, 0.8)',
    borderColor: 'rgb(99, 102, 241)',
    borderWidth: 1,
    borderRadius: 6,
  }
];

