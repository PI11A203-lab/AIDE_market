import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import ProfileHeader from '../profile/components/ProfileHeader';
import ProductProfileHeader from './components/ProfileHeader';
import TabNavigation from './components/TabNavigation';
import PriceSidebar from './components/PriceSidebar';
import TrustBadges from './components/TrustBadges';
import ShareModal from './components/ShareModal';
import ProductList from '../home/components/ProductList';
import '../home/index.css';
import { API_URL } from '../../config/constants';
import { api } from '../../config/api';
import { getRatingCache, setRatingCache } from '../../utils/ratingCache';
import "./index.css";
import '../profile/index.css';
import '../templates/index.css';

// Mock 리뷰 데이터 생성 함수
const generateMockReviews = (productId, reviewCount, productName) => {
  // 상품 ID를 seed로 사용한 간단한 랜덤 생성기
  const getRandom = (currentSeed) => {
    const newSeed = (currentSeed * 9301 + 49297) % 233280;
    return { value: newSeed / 233280, seed: newSeed };
  };

  // 개발자 타입 목록
  const developerTypes = [
    'フルスタック開発者',
    'フロントエンド開発者',
    'バックエンド開発者',
    'モバイル開発者',
    'データサイエンティスト',
    '機械学習エンジニア',
    'DevOpsエンジニア',
    'UI/UXデザイナー',
    'QAエンジニア',
    'セキュリティエンジニア'
  ];

  // 닉네임 후보 목록
  const nicknames = [
    'nana', 'taro', 'hanako', 'sato', 'yamada', 'tanaka', 'watanabe', 'ito', 'nakamura', 'kobayashi',
    'kato', 'yoshida', 'yamamoto', 'suzuki', 'saito', 'matsumoto', 'inoue', 'kimura', 'hayashi', 'shimizu',
    'yamaguchi', 'mori', 'abe', 'okada', 'goto', 'hasegawa', 'ishida', 'sasaki', 'fujita', 'endo',
    'aoki', 'fukuda', 'nishimura', 'miura', 'takagi', 'okamoto', 'maeda', 'fujii', 'nakajima', 'harada',
    'ono', 'tamura', 'takeuchi', 'kaneko', 'wada', 'nakagawa', 'ishikawa', 'ueda', 'morita', 'hirai'
  ];

  // 리뷰 제목 후보 (긍정적)
  const reviewTitles = [
    '素晴らしい商品です',
    '期待以上の品質',
    'とても満足しています',
    '使いやすくて便利',
    '高品質なサービス',
    'おすすめです',
    '期待通りでした',
    '価格以上の価値',
    '迅速な対応',
    'プロフェッショナル',
    '優れたパフォーマンス',
    '完璧なソリューション',
    '信頼できる開発者',
    '丁寧なサポート',
    '革新的なアプローチ'
  ];

  // 리뷰 텍스트 후보 (긍정적)
  const reviewTexts = [
    'この商品は期待以上の品質でした。非常に満足しています。',
    '使いやすく、機能も充実しています。おすすめです。',
    'プロフェッショナルな対応で、迅速に問題を解決していただきました。',
    '価格以上の価値があると思います。今後も利用したいです。',
    '高品質なサービスで、期待通りでした。',
    '優れたパフォーマンスと丁寧なサポートに感謝しています。',
    '革新的なアプローチで、ビジネスに大きな価値をもたらしました。',
    '信頼できる開発者で、安心して依頼できます。',
    '完璧なソリューションを提供していただき、ありがとうございました。',
    '非常に満足しています。また利用したいと思います。'
  ];

  // 낮은 별점 리뷰 제목 후보
  const lowRatingTitles = [
    '改善の余地があります',
    '期待していたものと違いました',
    'もう少し検討が必要',
    '機能が限定的でした',
    'サポートが不十分でした'
  ];

  // 낮은 별점 리뷰 텍스트 후보
  const lowRatingTexts = [
    '期待していた機能が一部不足していました。改善を期待します。',
    '基本的な機能は動作しますが、もう少し使いやすさが向上すると良いと思います。',
    '価格に対して機能が限定的でした。',
    'サポート対応がもう少し迅速だと良いと思います。',
    '全体的には問題ありませんが、いくつか改善点があります。'
  ];

  const mockReviews = [];
  const now = new Date();

  for (let i = 0; i < reviewCount; i++) {
    let currentSeed = productId + i;

    // 랜덤 값 생성 헬퍼 함수
    const getNextRandom = () => {
      const result = getRandom(currentSeed);
      currentSeed = result.seed;
      return result.value;
    };

    // 일부 상품에만 1-2점 리뷰 포함 (productId를 기반으로 결정)
    // productId가 짝수인 경우에만 1-2점 리뷰 포함
    const includeLowRatings = productId % 2 === 0;
    
    // 별점 생성
    let rating, titleIndex, textIndex;
    const randomValue = getNextRandom();
    
    if (includeLowRatings && randomValue < 0.08) {
      // 8% 확률로 1-2점 리뷰 생성 (일부 상품에만)
      rating = Math.floor(getNextRandom() * 2) + 1; // 1-2점
      titleIndex = Math.floor(getNextRandom() * lowRatingTitles.length);
      textIndex = Math.floor(getNextRandom() * lowRatingTexts.length);
    } else {
      // 나머지는 3-5점 리뷰
      rating = Math.floor(getNextRandom() * 3) + 3; // 3-5점
      titleIndex = Math.floor(getNextRandom() * reviewTitles.length);
      textIndex = Math.floor(getNextRandom() * reviewTexts.length);
    }
    
    const ratingDecimal = getNextRandom() < 0.3 ? 0.5 : 0; // 30% 확률로 0.5점 추가
    const finalRating = rating + ratingDecimal;

    const nicknameIndex = Math.floor(getNextRandom() * nicknames.length);
    const nickname = nicknames[nicknameIndex];
    const developerTypeIndex = Math.floor(getNextRandom() * developerTypes.length);
    const developerType = developerTypes[developerTypeIndex];

    // 날짜 생성 (최근 1년 내 랜덤)
    const daysAgo = Math.floor(getNextRandom() * 365);
    const reviewDate = new Date(now);
    reviewDate.setDate(reviewDate.getDate() - daysAgo);

    const helpfulCount = Math.floor(getNextRandom() * 20); // 0-19 helpful

    mockReviews.push({
      id: `mock_${productId}_${i}`,
      author: nickname,
      avatar: nickname.substring(0, 2).toUpperCase(),
      rating: finalRating,
      title: (rating <= 2 ? lowRatingTitles : reviewTitles)[titleIndex],
      text: (rating <= 2 ? lowRatingTexts : reviewTexts)[textIndex],
      review_images: [],
      date: reviewDate.toISOString(), // ISO 형식으로 저장 (언어별 포맷팅은 컴포넌트에서 처리)
      project: productName,
      helpful: helpfulCount,
      is_helpful: false,
      isCurrentUser: false,
      developer_type: developerType,
    });
  }

  return mockReviews;
};

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
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [viewedProducts, setViewedProducts] = useState([]);
  const sidebarRef = React.useRef(null);
  const [sidebarTop, setSidebarTop] = useState(90);

  // 스크롤 이벤트로 사이드바 고정 처리
  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        const headerHeight = 78; // ProfileHeader 높이
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 0) {
          const newTop = Math.max(headerHeight + 12, 90);
          setSidebarTop(newTop);
        } else {
          setSidebarTop(90);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 실행
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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
              date: review.created_at || '',
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

          // API 리뷰가 부족하면 mock 리뷰로 보완
          if (mappedReviews.length < ratingCount) {
            const neededCount = ratingCount - mappedReviews.length;
            const mockReviews = generateMockReviews(parseInt(id), neededCount, product.name);
            mappedReviews = [...mappedReviews, ...mockReviews];
          } else if (mappedReviews.length === 0 && ratingCount > 0) {
            // API 리뷰가 없지만 reviewCount가 있으면 모두 mock으로 생성
            mappedReviews = generateMockReviews(parseInt(id), ratingCount, product.name);
          }

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
          joined: product.createdAt || new Date().toISOString(), // ISO 형식으로 저장 (언어별 포맷팅은 컴포넌트에서 처리)
          responseTime: '2 hours', // API에 없음
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
        
        // 추천 상품 로드
        loadRecommendedProducts(product, tags, parseInt(id));
        
        // 다른 고객들이 자주 조회하는 상품 로드
        loadViewedProducts(parseInt(id));
        
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

  // "팀 구성에 추가" 버튼 클릭 핸들러
  const handleAddToTeam = async () => {
    if (!user) {
      message.warning(t('product.messages.loginRequired'));
      history.push('/login');
      return;
    }

    if (isPurchased) {
      message.warning(t('product.messages.alreadyPurchased'));
      return;
    }

    if (!developer || !developer.id) {
      message.error(t('notifications.product.productLoadFail'));
      return;
    }

    try {
      const userId = user.id;
      const productId = developer.id;
      
      // 찜목록에 추가 (選択可能なAI開発者 목록에 표시되도록)
      try {
        await api.favorites.create({
          user_id: userId,
          product_id: productId,
        });
        message.success(t('notifications.product.favoriteAdded', { productName: developer.name }));
      } catch (favoriteError) {
        // 이미 찜목록에 있으면 성공으로 처리
        if (favoriteError.response?.status === 400) {
          message.info(t('notifications.product.favoriteAlreadyExists', { productName: developer.name }));
        } else {
          console.error('찜목록 추가 실패:', favoriteError);
          message.warning(t('notifications.product.favoriteAddFail'));
        }
      }
      
      // 팀 페이지로 이동
      setTimeout(() => {
        history.push('/team');
      }, 1000);
    } catch (error) {
      console.error('팀 구성에 추가 실패:', error);
      const errorMessage = error.response?.data?.error || error.message || '팀 구성에 추가에 실패했습니다.';
      message.error(errorMessage);
    }
  };

  // 추천 상품 로드
  const loadRecommendedProducts = async (currentProduct, currentTags, productId) => {
    try {
      const recommended = [];
      const seenIds = new Set([productId]); // 현재 상품 ID 제외

      // 1순위: 시너지 API 사용
      try {
        const synergiesResponse = await api.products.getSynergies(productId, 6);
        const synergies = synergiesResponse.data?.synergies || [];
        synergies.forEach(product => {
          if (product.id && !seenIds.has(product.id)) {
            recommended.push(product);
            seenIds.add(product.id);
          }
        });
      } catch (error) {
        console.log('시너지 API 사용 불가:', error);
      }

      // 2순위: 같은 카테고리 + 공통 태그가 있는 상품
      if (recommended.length < 6 && currentProduct.category_id) {
        try {
          const categoryResponse = await api.products.getByCategory(currentProduct.category_id, {
            limit: 20,
            page: 1
          });
          const categoryProducts = categoryResponse.data?.products || [];
          
          // 태그 ID 추출
          const currentTagIds = currentTags.map(tag => tag.id || tag.tag_id).filter(Boolean);
          
          categoryProducts.forEach(product => {
            if (recommended.length >= 6) return;
            if (product.id && !seenIds.has(product.id)) {
              // 태그가 있으면 태그 유사도 확인, 없으면 그냥 추가
              if (currentTagIds.length > 0 && product.tags) {
                const productTagIds = product.tags.map(t => t.id || t.tag_id).filter(Boolean);
                const commonTags = currentTagIds.filter(id => productTagIds.includes(id));
                if (commonTags.length > 0) {
                  recommended.push(product);
                  seenIds.add(product.id);
                }
              } else if (currentTagIds.length === 0) {
                // 현재 상품에 태그가 없으면 그냥 추가
                recommended.push(product);
                seenIds.add(product.id);
              }
            }
          });
        } catch (error) {
          console.log('카테고리 상품 로드 실패:', error);
        }
      }

      // 3순위: 인기 상품 (평점 높은 순)
      if (recommended.length < 6) {
        try {
          const popularResponse = await api.products.getList({
            limit: 20,
            page: 1,
            sort: 'rating'
          });
          const popularProducts = popularResponse.data?.products || [];
          
          popularProducts.forEach(product => {
            if (recommended.length >= 6) return;
            if (product.id && !seenIds.has(product.id)) {
              recommended.push(product);
              seenIds.add(product.id);
            }
          });
        } catch (error) {
          console.log('인기 상품 로드 실패:', error);
        }
      }

      // ProductList 컴포넌트 형식에 맞게 변환
      const formattedProducts = recommended.slice(0, 6).map(product => ({
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl || product.image_url,
        price: product.price,
        rating: product.rating_average || product.rating || 0,
        rating_average: product.rating_average || product.rating || 0, // ProductList가 rating_average를 사용하므로 추가
        rating_count: product.rating_count || 0,
        download_count: product.download_count || 0,
        category_name: product.category_name || product.category?.name,
        category_id: product.category_id || product.category?.id,
        is_purchased: product.is_purchased || false
      }));

      setRecommendedProducts(formattedProducts);
      console.log('추천 상품 로드 완료:', formattedProducts.length, '개');
      console.log('추천 상품 별점 데이터:', formattedProducts.map(p => ({ name: p.name, rating: p.rating, rating_average: p.rating_average, rating_count: p.rating_count })));
    } catch (error) {
      console.error('추천 상품 로드 실패:', error);
      setRecommendedProducts([]);
    }
  };

  // 다른 고객들이 자주 조회하는 상품 로드 - 6개만
  const loadViewedProducts = async (productId) => {
    try {
      // 조회수 기반으로 정렬된 상품 가져오기
      const response = await api.products.getList({
        limit: 7, // 현재 상품 제외를 위해 7개 가져오기
        page: 1,
        sort: 'views' // 조회수 기준 정렬 (없으면 'popular' 또는 'rating' 사용)
      });
      
      const products = response.data?.products || [];
      
      // 현재 상품 제외하고 6개만
      const filteredProducts = products
        .filter(product => product.id !== productId)
        .slice(0, 6);
      
      // ProductList 컴포넌트 형식에 맞게 변환
      const formattedProducts = filteredProducts.map(product => ({
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl || product.image_url,
        price: product.price,
        rating: product.rating_average || product.rating || 0,
        rating_average: product.rating_average || product.rating || 0, // ProductList가 rating_average를 사용하므로 추가
        rating_count: product.rating_count || 0,
        download_count: product.download_count || 0,
        category_id: product.category_id || product.category?.id,
        category_name: product.category_name || product.category?.name,
        is_purchased: product.is_purchased || false
      }));

      setViewedProducts(formattedProducts);
    } catch (error) {
      console.error('조회 상품 로드 실패:', error);
      // 조회수 정렬이 없으면 인기 상품으로 대체
      try {
        const popularResponse = await api.products.getList({
          limit: 7, // 현재 상품 제외를 위해 7개 가져오기
          page: 1,
          sort: 'rating'
        });
        const popularProducts = popularResponse.data?.products || [];
        const filteredProducts = popularProducts
          .filter(product => product.id !== productId)
          .slice(0, 6);
        
        const formattedProducts = filteredProducts.map(product => ({
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl || product.image_url,
          price: product.price,
          rating: product.rating_average || product.rating || 0,
          rating_average: product.rating_average || product.rating || 0, // ProductList가 rating_average를 사용하므로 추가
          rating_count: product.rating_count || 0,
          download_count: product.download_count || 0,
          category_id: product.category_id || product.category?.id,
          category_name: product.category_name || product.category?.name,
          is_purchased: product.is_purchased || false
        }));
        
        setViewedProducts(formattedProducts);
      } catch (fallbackError) {
        console.error('인기 상품 로드 실패:', fallbackError);
        setViewedProducts([]);
      }
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
    <div className="min-h-screen bg-white" style={{ overflow: 'visible' }}>
      <ProfileHeader 
        backButtonLink="/"
        backButtonText="common.backHome"
        showMenuButton={false}
        showBackButton={true}
      />

      <main className="max-w-[1200px] mx-auto px-12 py-8 pb-20" style={{ overflow: 'visible', position: 'relative' }}>
        <div className="grid grid-cols-[1fr_400px] gap-8" style={{ alignItems: 'start', overflow: 'visible', position: 'relative' }}>
          {/* 메인 컨텐츠 */}
          <div>
            <ProductProfileHeader 
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
                        date: review.created_at || '',
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

          {/* 사이드바 - 스크롤 시 고정 */}
          <aside 
            ref={sidebarRef}
            className="flex flex-col gap-5 product-sidebar"
            style={{ 
              position: 'sticky',
              top: `${sidebarTop}px`,
              alignSelf: 'start',
              zIndex: 10
            }}
          >
            <PriceSidebar 
              developer={developer} 
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
              onAddToTeam={handleAddToTeam}
              isPurchased={isPurchased}
            />
            <TrustBadges />
          </aside>
        </div>

        {/* 카테고리 기반 추천 상품 섹션 */}
        {recommendedProducts.length > 0 && developer && (
          <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #E5E7EB' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
                {t('product.recommended.categoryTitle', { category: developer.category || 'AI' })}
              </h2>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                {t('product.recommended.categoryDescription', { category: developer.category || 'AI' })}
              </p>
            </div>
            <ProductList products={recommendedProducts} />
          </div>
        )}

        {/* 다른 고객들이 자주 조회하는 상품 섹션 - 슬라이더 */}
        {viewedProducts.length > 0 && (
          <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #E5E7EB' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
                {t('product.viewed.title')}
              </h2>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                {t('product.viewed.description')}
              </p>
            </div>
            
            {/* 상품 카드 그리드 - 6개만 표시 */}
            <div style={{ width: '100%' }}>
              <div className="products-grid" style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '20px'
              }}>
                {/* 정확히 6개만 표시 */}
                {viewedProducts.slice(0, 6).map((product) => {
                    const isPurchased = product.is_purchased === 1 || product.is_purchased === true;
                    
                  return (
                        <Link 
                          to={`/products/${product.id}`}
                          className="product-card"
                          style={{ position: 'relative' }}
                        >
                          {isPurchased && (
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(229, 231, 235, 0.8)',
                              borderRadius: '8px',
                              zIndex: 10,
                              pointerEvents: 'none'
                            }} />
                          )}
                          
                          <div className="card-image">
                            <div className="avatar-large">
                              <img
                                src={`${API_URL}/${product.imageUrl || product.image_url}`}
                                alt={product.name}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.textContent = (product.name || 'AI').substring(0, 2);
                                }}
                              />
                            </div>
                          </div>
                          <div className="card-content">
                            <div className="card-category">
                              {(() => {
                                const categoryMap = {
                                  1: 'fe',
                                  2: 'be',
                                  3: 'design',
                                  4: 'mg',
                                  5: 'inf',
                                  6: 'sec',
                                  7: 'doc'
                                };
                                const categoryKey = categoryMap[product.category_id];
                                return categoryKey 
                                  ? t(`home.tabs.${categoryKey}`)
                                  : (product.category_name || t('purchase.productCard.categoryFallback'));
                              })()}
                            </div>
                            <div className="card-header">
                              <h3 className="card-title">{product.name}</h3>
                            </div>
                            <div className="card-rating">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FCD34D" stroke="#FCD34D">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                              </svg>
                              <span className="rating-value">{parseFloat(product.rating || product.rating_average || 0).toFixed(1)}</span>
                              <span className="rating-count">({(product.rating_count || 0).toLocaleString()})</span>
                            </div>
                            <div className="card-footer">
                              <span className="price">¥{product.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </Link>
                  );
                })}
              </div>
            </div>
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