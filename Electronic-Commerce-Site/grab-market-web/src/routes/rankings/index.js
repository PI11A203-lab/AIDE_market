import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Search, ShoppingCart, Globe, TrendingUp } from 'lucide-react';
import { API_URL } from '../../config/constants';
import LogoutButton from '../home/components/LogoutButton';
import ProductList from '../home/components/ProductList';
import CategorySidebar from '../home/components/CategorySidebar';
import { useTranslation } from 'react-i18next';
import './index.css';

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

function RankingsPage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // 모든 상품 (카테고리 카운트용)
  const [topRankingProducts, setTopRankingProducts] = useState([]); // 고정 랭킹 3개
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 카테고리 필터
  const [sortBy, setSortBy] = useState('download');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const history = useHistory();

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

    // 각 카테고리별 상품 수 계산
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

  // 모든 상품 가져오기 (카테고리 카운트용)
  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`, { params: { limit: 1000 } })
      .then((result) => {
        const allProductsData = result.data.products || result.data || [];
        setAllProducts(allProductsData);
      })
      .catch((error) => {
        console.error('전체 상품 로드 에러:', error);
        setAllProducts([]);
      });
  }, []);

  // 상위 3개 랭킹 가져오기 (정렬 옵션에 따라 변경)
  useEffect(() => {
    const params = {
      sort: sortBy || 'download',
      limit: 1000,
    };

    // 카테고리 필터 추가 (숫자 ID로 변환)
    const categoryId = CATEGORY_MAP[selectedCategory];
    if (categoryId !== null && categoryId !== undefined) {
      params.category = categoryId;
    }

    // 검색어 추가
    if (searchText) {
      params.search = searchText;
    }

    axios
      .get(`${API_URL}/api/products`, { params })
      .then((result) => {
        const allProductsData = result.data.products || result.data || [];
        // 정렬 옵션에 따라 상위 3개 선택
        let top3 = [];
        if (sortBy === 'download') {
          top3 = [...allProductsData]
            .filter(p => p.download_count > 0)
            .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
            .slice(0, 3);
        } else if (sortBy === 'rating') {
          top3 = [...allProductsData]
            .filter(p => parseFloat(p.rating_average || 0) > 0)
            .sort((a, b) => parseFloat(b.rating_average || 0) - parseFloat(a.rating_average || 0))
            .slice(0, 3);
        } else if (sortBy === 'price') {
          top3 = [...allProductsData]
            .sort((a, b) => (a.price || 0) - (b.price || 0))
            .slice(0, 3);
        } else if (sortBy === 'priceDesc') {
          top3 = [...allProductsData]
            .sort((a, b) => (b.price || 0) - (a.price || 0))
            .slice(0, 3);
        } else {
          // 기본값: 다운로드순
          top3 = [...allProductsData]
            .filter(p => p.download_count > 0)
            .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
            .slice(0, 3);
        }
        
        const top3WithRank = top3.map((product, index) => ({ ...product, rank: index + 1 }));
        setTopRankingProducts(top3WithRank);
      })
      .catch((error) => {
        console.error('랭킹 상품 로드 에러:', error);
        setTopRankingProducts([]);
      });
  }, [sortBy, selectedCategory, searchText]);

  // 상품 로드 (랭킹 기준으로 정렬 + 카테고리 필터)
  useEffect(() => {
    setLoading(true);
    
    const params = {
      sort: sortBy || 'download',
      limit: currentPage === 1 ? 21 : 18, // 1페이지: 상위 3개 제외하고 18개 (6개씩 3줄), 다른 페이지: 18개
      page: currentPage,
    };

    // 카테고리 필터 추가 (숫자 ID로 변환)
    const categoryId = CATEGORY_MAP[selectedCategory];
    if (categoryId !== null && categoryId !== undefined) {
      params.category = categoryId;
    }

    // 검색어 추가
    if (searchText) {
      params.search = searchText;
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

    axios
      .get(`${API_URL}/api/products`, { params })
      .then((result) => {
        const productsData = result.data.products || result.data || [];
        // 랭킹 상위 3개 제외하고 필터링 (1페이지일 때만)
        const top3Ids = new Set(topRankingProducts.map(p => p.id));
        const filteredProducts = currentPage === 1 
          ? productsData.filter(p => !top3Ids.has(p.id))
          : productsData;
        
        setProducts(filteredProducts);
        
        const pagination = result.data.pagination;
        if (pagination) {
          setTotalPages(pagination.totalPages || 1);
        }
      })
      .catch((error) => {
        console.error('상품 로드 에러:', error);
        setProducts([]);
        setTotalPages(1);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sortBy, searchText, currentPage, topRankingProducts, selectedCategory]);

  // 정렬 변경 시 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  // 검색어 변경 시 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // 카테고리 변경 시 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
    history.push('/');
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

  const sortOptions = [
    { value: 'download', label: t('home.sort.download') },
    { value: 'rating', label: t('home.sort.rating') },
    { value: 'price', label: t('home.sort.price') },
    { value: 'priceDesc', label: t('home.sort.priceDesc') },
  ];

  return (
    <div className="rankings-page-container">
      {/* 헤더 */}
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" style={{ color: '#1A1A1A', textDecoration: 'none' }}>
            <span className="logo-text" style={{ color: '#1A1A1A' }}>{t('header.title')}</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">{t('home.nav.marketplace')}</Link>
            <Link to="/rankings" className="nav-link active">{t('home.nav.rankings')}</Link>
            <Link to="/templates" className="nav-link">{t('home.nav.templates')}</Link>
            <Link to="/team" className="nav-link">{t('home.nav.teams')}</Link>
            <Link to="/resources" className="nav-link">{t('home.nav.resources')}</Link>
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
      <main className="rankings-main">
        {/* 페이지 헤더 */}
        <div className="rankings-header">
          <h1 className="rankings-title">{t('home.rankingTitle')}</h1>
          <p className="rankings-subtitle">{t('rankings.pageSubtitle')}</p>
          {/* 정렬 필터 - 헤더와 통합 */}
          <div className="rankings-sort-bar">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`rankings-sort-btn ${sortBy === option.value ? 'active' : ''}`}
                onClick={() => setSortBy(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 상품 목록 */}
        <div className="rankings-content">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
              <div style={{ width: '48px', height: '48px', border: '4px solid #667eea', borderTop: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
              <p style={{ color: '#6B7280' }}>{t('common.loading')}</p>
            </div>
          ) : (
            <>
              {/* 랭킹 상위 3개 - 포디엄 스타일 */}
              {topRankingProducts.length > 0 && (
                <div className="top-three-section">
                  <div className="top-three-rankings podium">
                    {topRankingProducts.map((product, index) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className={`top-ranking-card rank-${index + 1} podium-${index + 1}`}
                        >
                          <div className={`top-ranking-rank-badge medal-${index + 1}`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} #{product.rank}
                          </div>
                          <div className="top-ranking-image">
                            <img
                              src={`${API_URL}/${product.imageUrl}`}
                              alt={product.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.textContent = product.name.substring(0, 2);
                              }}
                            />
                          </div>
                          <div className="top-ranking-info">
                            <h3 className="top-ranking-name">{product.name}</h3>
                            <div className="top-ranking-stats">
                              <span className="top-ranking-stat">
                                <TrendingUp width={14} height={14} />
                                {(product.download_count || 0).toLocaleString()} {t('home.ranking.projects')}
                              </span>
                              <span className="top-ranking-stat">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FCD34D" stroke="#FCD34D">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                {parseFloat(product.rating_average || 0).toFixed(1)}
                              </span>
                            </div>
                            <div className="top-ranking-price">¥{product.price.toLocaleString()}</div>
                          </div>
                        </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 전체 순위 그리드 */}
              <div className="rankings-grid-section">
                
                {/* 카테고리 필터 */}
                <CategorySidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />

                {products.length > 0 ? (
                  <ProductList 
                    products={products.map((p, i) => ({ ...p, rank: 4 + (currentPage - 1) * 18 + i }))} 
                    showRank 
                  />
                ) : !loading ? (
                  <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <p style={{ color: '#6B7280', fontSize: '18px' }}>{t('home.noProducts')}</p>
                  </div>
                ) : null}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '48px' }}>
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
      </main>
    </div>
  );
}

export default RankingsPage;
