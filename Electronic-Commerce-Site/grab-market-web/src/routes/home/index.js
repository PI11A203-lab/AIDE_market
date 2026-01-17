import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, ShoppingCart, Globe } from 'lucide-react';
import { API_URL } from '../../config/constants';
import LogoutButton from './components/LogoutButton';
import CategorySidebar from './components/CategorySidebar';
import RankingSection from './components/RankingSection';
import RecommendedSection from './components/RecommendedSection';
import ProductList from './components/ProductList';
import TopCreators from './components/TopCreators';
import './index.css';
import { useTranslation } from 'react-i18next';

// 카테고리 ID 매핑 (문자열 → 숫자)
const CATEGORY_MAP = {
  'all': null,
  'fe': 1,
  'be': 2,
  'design': 3,
  'mg': 4,
  'inf': 5,
  'sec': 6,
  'doc': 7
};

function MainPage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // 모든 상품 (카테고리 카운트용)
  const [topRankingProducts, setTopRankingProducts] = useState([]); // 고정 랭킹 3개
  const [recommendedProducts, setRecommendedProducts] = useState([]); // 추천 상품 6개
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 문자열 ID 사용
  const [sortBy, setSortBy] = useState('download');
  const [currentPage, setCurrentPage] = useState(1); // 페이지네이션용
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const languageOptions = [
    { value: 'ko', label: '한국어' },
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' },
  ];

  // i18n 언어 변경 이벤트 구독
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // 카테고리 정의 (동적으로 count 계산)
  const categories = useMemo(() => {
    const baseCategories = [
      { id: 'all', name: t('home.tabs.all'), icon: '/images/icons/all.png' },
      { id: 'fe', name: t('home.tabs.fe'), icon: '/images/icons/fe.png' },
      { id: 'be', name: t('home.tabs.be'), icon: '/images/icons/be.png' },
      { id: 'design', name: t('home.tabs.design'), icon: '/images/icons/design.png' },
      { id: 'mg', name: t('home.tabs.mg'), icon: '/images/icons/mg.png' },
      { id: 'inf', name: t('home.tabs.inf'), icon: '/images/icons/inf.png' },
      { id: 'sec', name: t('home.tabs.sec'), icon: '/images/icons/sec.png' },
      { id: 'doc', name: t('home.tabs.doc'), icon: '/images/icons/doc.png' },
    ];

    // 각 카테고리별 상품 수 계산 (랭킹과 별개로 전체 데이터)
    return baseCategories.map(cat => {
      let count = 0;
      if (cat.id === 'all') {
        count = allProducts.length;
      } else {
        const categoryId = CATEGORY_MAP[cat.id];
        count = allProducts.filter(p => p.category_id === categoryId).length;
      }
      return { ...cat, count };
    });
  }, [allProducts, t]);

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userFromStorage) {
        try {
          setUser(JSON.parse(userFromStorage));
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      } else {
        setUser(null);
      }
    };

    checkLoginStatus();
    // storage 이벤트 리스너 추가 (다른 탭에서 로그인/로그아웃 시 동기화)
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  // 언어 드롭다운 외부 클릭 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 고정 랭킹 3개 가져오기 (다운로드 높은 순)
  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`, { params: { limit: 1000, sort: 'download' } })
      .then((result) => {
        const allProductsData = result.data.products || result.data || [];
        // 다운로드가 있는 제품 중 상위 3개를 고정 랭킹으로 설정
        const top3 = [...allProductsData]
          .filter(p => p.download_count > 0)
          .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
          .slice(0, 3)
          .map((product, index) => ({ ...product, rank: index + 1 }));
        setTopRankingProducts(top3);
        setAllProducts(allProductsData);
      })
      .catch((error) => {
        console.error('全商品読み込みエラー:', error);
        setAllProducts([]);
        setTopRankingProducts([]);
      });
  }, []);

  // 추천 상품 9개 가져오기 (평점 높은 순, 랭킹 제외)
  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`, { params: { limit: 100, sort: 'rating' } })
      .then((result) => {
        const allProductsData = result.data.products || result.data || [];
        // 랭킹 상품 ID 제외하고 평점 높은 순으로 9개 선택
        const rankingIds = new Set(topRankingProducts.map(p => p.id));
        const recommended = [...allProductsData]
          .filter(p => !rankingIds.has(p.id) && parseFloat(p.rating_average || 0) > 0)
          .sort((a, b) => parseFloat(b.rating_average || 0) - parseFloat(a.rating_average || 0))
          .slice(0, 9);
        setRecommendedProducts(recommended);
      })
      .catch((error) => {
        console.error('추천 상품 로드 에러:', error);
        setRecommendedProducts([]);
      });
  }, [topRankingProducts]);

  // 로그아웃 함수
  const handleLogout = () => {
    // localStorage와 sessionStorage 모두에서 사용자 정보 제거
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    
    // 상태 업데이트
    setUser(null);
    
    // 메인 페이지로 리다이렉트 (현재 페이지이므로 새로고침)
    window.location.reload();
  };

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
    setLanguage(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', value);
    }
    setLangOpen(false);
  };

  const currentLangLabel =
    languageOptions.find((opt) => opt.value === language)?.label || 'Language';

  // 검색어가 카테고리 이름과 일치하는지 확인하고 자동 필터링
  useEffect(() => {
    if (searchText) {
      const matchedCategory = categories.find(
        cat => cat.name.toLowerCase() === searchText.toLowerCase().trim()
      );
      
      if (matchedCategory && selectedCategory !== matchedCategory.id) {
        setSelectedCategory(matchedCategory.id);
        setCurrentPage(1);
      }
    }
  }, [searchText, categories, selectedCategory]);

  // 카테고리 변경 시 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // 정렬 변경 시 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  // 상품 로드 (카테고리 필터 + 정렬 적용)
  useEffect(() => {
    setLoading(true);
    
    // API 파라미터 구성
    const params = {
      sort: sortBy || 'download' // 기본값 명시
    };

    // "すべて" 카테고리일 때만 페이지네이션 적용 (12개씩)
    if (selectedCategory === 'all') {
      params.limit = 12;
      params.page = currentPage;
    } else {
      params.limit = 100;
    }

    // 카테고리 필터 추가 (숫자 ID로 변환)
    const categoryId = CATEGORY_MAP[selectedCategory];
    if (categoryId !== null && categoryId !== undefined) {
      params.category = categoryId;
    }

    // 검색어 추가 (카테고리 이름이 아닌 경우에만 상품 이름 검색으로 사용)
    if (searchText) {
      const matchedCategory = categories.find(
        cat => cat.name.toLowerCase() === searchText.toLowerCase().trim()
      );
      
      // 카테고리 이름과 일치하지 않으면 상품 이름 검색으로 사용
      if (!matchedCategory) {
        params.search = searchText;
      }
    }

    // 사용자 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        params.user_id = userData.id;
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    console.log('API 호출 파라미터:', params); // 디버깅용

    axios
      .get(`${API_URL}/api/products`, { params })
      .then((result) => {
        const products = result.data.products || result.data;
        const pagination = result.data.pagination;
        console.log('받은 상품 데이터:', products); // 디버깅용
        
        // 랭킹과 별개로 모든 상품 표시 (랭킹 상품 포함)
        setProducts(products);
        
        // 페이지네이션 정보 업데이트 (모든 카테고리에서 사용 가능하지만 "すべて"에서만 표시)
        if (pagination && selectedCategory === 'all') {
          setTotalPages(pagination.totalPages || 1);
        } else {
          setTotalPages(1);
        }
      })
      .catch((error) => {
        console.error('商品読み込みエラー:', error);
        setProducts([]);
        setTotalPages(1);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategory, sortBy, searchText, currentPage, categories]);

  // regularProducts는 products 그대로 사용 (랭킹과 별개)
  const regularProducts = products;

  return (
    <div className="page-container">
      {/* 헤더 */}
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" style={{ color: '#1A1A1A', textDecoration: 'none' }}>
            <span className="logo-text" style={{ color: '#1A1A1A' }}>{t('header.title')}</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">{t('home.nav.marketplace')}</Link>
            <Link to="/rankings" className="nav-link">{t('home.nav.rankings')}</Link>
            <Link to="/team" className="nav-link">{t('home.nav.teams')}</Link>
            <button type="button" className="nav-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>{t('home.nav.resources')}</button>
          </nav>

          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9CA3AF', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder={t('home.searchPlaceholder')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  width: '200px',
                  height: '40px',
                  padding: '0 16px 0 40px',
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#1A1A1A',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.background = '#E5E7EB';
                }}
                onBlur={(e) => {
                  e.target.style.background = '#F3F4F6';
                }}
              />
            </div>
            <div className="custom-dropdown" ref={langRef} style={{ minWidth: '160px' }}>
              <button
                className={`dropdown-button ${langOpen ? 'active' : ''}`}
                onClick={() => setLangOpen((v) => !v)}
              >
                <span className="dropdown-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Globe width={16} height={16} />
                  {currentLangLabel}
                </span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={`dropdown-menu ${langOpen ? 'show' : ''}`}>
                {languageOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={`dropdown-item ${language === opt.value ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(opt.value)}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
            <Link to="/purchase" className="icon-btn">
              <ShoppingCart width={20} height={20} />
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="btn-primary">
                  {user.nickname}
                </Link>
                <LogoutButton onLogout={handleLogout} />
              </>
            ) : (
              <Link to="/login" className="btn-primary">{t('common.login')}</Link>
            )}
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="main" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
        {/* 히어로 섹션 */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">{t('home.heroTitle')}</h1>
            <div className="hero-subtitle">
              {(() => {
                const subtitleText = t('home.heroSubtitle', { count: categories.find(c => c.id === selectedCategory)?.count || allProducts.length });
                const lines = subtitleText.split('\n');
                return (
                  <>
                    <p>{lines[0]}</p>
                    {lines[1] && <p>{lines[1]}</p>}
                  </>
                );
              })()}
            </div>
            <div className="hero-buttons">
              <button className="btn-hero-primary">{t('home.heroPrimary')}</button>
              <button className="btn-hero-secondary">{t('home.heroSecondary')}</button>
            </div>
          </div>
          <div className="hero-character">
            <img 
              src="/images/character.png" 
              alt="Character" 
              className="hero-character-image"
              onError={(e) => {
                // 이미지가 없을 경우 기본 이미지로 대체하거나 숨김
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* 이번달 랭킹 AI */}
        {topRankingProducts.length > 0 && (
          <div className="featured-section">
            <div className="featured-card ranking-card">
              <div className="featured-header">
                <div>
                  <h2 className="featured-title">{t('home.rankingTitle')}</h2>
                  <p className="featured-subtitle">{t('home.rankingSubtitle')}</p>
                </div>
                <button type="button" className="see-all-link" style={{ background: 'none', border: 'none', padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>{t('home.viewAll')}</button>
              </div>
              <RankingSection topProducts={topRankingProducts} />
            </div>

            {/* 추천 AI */}
            {recommendedProducts.length > 0 && (
              <RecommendedSection products={recommendedProducts} />
            )}
          </div>
        )}

        {/* 컨텐츠 그리드 */}
        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>
          {/* 메인 컨텐츠 */}
          <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 필터 섹션 */}
            <CategorySidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
                <div style={{ width: '48px', height: '48px', border: '4px solid #667eea', borderTop: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
                <p style={{ color: '#6B7280' }}>{t('common.loading')}</p>
              </div>
            ) : (
              <>
                {/* 제품 그리드 */}
                <ProductList products={regularProducts} />

                {/* 상품이 없을 때 */}
                {products.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <p style={{ color: '#6B7280', fontSize: '18px' }}>{t('home.noProducts')}</p>
                  </div>
                )}

                {/* 페이지네이션 ("すべて" 카테고리일 때만 표시) */}
                {selectedCategory === 'all' && totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
                    <button
                      style={{
                        padding: '8px 24px',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontWeight: '500',
                        color: '#374151',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 1 ? 0.5 : 1,
                        transition: 'background 0.2s'
                      }}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      onMouseEnter={(e) => { if (currentPage !== 1) e.target.style.background = '#F9FAFB'; }}
                      onMouseLeave={(e) => { if (currentPage !== 1) e.target.style.background = 'white'; }}
                    >
                      {t('home.pagination.prev')}
                    </button>
                    <span style={{ color: '#374151', fontWeight: '500' }}>
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      style={{
                        padding: '8px 24px',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontWeight: '500',
                        color: '#374151',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        opacity: currentPage === totalPages ? 0.5 : 1,
                        transition: 'background 0.2s'
                      }}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      onMouseEnter={(e) => { if (currentPage !== totalPages) e.target.style.background = '#F9FAFB'; }}
                      onMouseLeave={(e) => { if (currentPage !== totalPages) e.target.style.background = 'white'; }}
                    >
                      {t('home.pagination.next')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 사이드바 */}
          <aside className="sidebar">
            <TopCreators />
          </aside>
        </div>

        {/* 판매자 신청 섹션 */}
        <div style={{
          marginTop: '60px',
          padding: '24px',
          textAlign: 'center',
          borderTop: '1px solid #E5E7EB'
        }}>
          <Link
            to="/seller-info"
            style={{
              fontSize: '14px',
              color: '#6B7280',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            {t('home.sellerApplyLink')} <span style={{ color: '#3B82F6', textDecoration: 'underline' }}>{t('home.sellerApplyClickHere')}</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default MainPage;