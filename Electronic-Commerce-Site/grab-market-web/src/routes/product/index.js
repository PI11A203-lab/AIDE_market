import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import ProductHeader from './components/ProductHeader';
import ProfileHeader from './components/ProfileHeader';
import TabNavigation from './components/TabNavigation';
import PriceSidebar from './components/PriceSidebar';
import TrustBadges from './components/TrustBadges';
import ShareModal from './components/ShareModal';
import ProductList from '../home/components/ProductList';
import { API_URL } from '../../config/constants';
import { api } from '../../config/api';
import { getRatingCache, setRatingCache } from '../../utils/ratingCache';
import "./index.css";

export default function ProductPage() {
  const { id } = useParams();
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiked, setIsLiked] = useState(false);
  const [developer, setDeveloper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [templateProducts, setTemplateProducts] = useState([]);
  const [templateName, setTemplateName] = useState(null);

  // localStorage에서 언어 설정 불러오기 (메인 페이지에서 변경된 언어 반영)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 사용자 정보 및 찜목록 상태 확인
  useEffect(() => {
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        setUser(userData);
        // 찜목록 확인
        checkFavoriteStatus(userData.id, parseInt(id));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, [id]);

  // 찜목록 상태 확인
  const checkFavoriteStatus = async (userId, productId) => {
    try {
      const response = await api.favorites.check(userId, productId);
      setIsLiked(response.data?.isFavorite || false);
    } catch (error) {
      // 찜목록이 없으면 false
      setIsLiked(false);
    }
  };

  // 상품 정보 및 리뷰 로드
  useEffect(() => {
    setLoading(true);
    
    const loadData = async () => {
      try {
        // 사용자 정보 가져오기
        const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
        let currentUserId = null;
        if (userFromStorage) {
          try {
            const userData = JSON.parse(userFromStorage);
            currentUserId = userData.id;
          } catch (e) {
            console.error('Failed to parse user data:', e);
          }
        }

        // 상품 정보 가져오기
        const productResponse = await axios.get(`${API_URL}/api/products/${id}`, {
          params: currentUserId ? { user_id: currentUserId } : {}
        });
        const product = productResponse.data?.product;
        
        if (!product) {
          console.error('Product not found');
          setDeveloper(null);
          setLoading(false);
          return;
        }
        
        // 별점 캐시 확인 및 업데이트
        const cachedRating = getRatingCache(parseInt(id));
        let ratingAverage = product.rating_average || 0;
        let ratingCount = product.rating_count || 0;
        
        // 캐시가 있고 최신이면 캐시 사용, 아니면 API 값 사용하고 캐시 갱신
        if (cachedRating) {
          ratingAverage = cachedRating.rating_average;
          ratingCount = cachedRating.rating_count;
        } else {
          // API에서 받은 값으로 캐시 저장
          setRatingCache(parseInt(id), ratingAverage, ratingCount);
        }
        
        const stats = productResponse.data?.stats || {};
        const tags = productResponse.data?.tags || [];
        
        // 리뷰 가져오기
        let mappedReviews = [];
        try {
          // 로그인한 유저 정보 가져오기 (프로필에서 사용하는 방식과 동일)
          const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
          let currentUser = null;
          if (userFromStorage) {
            try {
              currentUser = JSON.parse(userFromStorage);
            } catch (e) {
              console.error('Failed to parse user data:', e);
            }
          }

          const reviewsResponse = await api.reviews.getByProduct(parseInt(id), {
            user_id: currentUser?.id || null
          });
          const reviewsData = reviewsResponse.data?.reviews || [];
          console.log('리뷰 API 응답 샘플:', reviewsData[0] ? {
            id: reviewsData[0].id,
            user: reviewsData[0].user,
            developer_type: reviewsData[0].user?.developer_type
          } : '리뷰 없음');
          mappedReviews = reviewsData.map((review) => {
            // 리뷰 작성자가 현재 로그인한 유저인지 확인
            const isCurrentUser = currentUser && (
              review.user_id === currentUser.id ||
              review.user?.id === currentUser.id
            );

            // 현재 로그인한 유저의 리뷰면 로그인한 유저의 닉네임 사용
            const displayUserName = isCurrentUser
              ? (currentUser.nickname || currentUser.username || currentUser.name || 'Anonymous')
              : (review.user?.nickname ||
                  review.user?.username ||
                  review.user?.name ||
                  'Anonymous');

            const rawRating = review.rating ?? review.score ?? 0;
            const numericRating = Number(rawRating) || 0;

            return {
              id: review.id,
              author: displayUserName,
              avatar: (displayUserName || 'A').substring(0, 2).toUpperCase(),
              rating: numericRating,
              title: review.title || null,
              text: review.review_text || review.comment || review.text || '',
              review_images: review.review_images || [],
              date: review.created_at
                ? new Date(review.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '',
              project:
                review.order_item?.product?.name ||
                product.name ||
                'Project',
              helpful: review.helpful_count || 0,
              is_helpful: review.is_helpful || false,
              isCurrentUser: isCurrentUser, // 본인 리뷰 여부
              developer_type: review.user?.developer_type || null, // 개발자 타입
            };
          });
          setReviews(mappedReviews);
        } catch (error) {
          console.error('Failed to load reviews:', error);
          mappedReviews = [];
          setReviews([]);
        }
        
        // 다운로드 수 포맷팅
        const formatDownloads = (count) => {
          if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
          }
          return count.toString();
        };

        // 구매 완료 여부 확인
        const purchased = product.is_purchased === 1 || product.is_purchased === true;
        setIsPurchased(purchased);

        // API 응답을 developer 형식으로 변환
        setDeveloper({
          id: product.id,
          name: product.name,
          username: product.name.toLowerCase().replace(/\s+/g, '_'),
          avatar: product.name.substring(0, 2),
          rank: 1, // 랭킹은 별도로 계산 필요
          skill: stats.teamwork !== undefined && stats.stability !== undefined && stats.speed !== undefined && stats.creativity !== undefined && stats.productivity !== undefined && stats.maintainability !== undefined
            ? Math.round((stats.teamwork + stats.stability + stats.speed + stats.creativity + stats.productivity + stats.maintainability) / 6)
            : 95,
          price: product.price,
          imageUrl: product.imageUrl,
          downloads: formatDownloads(product.download_count || 0),
          likes: 0, // API에 없음
          rating: parseFloat(ratingAverage || 0).toFixed(1),
          reviewCount: ratingCount || 0,
          category: product.category_name || 'NLP',
          tags: tags.map(tag => tag.name || tag),
          location: 'San Francisco, CA', // API에 없음
          joined: product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2023',
          responseTime: '< 2 hours', // API에 없음
          completionRate: '99%', // API에 없음
          bio: product.description || 'Specialized in building production-ready AI systems.',
          hexagonStats: stats.teamwork !== undefined ? [
            { stat: 'Teamwork', value: stats.teamwork },
            { stat: 'Stability', value: stats.stability },
            { stat: 'Speed', value: stats.speed },
            { stat: 'Creativity', value: stats.creativity },
            { stat: 'Productivity', value: stats.productivity },
            { stat: 'Maintainability', value: stats.maintainability }
          ] : [
            { stat: 'Technical', value: 98 },
            { stat: 'Communication', value: 95 },
            { stat: 'Creativity', value: 92 },
            { stat: 'Speed', value: 96 },
            { stat: 'Reliability', value: 99 },
            { stat: 'Innovation', value: 94 }
          ],
          projects: [],
          reviews: mappedReviews
        });
        setLoading(false);
      } catch (error) {
        console.error('エラー発生 : ', error);
        console.error('Error response:', error.response);
        console.error('Error message:', error.message);
        console.error('API URL:', `${API_URL}/api/products/${id}`);
        
        if (error.response) {
          const status = error.response.status;
          const errorData = error.response.data;
          console.error('Status:', status);
          console.error('Error Data:', errorData);
          
          if (errorData?.sql || errorData?.sqlMessage) {
            console.error('SQL Error:', errorData.sqlMessage);
            console.error('SQL Query:', errorData.sql);
          }
        }
        
        setDeveloper(null);
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // 장바구니에 상품 추가하는 함수 (DB API 사용)
  const addToCart = async (productId) => {
    try {
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userFromStorage) {
        message.warning(t('product.messages.loginRequired'));
        history.push('/login');
        return;
      }

      const userData = JSON.parse(userFromStorage);
      const userId = userData.id;

      // API로 장바구니에 추가
      await api.carts.addItem({
        user_id: userId,
        product_id: productId,
        quantity: 1
      });

      message.success(t('product.messages.addToCartSuccess'));
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error.response?.data?.error || t('product.messages.addToCartFail');
      message.error(errorMessage);
    }
  };

  // "今すぐ買う" 버튼 클릭 핸들러 - 장바구니에 추가하지 않고 바로 구매 페이지로 이동
  const handleBuyNow = () => {
    if (isPurchased) {
      message.warning(t('product.messages.alreadyPurchased'));
      return;
    }
    if (developer && developer.id) {
      // URL 파라미터로 상품 ID 전달 (바로 구매 모드)
      history.push(`/purchase?buyNow=${developer.id}`);
    }
  };

  // "カートに入れる" 버튼 클릭 핸들러
  const handleAddToCart = async () => {
    if (isPurchased) {
      message.warning(t('product.messages.alreadyPurchased'));
      return;
    }
    if (developer && developer.id) {
      await addToCart(developer.id);
    }
  };

  // 템플릿 관련 상품 로드
  const loadTemplateProducts = async (productId) => {
    try {
      const response = await api.templates.getByProduct(productId);
      const templates = response.data.templates || [];
      
      if (templates.length > 0) {
        // 첫 번째 템플릿의 상품들을 가져옴
        const firstTemplate = templates[0];
        setTemplateName(firstTemplate.name);
        
        // 템플릿 상세 정보 가져오기
        const templateDetailResponse = await api.templates.getDetail(firstTemplate.id);
        const templateProductsData = templateDetailResponse.data.template?.products || [];
        
        // 현재 상품을 제외한 상품들만 표시
        const otherProducts = templateProductsData.filter(p => p.id !== productId);
        setTemplateProducts(otherProducts.slice(0, 6)); // 최대 6개만 표시
      }
    } catch (error) {
      console.error('템플릿 상품 로드 실패:', error);
      // API가 없을 수 있으므로 빈 배열로 초기화
      setTemplateProducts([]);
    }
  };

  // 찜목록 토글 핸들러
  const handleLikeToggle = async () => {
    if (!user) {
      message.warning(t('product.messages.loginRequired'));
      return;
    }

    try {
      if (isLiked) {
        // 찜목록에서 제거
        await api.favorites.delete(user.id, developer.id);
        setIsLiked(false);
        message.success(t('product.messages.favoriteRemoved'));
      } else {
        // 찜목록에 추가
        await api.favorites.create({
          user_id: user.id,
          product_id: developer.id,
        });
        setIsLiked(true);
        message.success(t('product.messages.favoriteAdded'));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      message.error(t('product.messages.favoriteUpdateFail'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-xl text-gray-600 mb-4">{t('product.notFound.title')}</div>
          <div className="text-gray-500 mb-2">{t('product.notFound.subtitle', { id })}</div>
          <div className="text-sm text-gray-400 mb-4">
            {t('product.notFound.apiUrl', { url: `${API_URL}/api/products/${id}` })}
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
            <div className="text-sm text-red-800 font-semibold mb-2">{t('product.notFound.errorInfo')}</div>
            <div className="text-xs text-red-600">
              {t('product.notFound.errorMessage')}
              <br />
              {t('product.notFound.errorDetail')}
            </div>
          </div>
          <div className="mt-4">
            <a href="/" className="text-blue-600 hover:underline">
              {t('product.notFound.backToHome')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ProductHeader />

      <main className="max-w-[1400px] mx-auto px-12 py-8 pb-20">
        <div className="grid grid-cols-[1fr_400px] gap-8">
          {/* 메인 컨텐츠 */}
          <div>
            <ProfileHeader 
              developer={developer} 
              isLiked={isLiked} 
              onLikeToggle={handleLikeToggle}
              onShare={() => setShowShareModal(true)}
            />
            <TabNavigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              developer={{ 
                ...developer, 
                reviews,
                onReviewUpdate: async () => {
                  // 리뷰 목록 새로고침
                  try {
                    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
                    let currentUser = null;
                    if (userFromStorage) {
                      try {
                        currentUser = JSON.parse(userFromStorage);
                      } catch (e) {
                        console.error('Failed to parse user data:', e);
                      }
                    }

                    // 상품 정보 먼저 가져오기
                    const productResponse = await axios.get(`${API_URL}/api/products/${id}`);
                    const updatedProduct = productResponse.data?.product;

                    const reviewsResponse = await api.reviews.getByProduct(parseInt(id), {
                      user_id: currentUser?.id || null
                    });
                    const reviewsData = reviewsResponse.data?.reviews || [];
                    const updatedReviews = reviewsData.map((review) => {
                      const isCurrentUser = currentUser && (
                        review.user_id === currentUser.id ||
                        review.user?.id === currentUser.id
                      );

                      const displayUserName = isCurrentUser
                        ? (currentUser.nickname || currentUser.username || currentUser.name || 'Anonymous')
                        : (review.user?.nickname ||
                            review.user?.username ||
                            review.user?.name ||
                            'Anonymous');

                      const rawRating = review.rating ?? review.score ?? 0;
                      const numericRating = Number(rawRating) || 0;

                      return {
                        id: review.id,
                        author: displayUserName,
                        avatar: (displayUserName || 'A').substring(0, 2).toUpperCase(),
                        rating: numericRating,
                        title: review.title || null,
                        text: review.review_text || review.comment || review.text || '',
                        review_images: review.review_images || [],
                        date: review.created_at
                          ? new Date(review.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : '',
                        project: updatedProduct?.name || developer?.name || 'Project',
                        helpful: review.helpful_count || 0,
                        is_helpful: review.is_helpful || false,
                        isCurrentUser: isCurrentUser,
                        developer_type: review.user?.developer_type || null, // 개발자 타입
                      };
                    });
                    setReviews(updatedReviews);
                    if (updatedProduct) {
                      // 리뷰 삭제/수정 후에는 항상 최신 상품 정보 사용
                      const ratingAverage = updatedProduct.rating_average || 0;
                      const ratingCount = updatedProduct.rating_count || 0;
                      
                      // 캐시 업데이트 (최신 정보로)
                      setRatingCache(parseInt(id), ratingAverage, ratingCount);

        setDeveloper(prev => ({
          ...prev,
          rating: parseFloat(ratingAverage || 0).toFixed(1),
          reviewCount: ratingCount || 0,
        }));
        
        // 템플릿 관련 상품 로드
        loadTemplateProducts(parseInt(id));
                    }
                  } catch (error) {
                    console.error('Failed to reload reviews:', error);
                  }
                },
                onHelpfulUpdate: (reviewId, helpfulCount, isHelpful) => {
                  // helpful 즉시 업데이트
                  setReviews(prevReviews => 
                    prevReviews.map(r => 
                      r.id === reviewId 
                        ? { 
                            ...r, 
                            helpful: helpfulCount || 0,
                            is_helpful: isHelpful
                          }
                        : r
                    )
                  );
                }
              }} 
            />
          </div>

          {/* 사이드바 */}
          <div className="flex flex-col gap-5 sticky top-[100px] self-start">
            <PriceSidebar 
              developer={developer} 
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
              isPurchased={isPurchased}
            />
            <TrustBadges />
          </div>
        </div>

        {/* 템플릿 추천 섹션 */}
        {templateProducts.length > 0 && templateName && (
          <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #E5E7EB' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
                이 템플릿에 포함된 상품
              </h2>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                "{templateName}" 템플릿의 다른 AI 상품들
              </p>
            </div>
            <ProductList products={templateProducts} />
          </div>
        )}
      </main>

      {/* 공유 모달 */}
      {developer && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          productName={developer.name}
          productUrl={window.location.href}
        />
      )}
    </div>
  );
}