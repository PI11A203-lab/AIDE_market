import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../../config/api';
import { API_URL } from '../../../config/constants';
import ProfileHeader from '../../profile/components/ProfileHeader';
import FollowButton from '../../profile/components/FollowButton';
import FollowListModal from '../../profile/components/FollowListModal';
import { Github } from 'lucide-react';
import '../index.css';

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

  // localStorage에서 언어 설정 불러오기 (메인 페이지에서 변경된 언어 반영)
  useEffect(() => {
    const syncLanguage = () => {
      const savedLanguage = localStorage.getItem('appLanguage');
      if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage) && savedLanguage !== i18n.language) {
        // 저장된 언어로 강제 변경
        i18n.changeLanguage(savedLanguage);
      }
    };

    // 컴포넌트 마운트 시 언어 동기화
    syncLanguage();

    // storage 이벤트 리스너 추가 (다른 탭에서 언어 변경 시 감지)
    const handleStorageChange = (e) => {
      if (e.key === 'appLanguage') {
        syncLanguage();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // i18n 언어 변경 이벤트 구독
    i18n.on('languageChanged', syncLanguage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      i18n.off('languageChanged', syncLanguage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        setCurrentUserId(userData.id);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    // 크리에이터 정보 가져오기
    const loadCreatorData = async () => {
      try {
        // 사용자 정보 가져오기
        const userResponse = await api.users.getById(id);
        const userData = userResponse.data.user;

        if (userData.role !== 'admin') {
          // admin이 아니면 에러 처리
          history.push('/creators');
          return;
        }

        // 프로필 이미지 URL 생성
        const avatarDisplay = userData.profile_image 
          ? `${API_URL}/${userData.profile_image}`
          : null;

        setCreator({
          id: userData.id,
          name: userData.username || 'User',
          username: `@${userData.username}`,
          initials: (userData.username || 'User').substring(0, 2).toUpperCase(),
          profile_image: userData.profile_image || null,
          avatarDisplay,
          github_url: userData.github_url || null,
          tags: Array.isArray(userData.tags) ? userData.tags.map(t => typeof t === 'object' ? t.name : t) : [],
          email: userData.email || null,
          is_email_public: userData.is_email_public || false,
          joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : i18n.language === 'ja' ? 'ja-JP' : 'en-US', { year: 'numeric', month: 'long' }) : 'January 2025',
          follower_count: userData.follower_count || 0
        });

        // 팔로워 수 가져오기
        try {
          const followersResponse = await api.users.getFollowers(userData.id, { page: 1, limit: 1 });
          setFollowerCount(followersResponse.data.pagination?.total || userData.follower_count || 0);
        } catch (error) {
          console.error('팔로워 수 로드 실패:', error);
          setFollowerCount(userData.follower_count || 0);
        }

        // 판매 중인 AI 리스트 가져오기 (seller 필드로 필터링)
        try {
          // 더 많은 상품을 가져오기 위해 limit을 늘림
          const productsResponse = await api.products.getList({ limit: 500 });
          const allProducts = productsResponse.data?.products || productsResponse.data || [];
          
          // seller 필드가 정확히 일치하는 상품만 필터링
          const creatorProducts = allProducts.filter(
            product => product.seller && product.seller.trim() === userData.username.trim()
          );

          // 다운로드 순으로 정렬
          creatorProducts.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
          
          setProducts(creatorProducts);
        } catch (error) {
          console.error('상품 목록 로드 실패:', error);
          setProducts([]);
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
    // 팔로우 변경 시 데이터 새로고침
    if (creator && creator.id) {
      try {
        const followersResponse = await api.users.getFollowers(creator.id, { page: 1, limit: 1 });
        setFollowerCount(followersResponse.data.pagination?.total || 0);
        
        // 크리에이터 정보도 새로고침
        const userResponse = await api.users.getById(creator.id);
        const userData = userResponse.data.user;
        setCreator(prev => prev ? {
          ...prev,
          follower_count: userData.follower_count || 0
        } : null);
      } catch (error) {
        console.error('팔로워 수 업데이트 실패:', error);
      }
    }
  };

  // 깃허브 사용자명 추출
  const getGithubUsername = () => {
    if (!creator || !creator.github_url) return null;
    try {
      const url = new URL(creator.github_url);
      const pathParts = url.pathname.split('/').filter(p => p);
      return pathParts[pathParts.length - 1] || null;
    } catch (e) {
      return null;
    }
  };

  const githubUsername = creator ? getGithubUsername() : null;

  if (loading) {
    return (
      <div className="creator-detail-page">
        <ProfileHeader />
        <main className="creator-detail-main">
          <div className="creator-detail-container">
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
              {t('common.loading')}
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
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
              {t('creators.notFound')}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="creator-detail-page">
      <ProfileHeader />
      <main className="creator-detail-main">
        <div className="creator-detail-container">
          {/* 크리에이터 헤더 섹션 */}
          <div className="creator-hero">
            <div className="creator-hero-content">
              <div className="creator-avatar-section">
                <div className="creator-avatar-hero">
                  {creator.avatarDisplay ? (
                    <img 
                      src={creator.avatarDisplay} 
                      alt={creator.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.textContent = creator.initials;
                      }}
                    />
                  ) : (
                    creator.initials
                  )}
                </div>
              </div>
              
              <div className="creator-info-section">
                <h1 className="creator-detail-name">{creator.name}</h1>
                <p className="creator-detail-username">{creator.username}</p>
                
                <div className="creator-meta-row">
                  {creator.github_url && (
                    <a 
                      href={creator.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="creator-github-link"
                    >
                      <Github className="w-5 h-5" />
                      {githubUsername ? `@${githubUsername}` : 'GitHub'}
                    </a>
                  )}
                  
                  <span
                    className="creator-follower-count"
                    onClick={() => setShowFollowersModal(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{followerCount || 0}</strong> {t('profile.hero.followers')}
                  </span>
                  
                  {currentUserId && currentUserId !== creator.id && (
                    <FollowButton
                      targetUserId={creator.id}
                      targetUsername={creator.name}
                      currentUserId={currentUserId}
                      onFollowChange={handleFollowChange}
                      className="creator-follow-btn"
                    />
                  )}
                  
                  {!currentUserId && (
                    <button
                      className="creator-follow-btn"
                      onClick={() => history.push('/login')}
                      type="button"
                    >
                      {t('creators.follow')}
                    </button>
                  )}
                </div>

                {creator.is_email_public && creator.email && (
                  <p className="creator-email">{creator.email}</p>
                )}

                {creator.tags && creator.tags.length > 0 && (
                  <div className="creator-tags-section">
                    {creator.tags.map((tag, idx) => (
                      <span key={idx} className="creator-tag-item">#{tag}</span>
                    ))}
                  </div>
                )}

                <p className="creator-join-date">{t('creators.joinDate')} {creator.joinDate}</p>
              </div>
            </div>
          </div>

          {/* 판매 중인 AI 섹션 */}
          <div className="creator-products-section">
            <h2 className="creator-section-title">{t('creators.productsTitle')}</h2>
            
            {products.length === 0 ? (
              <div className="creator-empty-state">
                <p>{t('creators.noProducts')}</p>
              </div>
            ) : (
              <div className="creator-products-grid">
                {products.map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/products/${product.id}`}
                    className="creator-product-card"
                  >
                    <div className="creator-product-image">
                      <img
                        src={`${API_URL}/${product.imageUrl}`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.textContent = product.name.substring(0, 2);
                        }}
                      />
                    </div>
                    <div className="creator-product-info">
                      <div className="creator-product-category">
                        {product.category_name || t('product.admin.detail.info.category')}
                      </div>
                      <h3 className="creator-product-name">{product.name}</h3>
                      <div className="creator-product-rating">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#FCD34D" stroke="#FCD34D">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span>{parseFloat(product.rating_average || 0).toFixed(1)}</span>
                        <span>({product.rating_count || 0})</span>
                      </div>
                      <div className="creator-product-footer">
                        <span className="creator-product-price">¥{product.price?.toLocaleString() || 0}</span>
                        <span className="creator-product-downloads">
                          {t('creators.downloads')} {product.download_count || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 팔로워 목록 모달 */}
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

