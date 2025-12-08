// 관리자 대시보드 그래프용 목 데이터

export const salesLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const salesDatasets = [
  {
    label: 'Revenue (¥)',
    data: [350000, 420000, 380000, 450000, 500000, 480000, 520000, 490000, 530000, 560000, 540000, 580000],
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
    data: [12, 15, 13, 16, 18, 17, 19, 18, 20, 22, 21, 23],
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

