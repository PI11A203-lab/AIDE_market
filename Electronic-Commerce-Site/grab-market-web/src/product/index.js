import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import ProductHeader from './components/ProductHeader';
import ProfileHeader from './components/ProfileHeader';
import TabNavigation from './components/TabNavigation';
import PriceSidebar from './components/PriceSidebar';
import TrustBadges from './components/TrustBadges';
import { API_URL } from '../config/constants';
import { api } from '../config/api';
import { getRatingCache, setRatingCache } from '../utils/ratingCache';
import "./index.css";

export default function ProductPage() {
  const { id } = useParams();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiked, setIsLiked] = useState(false);
  const [developer, setDeveloper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        // 상품 정보 가져오기
        const productResponse = await axios.get(`${API_URL}/api/products/${id}`);
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

          const reviewsResponse = await api.reviews.getByProduct(parseInt(id));
          const reviewsData = reviewsResponse.data?.reviews || [];
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
              helpful: 0,
              isCurrentUser: isCurrentUser, // 본인 리뷰 여부
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

  // 장바구니에 상품 추가하는 함수
  const addToCart = (productId) => {
    try {
      const savedCart = localStorage.getItem('cart');
      let cartItemIds = savedCart ? JSON.parse(savedCart) : [];
      
      // 이미 장바구니에 있는지 확인
      if (!cartItemIds.includes(productId)) {
        cartItemIds.push(productId);
        localStorage.setItem('cart', JSON.stringify(cartItemIds));
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  // "今すぐ買う" 버튼 클릭 핸들러 - 장바구니에 추가하지 않고 바로 구매 페이지로 이동
  const handleBuyNow = () => {
    if (developer && developer.id) {
      // URL 파라미터로 상품 ID 전달 (바로 구매 모드)
      history.push(`/purchase?buyNow=${developer.id}`);
    }
  };

  // "カートに入れる" 버튼 클릭 핸들러
  const handleAddToCart = () => {
    if (developer && developer.id) {
      addToCart(developer.id);
      // 성공 메시지 표시 (선택사항)
      message.success('カートに追加しました');
    }
  };

  // 찜목록 토글 핸들러
  const handleLikeToggle = async () => {
    if (!user) {
      message.warning('로그인이 필요합니다.');
      return;
    }

    try {
      if (isLiked) {
        // 찜목록에서 제거
        await api.favorites.delete(user.id, developer.id);
        setIsLiked(false);
        message.success('찜목록에서 제거되었습니다.');
      } else {
        // 찜목록에 추가
        await api.favorites.create({
          user_id: user.id,
          product_id: developer.id,
        });
        setIsLiked(true);
        message.success('찜목록에 추가되었습니다.');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      message.error('찜목록 업데이트에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-xl text-gray-600 mb-4">商品が見つかりませんでした</div>
          <div className="text-gray-500 mb-2">商品ID: {id}</div>
          <div className="text-sm text-gray-400 mb-4">
            API: {API_URL}/api/products/{id}
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
            <div className="text-sm text-red-800 font-semibold mb-2">エラー情報:</div>
            <div className="text-xs text-red-600">
              サーバーエラーが発生しました。データベースの問題の可能性があります。
              <br />
              ブラウザのコンソールで詳細を確認してください。
            </div>
          </div>
          <div className="mt-4">
            <a href="/" className="text-blue-600 hover:underline">
              メインページに戻る
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader />

      <main className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="col-span-2">
            <ProfileHeader 
              developer={developer} 
              isLiked={isLiked} 
              onLikeToggle={handleLikeToggle} 
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

                    const reviewsResponse = await api.reviews.getByProduct(parseInt(id));
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
                        helpful: 0,
                        isCurrentUser: isCurrentUser,
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
                    }
                  } catch (error) {
                    console.error('Failed to reload reviews:', error);
                  }
                }
              }} 
            />
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            <PriceSidebar 
              developer={developer} 
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
            />
            <TrustBadges />
          </div>
        </div>
      </main>
    </div>
  );
}