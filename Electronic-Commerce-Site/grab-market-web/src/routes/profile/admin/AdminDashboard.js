import React, { useState, useEffect } from 'react';
import { api } from '../../../config/api';
import { API_URL } from '../../../config/constants';
import {
  AdminHero,
  StatsGrid,
  ChartSection,
  RecentProducts,
  RecentReviews,
  AdminLayout,
} from './components';
import '../index.css';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    followers: 0,
    reviews: 0
  });
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // 사용자 정보 가져오기
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userFromStorage) {
        window.location.href = '/login';
        return;
      }

      const userData = JSON.parse(userFromStorage);
      const userId = userData.id;

      // Admin 정보 가져오기
      try {
        const userResponse = await api.users.getById(userId);
        const apiUser = userResponse.data.user;
        
        const avatarDisplay = apiUser.profile_image 
          ? `${API_URL}/${apiUser.profile_image}`
          : null;
        
        setAdmin({
          id: apiUser.id,
          username: apiUser.username || apiUser.nickname || 'Admin',
          email: apiUser.email || '',
          follower_count: apiUser.follower_count || 0,
          github_url: apiUser.github_url || null,
          avatar: avatarDisplay || (apiUser.username || 'Admin').substring(0, 2),
          profile_image: apiUser.profile_image || null
        });
      } catch (error) {
        console.error('Failed to load admin info:', error);
        setAdmin({
          id: userData.id,
          username: userData.username || 'Admin',
          email: userData.email || '',
          follower_count: 0,
          github_url: null,
          avatar: (userData.username || 'Admin').substring(0, 2)
        });
      }

      // 통계 데이터 가져오기
      try {
        const statsResponse = await api.admin.getStats();
        const statsData = statsResponse.data;
        setStats({
          // 백엔드 키(totalProducts 등)에 맞춰 매핑
          totalProducts: statsData.totalProducts ?? statsData.total_products ?? 0,
          totalRevenue: statsData.totalRevenue ?? statsData.total_revenue ?? 0,
          followers: statsData.followers ?? 0,
          reviews: statsData.totalReviews ?? statsData.reviews ?? 0
        });

      } catch (error) {
        console.error('Failed to load stats:', error);
      }

      // 최근 상품 5개 가져오기
      try {
        const productsResponse = await api.admin.getProducts({ limit: 5 });
        setProducts(productsResponse.data?.products || []);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      }

      // 최근 리뷰 3개 가져오기
      try {
        const reviewsResponse = await api.admin.getReviews({ limit: 3 });
        setReviews(reviewsResponse.data?.reviews || []);
      } catch (error) {
        console.error('Failed to load reviews:', error);
        setReviews([]);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !admin) {
    return (
      <AdminLayout>
        <div className="profile-container">
          <main className="profile-main">
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">{t('profile.admin.loading')}</div>
            </div>
          </main>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="profile-container">
        <main className="profile-main">
          {/* 프로필 헤더 */}
          <AdminHero admin={admin} />

          {/* 통계 카드 4개 */}
          <StatsGrid stats={stats} />

          {/* 그래프 카드 */}
          <ChartSection />

          {/* 내 상품 최근 5개 */}
          <RecentProducts products={products} />

          {/* 최근 리뷰 3개 */}
          <RecentReviews reviews={reviews} />
        </main>
      </div>
    </AdminLayout>
  );
}

