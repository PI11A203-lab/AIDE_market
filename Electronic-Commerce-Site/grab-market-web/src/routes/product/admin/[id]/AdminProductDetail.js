import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { message } from 'antd';
import ProfileHeader from '../../../profile/components/ProfileHeader';
import { api } from '../../../../config/api';
import { API_URL } from '../../../../config/constants';
import {
  mockProductDetail,
  mockProductStats,
  mockSalesChart,
  mockReview,
} from './mock.data';
import './AdminProductDetail.css';
import BackButton from './components/BackButton';
import HeaderSection from './components/HeaderSection';
import StatsSection from './components/StatsSection';
import SalesChartSection from './components/SalesChartSection';
import InfoGrid from './components/InfoGrid';
import LatestReviewSection from './components/LatestReviewSection';
import { useTranslation } from 'react-i18next';

export default function AdminProductDetail() {
  const { id } = useParams();
  const history = useHistory();
  const [product, setProduct] = useState(null);
  const [stats, setStats] = useState(mockProductStats);
  const [chart, setChart] = useState(mockSalesChart);
  const [latestReview, setLatestReview] = useState(mockReview);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  const formatCurrency = (value) => {
    const numeric = Number(value) || 0;
    return `¥${numeric.toLocaleString()}`;
  };

  const formatDate = useCallback(
    (value) => {
      if (!value) return '-';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '-';
      return date.toLocaleDateString(i18n.language || 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    [i18n.language]
  );

  const normalizeProduct = (raw) => {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.name || 'Untitled Product',
      category: raw.category_name || raw.category || 'Uncategorized',
      price: raw.price || 0,
      createdBy: raw.created_by || raw.creator || raw.owner?.name || 'Unknown',
      createdAt: raw.created_at || raw.createdAt || raw.created_at_date,
      views: raw.view_count || raw.views || 0,
      favorites: raw.favorite_count || raw.favorites || raw.likes || 0,
      downloads: raw.download_count || raw.sales || 0,
      rating: Number(raw.rating_average || raw.avg_rating || raw.rating) || 0,
      imageUrl: raw.imageUrl ? `${API_URL}/${raw.imageUrl}` : raw.thumbnail,
      description: raw.description || '',
    };
  };

  const normalizeStats = (raw) => {
    if (!raw) return mockProductStats;
    return {
      totalSales: raw.totalSales ?? raw.total_sales ?? 0,
      totalRevenue: raw.totalRevenue ?? raw.total_revenue ?? 0,
      avgRating: Number(raw.avgRating ?? raw.avg_rating ?? raw.rating_average ?? 0) || 0,
    };
  };

  const normalizeChart = (raw) => {
    if (!raw) return mockSalesChart;
    if (raw.labels && raw.datasets) return raw;
    const dataArray = raw.data || raw; // 새 엔드포인트는 배열로 반환
    if (Array.isArray(dataArray)) {
      const labels = dataArray.map((item) => item.month || item.label);
      const data = dataArray.map((item) => Number(item.sales ?? item.value ?? 0));
      return {
        labels,
        datasets: [
          {
            label: 'Sales',
            data,
            borderColor: 'rgb(37, 99, 235)',
            fill: true,
            tension: 0.35,
          },
        ],
      };
    }
    return mockSalesChart;
  };

  const normalizeReview = (raw) => {
    if (!raw) return mockReview;
    return {
      ...raw,
      id: raw.id,
      author: raw.author || raw.user_name || raw.user?.name || 'Anonymous',
      rating: Number(raw.rating ?? raw.score ?? 0) || 0,
      comment: raw.comment || raw.review_text || raw.text || '',
      date: raw.created_at || raw.createdAt,
    };
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 각 API를 개별적으로 호출하여 하나가 실패해도 나머지는 로드되도록 함
      const results = await Promise.allSettled([
        api.admin.getProductDetail(id).catch(err => ({ error: err, data: null })),
        api.admin.getProductStats(id).catch(err => ({ error: err, data: null })),
        api.admin.getProductSalesChart(id).catch(err => ({ error: err, data: null })),
        api.admin.getProductReviews(id, { limit: 1 }).catch(err => ({ error: err, data: null })),
      ]);

      // 상품 상세 정보
      if (results[0].status === 'fulfilled' && !results[0].value.error) {
        const detailRes = results[0].value;
        const nextProduct = normalizeProduct(detailRes.data?.product || detailRes.data);
        setProduct(nextProduct || mockProductDetail);
      } else {
        console.warn('Failed to load product detail:', results[0].status === 'rejected' ? results[0].reason : results[0].value?.error);
        setProduct((prev) => prev || mockProductDetail);
      }

      // 통계
      if (results[1].status === 'fulfilled' && !results[1].value.error) {
        setStats(normalizeStats(results[1].value.data));
      } else {
        console.warn('Failed to load product stats:', results[1].status === 'rejected' ? results[1].reason : results[1].value?.error);
        setStats((prev) => prev || mockProductStats);
      }

      // 차트
      if (results[2].status === 'fulfilled' && !results[2].value.error) {
        setChart(normalizeChart(results[2].value.data));
      } else {
        console.warn('Failed to load sales chart:', results[2].status === 'rejected' ? results[2].reason : results[2].value?.error);
        setChart((prev) => prev || mockSalesChart);
      }

      // 리뷰
      if (results[3].status === 'fulfilled' && !results[3].value.error) {
        const reviewRes = results[3].value;
        const reviews = reviewRes.data?.reviews || reviewRes.data || [];
        setLatestReview(normalizeReview(reviews[0]));
      } else {
        console.warn('Failed to load reviews:', results[3].status === 'rejected' ? results[3].reason : results[3].value?.error);
        setLatestReview((prev) => prev || mockReview);
      }
    } catch (error) {
      console.error('Failed to load admin product detail:', error);
      message.warning(t('productAdmin.list.messages.loadFail'));
      setProduct((prev) => prev || mockProductDetail);
      setStats((prev) => prev || mockProductStats);
      setChart((prev) => prev || mockSalesChart);
      setLatestReview((prev) => prev || mockReview);
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const productMeta = useMemo(() => {
    return [
      { label: t('productAdmin.detail.meta.creator'), value: product?.createdBy || 'Unknown' },
      { label: t('productAdmin.detail.meta.created'), value: formatDate(product?.createdAt) },
      { label: t('productAdmin.detail.meta.views'), value: (product?.views || 0).toLocaleString() },
    ];
  }, [product, formatDate, t]);

  if (loading) {
    return (
      <div className="admin-product-detail">
        <ProfileHeader />
        <main className="admin-product-detail__main">
          <div className="admin-product-detail__loading">{t('productAdmin.detail.loading')}</div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="admin-product-detail">
        <ProfileHeader />
        <main className="admin-product-detail__main">
          <div className="admin-product-detail__error">
            {t('productAdmin.detail.loadError')}
            <button className="btn btn-primary" onClick={loadData}>
              {t('productAdmin.detail.retry')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-product-detail">
      <ProfileHeader />
      <main className="admin-product-detail__main">
        <BackButton onClick={() => history.push('/profile/products')} />

        <HeaderSection product={product} productMeta={productMeta} />

        <StatsSection stats={stats} formatCurrency={formatCurrency} />

        <SalesChartSection chart={chart} />

        <InfoGrid
          product={product}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />

        <LatestReviewSection
          latestReview={latestReview}
          productId={product.id}
          formatDate={formatDate}
        />
      </main>
    </div>
  );
}

