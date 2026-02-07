const today = new Date();

const buildLast12Months = () => {
  const labels = [];
  const data = [];
  for (let i = 11; i >= 0; i -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    labels.push(date.toLocaleString('en-US', { month: 'short' }));
    data.push(50 + Math.floor(Math.random() * 150));
  }
  return { labels, data };
};

const monthData = buildLast12Months();

export const mockProductDetail = {
  id: 0,
  name: 'AI Assistant Pro',
  category: 'Productivity',
  price: 99000,
  createdBy: 'Admin User',
  createdAt: today.toISOString(),
  views: 1284,
  favorites: 320,
  downloads: 870,
  rating: 4.5,
  description: 'Sample product detail for admin preview.',
};

export const mockProductStats = {
  totalSales: 870,
  totalRevenue: 99000 * 870,
  avgRating: 4.6,
};

export const mockSalesChart = {
  labels: monthData.labels,
  datasets: [
    {
      label: 'Sales',
      data: monthData.data,
      borderColor: 'rgb(37, 99, 235)',
      fill: true,
      tension: 0.35,
    },
  ],
};

export const mockReview = {
  id: 1,
  author: 'Sample Buyer',
  rating: 5,
  comment: '정말 유용한 제품이었습니다. 관리용 예시 데이터입니다.',
  comment_ko: '정말 유용한 제품이었습니다. 관리용 예시 데이터입니다.',
  comment_en: 'Really useful product. This is sample data for administration.',
  comment_ja: '本当に便利な製品でした。管理用のサンプルデータです。',
  date: today.toISOString(),
};

