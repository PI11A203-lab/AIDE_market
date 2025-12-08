import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Calendar, Package, DollarSign, Users, Star, TrendingUp, Ticket } from 'lucide-react';
import { LineChart, BarChart } from '../../components/chart';
import ProfileHeader from './components/ProfileHeader';
import { api } from '../../config/api';
import { API_URL } from '../../config/constants';
import './index.css';

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
  const [graphTab, setGraphTab] = useState('revenue'); // 'revenue' or 'coupons'
  const [revenueData, setRevenueData] = useState([]);
  const [couponData, setCouponData] = useState([]);

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
          totalProducts: statsData.total_products || 0,
          totalRevenue: statsData.total_revenue || 0,
          followers: statsData.followers || 0,
          reviews: statsData.reviews || 0
        });

        // 그래프 데이터 설정
        if (statsData.monthly_revenue) {
          setRevenueData(statsData.monthly_revenue);
        }
        if (statsData.coupon_usage) {
          setCouponData(statsData.coupon_usage);
        }
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

  // 깃허브 사용자명 추출
  const getGithubUsername = () => {
    if (!admin?.github_url) return null;
    try {
      const url = new URL(admin.github_url);
      const pathParts = url.pathname.split('/').filter(p => p);
      return pathParts[pathParts.length - 1] || null;
    } catch (e) {
      return null;
    }
  };

  const githubUsername = getGithubUsername();

  // 프로필 이미지 또는 아바타 텍스트 표시
  const renderAvatar = () => {
    if (admin?.profile_image) {
      return (
        <img 
          src={`${API_URL}/${admin.profile_image}`} 
          alt={admin.username}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2rem' }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.textContent = (admin.username || 'Admin').substring(0, 2);
          }}
        />
      );
    }
    return (admin?.username || 'Admin').substring(0, 2);
  };

  if (loading || !admin) {
    return (
      <div className="profile-container">
        <ProfileHeader />
        <main className="profile-main">
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ProfileHeader />

      <main className="profile-main">
        {/* 프로필 헤더 */}
        <div className="profile-hero">
          <div className="profile-hero-content">
            <div className="profile-hero-layout">
              <div className="profile-avatar-section">
                <div className="profile-avatar-large">
                  {renderAvatar()}
                </div>
                <div className="profile-info">
                  <h1 className="profile-name">{admin.username}</h1>
                  <p className="profile-email">{admin.email}</p>
                  <div className="profile-meta">
                    {admin.github_url && (
                      <a 
                        href={admin.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="profile-link"
                      >
                        <Github size={20} />
                        {githubUsername ? `@${githubUsername}` : 'GitHub'}
                      </a>
                    )}
                    <div className="profile-link">
                      <Calendar size={20} />
                      <strong style={{ color: '#111827', marginRight: '4px' }}>{admin.follower_count || 0}</strong> 팔로워
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 카드 4개 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px', 
          marginBottom: '40px' 
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Package size={24} style={{ color: '#1A1A1A' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>Total Products</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>
                  {stats.totalProducts.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={24} style={{ color: '#1A1A1A' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>Total Revenue</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>
                  ¥{stats.totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={24} style={{ color: '#1A1A1A' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>Followers</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>
                  {stats.followers.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Star size={24} style={{ color: '#1A1A1A' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>Reviews</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>
                  {stats.reviews.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 그래프 카드 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB',
          marginBottom: '40px'
        }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #E5E7EB', 
            marginBottom: '24px' 
          }}>
            <button
              onClick={() => setGraphTab('revenue')}
              style={{
                flex: 1,
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: 600,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: graphTab === 'revenue' ? '2px solid #1A1A1A' : '2px solid transparent',
                color: graphTab === 'revenue' ? '#1A1A1A' : '#6B7280',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <TrendingUp size={16} />
              월별 매출
            </button>
            <button
              onClick={() => setGraphTab('coupons')}
              style={{
                flex: 1,
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: 600,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: graphTab === 'coupons' ? '2px solid #1A1A1A' : '2px solid transparent',
                color: graphTab === 'coupons' ? '#1A1A1A' : '#6B7280',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Ticket size={16} />
              쿠폰 사용량
            </button>
          </div>
          <div style={{ height: '300px' }}>
            {graphTab === 'revenue' ? (
              <LineChart 
                data={revenueData.length > 0 ? revenueData : [{ month: '1월', revenue: 0 }]}
                dataKey="revenue"
                name="매출 (¥)"
              />
            ) : (
              <BarChart 
                data={couponData.length > 0 ? couponData : [{ month: '1월', usage: 0 }]}
                dataKey="usage"
                name="사용량"
              />
            )}
          </div>
        </div>

        {/* 내 상품 최근 5개 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB',
          marginBottom: '40px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '24px' }}>
            내 상품 최근 5개
          </h2>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">등록된 상품이 없습니다</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/products/${product.id}`}
                  className="product-card"
                >
                  <div className="card-image">
                    <div className="avatar-large">
                      <img
                        src={`${API_URL}/${product.imageUrl}`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.textContent = product.name.substring(0, 2);
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="card-category">
                      {product.category_name || 'AI Developer'}
                    </div>
                    <div className="card-header">
                      <h3 className="card-title">{product.name}</h3>
                    </div>
                    <div className="card-rating">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#FCD34D" stroke="#FCD34D">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span className="rating-value">{parseFloat(product.rating_average || 0).toFixed(1)}</span>
                      <span className="rating-count">({(product.rating_count || 0).toLocaleString()})</span>
                    </div>
                    <div className="card-footer">
                      <span className="price">¥{product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 최근 리뷰 3개 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '24px' }}>
            최근 리뷰 3개
          </h2>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">리뷰가 없습니다</p>
            </div>
          ) : (
            <div className="reviews-container">
              {reviews.map((review) => {
                const reviewId = review.id || review.review_id;
                const productId = review.product_id || review.order_item?.product_id;

                return (
                  <div key={reviewId} className="review-card">
                    <div className="review-header">
                      <div className="review-avatar">
                        {(review.product?.name || review.order_item?.product?.name || review.aiName || 'AI').substring(0, 2)}
                      </div>
                      <div className="review-info">
                        <Link
                          to={`/products/${productId}`}
                          className="review-product-name"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {review.product?.name || review.order_item?.product?.name || review.aiName || 'AI Developer'}
                        </Link>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i}
                              className={`star ${i < (review.rating || 0) ? 'filled' : 'empty'}`}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill={i < (review.rating || 0) ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="review-body">
                      {(review.comment || review.text || review.review_text) && (
                        <p className="review-content">
                          {review.comment || review.text || review.review_text}
                        </p>
                      )}
                      <span className="review-date">
                        {review.created_at 
                          ? new Date(review.created_at).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : review.date || ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

