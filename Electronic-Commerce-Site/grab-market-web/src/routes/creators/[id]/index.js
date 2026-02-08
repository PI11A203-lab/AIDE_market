import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api } from '../../../config/api';
import { API_URL } from '../../../config/constants';
import ProfileHeader from '../../profile/components/ProfileHeader';
import FollowButton from '../../profile/components/FollowButton';
import FollowListModal from '../../profile/components/FollowListModal';
import { Github, Package, Download, Star, MessageCircle } from 'lucide-react';
import '../index.css';

const CHART_COLORS = ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666'];

export default function CreatorDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const [creator, setCreator] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const syncLanguage = () => {
      const savedLanguage = localStorage.getItem('appLanguage');
      if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage) && savedLanguage !== i18n.language) {
        i18n.changeLanguage(savedLanguage);
      }
    };
    syncLanguage();
    const handleStorageChange = (e) => {
      if (e.key === 'appLanguage') syncLanguage();
    };
    window.addEventListener('storage', handleStorageChange);
    i18n.on('languageChanged', syncLanguage);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      i18n.off('languageChanged', syncLanguage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        setCurrentUserId(userData.id);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    const loadCreatorData = async () => {
      try {
        const userResponse = await api.users.getById(id);
        const userData = userResponse.data.user;

        if (userData.role !== 'admin') {
          history.push('/creators');
          return;
        }

        const avatarDisplay = userData.profile_image
          ? `${API_URL}/${userData.profile_image}`
          : null;

        setCreator({
          id: userData.id,
          name: userData.username || 'User',
          username: `@${userData.username}`,
          initials: (userData.username || 'User').substring(0, 2).toUpperCase(),
          avatarDisplay,
          github_url: userData.github_url || null,
          tags: Array.isArray(userData.tags) ? userData.tags.map(t => typeof t === 'object' ? t.name : t) : [],
          email: userData.email || null,
          is_email_public: userData.is_email_public || false,
          joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : i18n.language === 'ja' ? 'ja-JP' : 'en-US', { year: 'numeric', month: 'long' }) : '',
          follower_count: userData.follower_count || 0
        });

        let productList = [];
        const userId = parseInt(id, 10);
        const username = (userData.username || '').trim();
        let sellerName = null;
        if (userData.seller_application_data && typeof userData.seller_application_data === 'object' && userData.seller_application_data.seller_name) {
          sellerName = String(userData.seller_application_data.seller_name).trim();
        }

        const isCreatorProduct = (p) => {
          const s = p.seller ? String(p.seller).trim() : '';
          return p.created_by === userId || s === username || (sellerName && s === sellerName);
        };

        try {
          const productsResponse = await api.users.getProducts(id);
          productList = productsResponse.data?.products || [];
        } catch (productsErr) {
          if (productsErr.response?.status === 404 || productsErr.response?.status >= 500) {
            const allRes = await api.products.getList({ limit: 1000 });
            const all = allRes.data?.products || allRes.data || [];
            productList = all.filter(isCreatorProduct);
            productList.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
          }
        }
        setProducts(productList);

        try {
          const followersResponse = await api.users.getFollowers(userData.id, { page: 1, limit: 1 });
          setFollowerCount(followersResponse.data.pagination?.total || userData.follower_count || 0);
        } catch (error) {
          setFollowerCount(userData.follower_count || 0);
        }
      } catch (error) {
        console.error('크리에이터 정보 로드 실패:', error);
        history.push('/creators');
      } finally {
        setLoading(false);
      }
    };

    loadCreatorData();
  }, [id, history, i18n.language]);

  const handleFollowChange = async () => {
    if (creator?.id) {
      try {
        const followersResponse = await api.users.getFollowers(creator.id, { page: 1, limit: 1 });
        setFollowerCount(followersResponse.data.pagination?.total || 0);
        const userResponse = await api.users.getById(creator.id);
        setCreator(prev => prev ? { ...prev, follower_count: userResponse.data.user.follower_count || 0 } : null);
      } catch (error) {
        console.error('팔로워 수 업데이트 실패:', error);
      }
    }
  };

  const getGithubUsername = () => {
    if (!creator?.github_url) return null;
    try {
      const url = new URL(creator.github_url);
      const pathParts = url.pathname.split('/').filter(p => p);
      return pathParts[pathParts.length - 1] || null;
    } catch (e) {
      return null;
    }
  };

  const githubUsername = creator ? getGithubUsername() : null;

  const sellerStats = useMemo(() => {
    if (!products.length) return { totalDownloads: 0, avgRating: 0, totalReviews: 0, categoryData: [] };
    const totalDownloads = products.reduce((sum, p) => sum + (p.download_count || 0), 0);
    const totalReviews = products.reduce((sum, p) => sum + (p.rating_count || 0), 0);
    const weightedSum = products.reduce((sum, p) => sum + (parseFloat(p.rating_average || 0) * (p.rating_count || 0)), 0);
    const avgRating = totalReviews > 0 ? (weightedSum / totalReviews) : 0;
    const categoryMap = {};
    products.forEach(p => {
      const cat = p.category_name || p.category_name_en || '-';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const categoryData = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    return { totalDownloads, avgRating, totalReviews, categoryData };
  }, [products]);

  if (loading) {
    return (
      <div className="creator-detail-page">
        <ProfileHeader />
        <main className="creator-detail-main">
          <div className="creator-detail-container">
            <div className="creator-loading">
              <div className="creator-loading-spinner" />
              <p>{t('common.loading')}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="creator-detail-page">
        <ProfileHeader />
        <main className="creator-detail-main">
          <div className="creator-detail-container">
            <div className="creator-empty-message">{t('creators.notFound')}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="creator-detail-page seller-profile-page">
      <ProfileHeader />
      <main className="creator-detail-main">
        <div className="creator-detail-container">
          {/* 판매자 프로필 헤더 */}
          <section className="seller-profile-header">
            <div className="seller-profile-avatar">
              {creator.avatarDisplay ? (
                <img
                  src={creator.avatarDisplay}
                  alt={creator.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.textContent = creator.initials;
                  }}
                />
              ) : (
                <span>{creator.initials}</span>
              )}
            </div>
            <div className="seller-profile-info">
              <h1 className="seller-profile-name">{creator.name}</h1>
              <p className="seller-profile-username">{creator.username}</p>
              <div className="seller-profile-meta">
                {creator.github_url && (
                  <a href={creator.github_url} target="_blank" rel="noopener noreferrer" className="seller-github-link">
                    <Github className="w-4 h-4" /> {githubUsername ? `@${githubUsername}` : 'GitHub'}
                  </a>
                )}
                <button
                  type="button"
                  className="seller-follower-link"
                  onClick={() => setShowFollowersModal(true)}
                >
                  <strong>{followerCount}</strong> {t('profile.hero.followers')}
                </button>
                {currentUserId && currentUserId !== creator.id && (
                  <FollowButton
                    targetUserId={creator.id}
                    targetUsername={creator.name}
                    currentUserId={currentUserId}
                    onFollowChange={handleFollowChange}
                    className="seller-follow-btn"
                    showAlways={true}
                  />
                )}
                {!currentUserId && (
                  <button className="seller-follow-btn" onClick={() => history.push('/login')} type="button">
                    {t('creators.follow')}
                  </button>
                )}
              </div>
              <p className="seller-follow-hint">{t('creators.followHintDetail')}</p>
              {creator.tags?.length > 0 && (
                <div className="seller-tags">
                  {creator.tags.map((tag, idx) => (
                    <span key={idx} className="seller-tag">#{tag}</span>
                  ))}
                </div>
              )}
              {creator.is_email_public && creator.email && (
                <p className="seller-email">{creator.email}</p>
              )}
              {creator.joinDate && (
                <p className="seller-join-date">{t('creators.joinDate')} {creator.joinDate}</p>
              )}
            </div>
          </section>

          {/* 판매자 어필 섹션 - 통계 & 카테고리 분포 */}
          <section className="seller-appeal-section">
            <div className="seller-stats-cards">
              <div className="seller-stat-card">
                <Package className="seller-stat-icon" />
                <div className="seller-stat-content">
                  <span className="seller-stat-value">{products.length}</span>
                  <span className="seller-stat-label">{t('creators.productsTitle')}</span>
                </div>
              </div>
              <div className="seller-stat-card">
                <Download className="seller-stat-icon" />
                <div className="seller-stat-content">
                  <span className="seller-stat-value">{sellerStats.totalDownloads.toLocaleString()}</span>
                  <span className="seller-stat-label">{t('creators.totalDownloads')}</span>
                </div>
              </div>
              <div className="seller-stat-card">
                <Star className="seller-stat-icon" />
                <div className="seller-stat-content">
                  <span className="seller-stat-value">{sellerStats.avgRating.toFixed(1)}</span>
                  <span className="seller-stat-label">{t('creators.avgRating')}</span>
                </div>
              </div>
              <div className="seller-stat-card">
                <MessageCircle className="seller-stat-icon" />
                <div className="seller-stat-content">
                  <span className="seller-stat-value">{sellerStats.totalReviews.toLocaleString()}</span>
                  <span className="seller-stat-label">{t('creators.totalReviews')}</span>
                </div>
              </div>
            </div>
            {sellerStats.categoryData.length > 0 && (
              <div className="seller-chart-wrap">
                <h3 className="seller-chart-title">{t('creators.categoryDistribution')}</h3>
                <div className="seller-chart-inner">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={sellerStats.categoryData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                      <XAxis type="number" stroke="#6B7280" fontSize={12} />
                      <YAxis type="category" dataKey="name" width={80} stroke="#6B7280" fontSize={12} tick={{ fill: '#374151' }} />
                      <Tooltip
                        cursor={{ fill: '#F3F4F6' }}
                        formatter={(value) => [value, t('creators.productsCount')]}
                        contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB' }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {sellerStats.categoryData.map((_, idx) => (
                          <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </section>

          {/* 판매 중인 AI 상품 목록 */}
          <section className="seller-products-section">
            <h2 className="seller-products-title">
              {t('creators.productsTitle')} <span className="seller-products-count">({products.length})</span>
            </h2>

            {products.length === 0 ? (
              <div className="seller-empty-products">
                <p>{t('creators.noProducts')}</p>
              </div>
            ) : (
              <div className="seller-products-grid">
                {products.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`} className="seller-product-card">
                    <div className="seller-product-image">
                      <img
                        src={`${API_URL}/${product.imageUrl}`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('fallback');
                          e.target.parentElement.textContent = product.name?.substring(0, 2) || 'AI';
                        }}
                      />
                    </div>
                    <div className="seller-product-body">
                      <span className="seller-product-category">{product.category_name || product.category_name_en || '-'}</span>
                      <h3 className="seller-product-name">{product.name}</h3>
                      <div className="seller-product-rating">
                        <span className="rating-stars">★</span>
                        <span>{parseFloat(product.rating_average || 0).toFixed(1)}</span>
                        <span className="rating-count">({product.rating_count || 0})</span>
                      </div>
                      <div className="seller-product-footer">
                        <span className="seller-product-price">¥{(product.price || 0).toLocaleString()}</span>
                        <span className="seller-product-downloads">{t('creators.downloads')} {product.download_count || 0}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <FollowListModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        userId={creator.id}
        type="followers"
        userRole="admin"
      />
    </div>
  );
}
