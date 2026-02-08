import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../components';
import { api } from '../../../../config/api';
import {
  StatsCards,
  FilterBar,
  SummaryBar,
  ReviewsList,
  Pagination
} from './components';
import { mockReviewsStats, mockProducts } from './mock.data';
import { generateMockReviews, toAdminReviewFormat } from '../../../../utils/mockReviews';
import './AdminReviews.css';
import { useTranslation } from 'react-i18next';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    totalReviews: 0,
    averageRating: 0,
    thisMonth: 0,
    positive: 0,
    needsAttention: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // 필터 상태
  const [filters, setFilters] = useState({
    search: '',
    product: '',
    rating: '',
    sort: 'recent'
  });
  const { t, i18n } = useTranslation();
  
  // 언어 설정 로드
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 상품 목록 로드
  const loadProducts = useCallback(async () => {
    try {
      const response = await api.admin.getProducts({ limit: 100 });
      const productsData = response.data?.products || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to load products:', error);
      // 실패 시 mock 데이터 사용
      setProducts(mockProducts);
    }
  }, []);

  // 통계 로드
  const loadStats = useCallback(async () => {
    try {
      const response = await api.admin.getReviewsStats();
      const statsData = response.data;
      console.log('[AdminReviews] 통계 데이터:', statsData);
      console.log('[AdminReviews] distribution:', statsData.distribution);
      
      // distribution이 객체인지 배열인지 확인
      let ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      if (statsData.distribution) {
        if (Array.isArray(statsData.distribution)) {
          // 배열인 경우
          statsData.distribution.forEach(item => {
            if (item.rating && item.count) {
              ratingDist[item.rating] = parseInt(item.count) || 0;
            }
          });
        } else {
          // 객체인 경우
          ratingDist = {
            5: parseInt(statsData.distribution[5] || statsData.distribution['5'] || 0),
            4: parseInt(statsData.distribution[4] || statsData.distribution['4'] || 0),
            3: parseInt(statsData.distribution[3] || statsData.distribution['3'] || 0),
            2: parseInt(statsData.distribution[2] || statsData.distribution['2'] || 0),
            1: parseInt(statsData.distribution[1] || statsData.distribution['1'] || 0)
          };
        }
      }
      
      console.log('[AdminReviews] 정규화된 ratingDistribution:', ratingDist);
      
      setStats({
        ratingDistribution: ratingDist,
        totalReviews: statsData.totalReviews ?? statsData.total_reviews ?? 0,
        averageRating: parseFloat(statsData.avgRating ?? statsData.average_rating ?? 0).toFixed(1),
        thisMonth: statsData.thisMonth ?? statsData.this_month ?? 0,
        positive: statsData.positive ?? 0,
        needsAttention: statsData.needsAttention ?? statsData.needs_attention ?? 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      // 실패 시 mock 데이터 사용
      setStats(mockReviewsStats);
    }
  }, []);

  // 리뷰 데이터 정규화 (백엔드 응답 구조에 맞춤)
  const normalizeReview = useCallback((review) => {
    // 백엔드 응답: author, author_email, product_id, product_name, product_image, review_text, rating, helpful_count, created_at
    return {
      ...review,
      id: review.id,
      rating: review.rating || 0,
      comment: review.review_text || review.comment || '',
      created_at: review.created_at || review.createdAt,
      helpful_count: review.helpful_count || review.helpfulCount || 0,
      verified: review.verified || false,
      user: {
        username: review.author || review.user?.username || 'Unknown',
        email: review.author_email || review.user?.email || ''
      },
      product: {
        id: review.product_id || review.product?.id,
        name: review.product_name || review.product?.name || 'Unknown Product',
        image: review.product_image || review.product?.image || null,
        icon: review.product_image ? '🖼️' : '📦'
      }
    };
  }, []);

  // 상품별 mock 리뷰 생성 (API 실패 시)
  const buildMockReviewsFromProducts = useCallback((productsList) => {
    const all = [];
    (productsList || []).forEach(product => {
      const count = product.rating_count ?? product.review_count ?? 3;
      const name = product.name || product.nameKey || 'Product';
      const generated = generateMockReviews(product.id, Math.min(count, 15), name);
      generated.forEach(mock => all.push(toAdminReviewFormat(mock, product)));
    });
    return all;
  }, []);

  // 리뷰 통계 계산 (mock 리뷰에서)
  const computeStatsFromReviews = useCallback((reviewsList) => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    const now = new Date();
    const thisMonth = now.getFullYear() * 100 + (now.getMonth() + 1);
    let monthCount = 0;
    let positive = 0;
    let needsAttention = 0;

    reviewsList.forEach(r => {
      const rating = Math.round(r.rating || 0);
      if (rating >= 1 && rating <= 5) dist[rating]++;
      sum += r.rating || 0;
      const d = new Date(r.created_at || r.date);
      if (d.getFullYear() * 100 + (d.getMonth() + 1) === thisMonth) monthCount++;
      if (rating >= 4) positive++;
      else if (rating >= 1 && rating <= 3) needsAttention++;
    });

    const total = reviewsList.length;
    return {
      ratingDistribution: dist,
      totalReviews: total,
      averageRating: total > 0 ? (sum / total).toFixed(1) : '0',
      thisMonth: monthCount,
      positive,
      needsAttention
    };
  }, []);

  // 리뷰 목록 로드
  const loadReviews = useCallback(async () => {
    setLoading(true);

    const applyMockReviews = () => {
      const productsList = products.length > 0 ? products : mockProducts;
      const allMock = buildMockReviewsFromProducts(productsList);

      // 필터 적용
      let filtered = [...allMock];
      if (filters.product) {
        filtered = filtered.filter(r => String(r.product?.id) === String(filters.product));
      }
      if (filters.rating) {
        const target = parseInt(filters.rating, 10);
        filtered = filtered.filter(r => Math.round(r.rating) === target);
      }
      if (filters.search) {
        const q = (filters.search || '').toLowerCase();
        filtered = filtered.filter(r =>
          (r.user?.username || '').toLowerCase().includes(q) ||
          (r.comment || r.review_text || '').toLowerCase().includes(q)
        );
      }
      if (filters.sort === 'recent') {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (filters.sort === 'oldest') {
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      } else if (filters.sort === 'rating-high') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (filters.sort === 'rating-low') {
        filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      }

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / pagination.limit));
      const start = (pagination.page - 1) * pagination.limit;
      const paged = filtered.slice(start, start + pagination.limit);

      setReviews(paged);
      setPagination(prev => ({
        ...prev,
        total,
        totalPages
      }));
      setStats(computeStatsFromReviews(allMock));
    };

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.product && { product: filters.product }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.sort && { sort: filters.sort })
      };

      const response = await api.admin.getReviewsList(params);
      const rawReviews = response.data?.reviews || [];

      // API 실패 또는 리뷰 없음/적음 → 상품 mock 리뷰 사용 (데모용)
      if (!rawReviews || rawReviews.length < 2) {
        applyMockReviews();
        return;
      }

      const normalizedReviews = rawReviews.map(normalizeReview);
      const paginationData = response.data?.pagination || {
        total: 0,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: 0
      };

      setReviews(normalizedReviews);
      setPagination(prev => ({
        ...prev,
        total: paginationData.total || 0,
        totalPages: paginationData.totalPages || 0
      }));
    } catch (error) {
      console.error('Failed to load reviews:', error);
      applyMockReviews();
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit, products, buildMockReviewsFromProducts, computeStatsFromReviews, normalizeReview]);

  useEffect(() => {
    loadProducts();
    loadStats();
  }, [loadProducts, loadStats]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // 필터 변경 핸들러
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // 필터 변경 시 첫 페이지로
  };

  // 필터 리셋
  const handleReset = () => {
    setFilters({
      search: '',
      product: '',
      rating: '',
      sort: 'recent'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminLayout>
      <div className="admin-reviews-container">
        <main className="admin-reviews-main">
        {/* 페이지 헤더 */}
        <div className="page-header">
          <h1 className="page-title">{t('profile.admin.reviewsPage.title')}</h1>
          <p className="page-subtitle">{t('profile.admin.reviewsPage.subtitle')}</p>
        </div>

        {/* 평점 통계 카드 */}
        <StatsCards ratingDistribution={stats.ratingDistribution} />

        {/* 필터 바 */}
        <FilterBar
          filters={filters}
          products={products}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* 통계 요약 */}
        <SummaryBar stats={stats} />

        {/* 리뷰 목록 */}
          {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">{t('common.loading')}</div>
          </div>
        ) : (
          <>
            <ReviewsList
              reviews={reviews}
              hasFilters={!!(filters.search || filters.product || filters.rating)}
            />
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
        </main>
      </div>
    </AdminLayout>
  );
}

