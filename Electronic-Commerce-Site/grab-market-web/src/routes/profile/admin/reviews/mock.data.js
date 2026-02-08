// Mock 데이터
export const mockReviewsStats = {
  ratingDistribution: {
    5: 85,
    4: 42,
    3: 18,
    2: 8,
    1: 3
  },
  totalReviews: 156,
  averageRating: 4.6,
  thisMonth: 12,
  positive: 127, // 4-5 stars
  needsAttention: 29 // 1-3 stars
};

export const mockReviews = [
  {
    id: 1,
    user: {
      id: 1,
      username: 'admin',
      avatar: null
    },
    product: {
      id: 75,
      name: 'MidjourneyAI',
      icon: '🎨'
    },
    rating: 3,
    comment: 'レビューテストしてます！',
    created_at: '2025-12-03T00:00:00Z',
    helpful_count: 5,
    verified: true
  },
  {
    id: 2,
    user: {
      id: 2,
      username: 'John Doe',
      avatar: null
    },
    product: {
      id: 21,
      name: 'Artelia',
      icon: '🖼️'
    },
    rating: 5,
    comment: 'Excellent AI for image generation! Very satisfied with the results. The quality is outstanding and the interface is intuitive.',
    created_at: '2025-11-28T00:00:00Z',
    helpful_count: 23,
    verified: true
  },
  {
    id: 3,
    user: {
      id: 3,
      username: 'Sarah Miller',
      avatar: null
    },
    product: {
      id: 3,
      name: 'Reacton',
      icon: '⚛️'
    },
    rating: 4,
    comment: 'Great component library! Saved me a lot of development time. Would definitely recommend to other developers.',
    created_at: '2025-11-25T00:00:00Z',
    helpful_count: 18,
    verified: true
  },
  {
    id: 4,
    user: {
      id: 4,
      username: 'Mike Johnson',
      avatar: null
    },
    product: {
      id: 4,
      name: 'VueJin',
      icon: '🔒'
    },
    rating: 5,
    comment: 'Solid security features and easy integration. Perfect for our enterprise application needs.',
    created_at: '2025-11-22T00:00:00Z',
    helpful_count: 15,
    verified: true
  },
  {
    id: 5,
    user: {
      id: 5,
      username: 'Emily Chen',
      avatar: null
    },
    product: {
      id: 5,
      name: 'Nexty',
      icon: '📊'
    },
    rating: 5,
    comment: 'Excellent backend solution! Performance is top-notch and documentation is clear. Highly recommended!',
    created_at: '2025-11-20T00:00:00Z',
    helpful_count: 31,
    verified: true
  }
];

// 상품 mock (rating_count: 상품별 mock 리뷰 개수 - generateMockReviews에서 사용)
export const mockProducts = [
  { id: 75, name: 'MidjourneyAI', icon: '🎨', rating_count: 5 },
  { id: 21, name: 'Artelia', icon: '🖼️', rating_count: 8 },
  { id: 3, name: 'Reacton', icon: '⚛️', rating_count: 4 },
  { id: 4, name: 'VueJin', icon: '🔒', rating_count: 6 },
  { id: 5, name: 'Nexty', icon: '📊', rating_count: 3 }
];

