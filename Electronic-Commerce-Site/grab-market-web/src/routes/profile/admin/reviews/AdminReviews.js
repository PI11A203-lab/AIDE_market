import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { AdminLayout } from '../components';
import { api } from '../../../../config/api';
import {
  StatsCards,
  FilterBar,
  SummaryBar,
  ReviewsList,
  Pagination
} from './components';
import { mockReviewsStats, mockReviews, mockProducts } from './mock.data';
import './AdminReviews.css';

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
      setStats({
        ratingDistribution: {
          5: statsData.rating_5 || 0,
          4: statsData.rating_4 || 0,
          3: statsData.rating_3 || 0,
          2: statsData.rating_2 || 0,
          1: statsData.rating_1 || 0
        },
        totalReviews: statsData.total_reviews || 0,
        averageRating: parseFloat(statsData.average_rating || 0).toFixed(1),
        thisMonth: statsData.this_month || 0,
        positive: statsData.positive || 0,
        needsAttention: statsData.needs_attention || 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      // 실패 시 mock 데이터 사용
      setStats(mockReviewsStats);
    }
  }, []);

  // 리뷰 목록 로드
  const loadReviews = useCallback(async () => {
    setLoading(true);
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
      const reviewsData = response.data?.reviews || [];
      const paginationData = response.data?.pagination || {
        total: 0,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: 0
      };

      setReviews(reviewsData);
      setPagination(prev => ({
        ...prev,
        total: paginationData.total || 0,
        totalPages: paginationData.totalPages || 0
      }));
    } catch (error) {
      console.error('Failed to load reviews:', error);
      message.error('리뷰 목록을 불러오는데 실패했습니다.');
      // 실패 시 mock 데이터 사용
      setReviews(mockReviews);
      setPagination(prev => ({
        ...prev,
        total: mockReviews.length,
        totalPages: Math.ceil(mockReviews.length / prev.limit)
      }));
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

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
          <h1 className="page-title">Review Management</h1>
          <p className="page-subtitle">Manage all reviews for your products</p>
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
            <div className="text-xl text-gray-600">Loading...</div>
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

