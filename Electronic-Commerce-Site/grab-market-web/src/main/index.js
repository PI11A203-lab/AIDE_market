import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, ShoppingCart } from 'lucide-react';
import { API_URL } from '../config/constants';
import LogoutButton from './components/LogoutButton';
import CategorySidebar from './components/CategorySidebar';
import RankingSection from './components/RankingSection';
import ProductList from './components/ProductList';
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

function MainPage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // 모든 상품 (카테고리 카운트용)
  const [topRankingProducts, setTopRankingProducts] = useState([]); // 고정 랭킹 3개
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 문자열 ID 사용
  const [sortBy, setSortBy] = useState('download');
  const [currentPage, setCurrentPage] = useState(1); // 페이지네이션용
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 카테고리 정의 (동적으로 count 계산)
  const categories = useMemo(() => {
    const baseCategories = [
      { id: 'all', name: 'すべて', icon: '/images/icons/all.png' },
      { id: 'fe', name: 'フロントエンド', icon: '/images/icons/fe.png' },
      { id: 'be', name: 'バックエンド', icon: '/images/icons/be.png' },
      { id: 'design', name: 'イメージ', icon: '/images/icons/design.png' },
      { id: 'mg', name: '設計・マネジメント', icon: '/images/icons/mg.png' },
      { id: 'inf', name: 'インフラ', icon: '/images/icons/inf.png' },
      { id: 'sec', name: 'セキュリティ', icon: '/images/icons/sec.png' },
      { id: 'doc', name: 'ドキュメント', icon: '/images/icons/doc.png' },
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
  }, [allProducts]);

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

  // 상품 로드 (카테고리 필터 + 정렬 적용)
  useEffect(() => {
    setLoading(true);
    
    // API 파라미터 구성
    const params = {
      sort: sortBy
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
    <div className="marketplace-container">
      {/* 헤더 */}
      <header className="marketplace-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <h1 className="logo">
                <span className="logo-icon">🤖</span>
                <span className="logo-text">AIDE Market</span>
              </h1>
            </div>
            <nav className="main-nav">
              <button className="nav-link" type="button">Models</button>
              <Link to="/team" className="nav-link">Teams</Link>
              <button className="nav-link" type="button">Leaderboard</button>
              <button className="nav-link" type="button">Pricing</button>
            </nav>
          </div>
          <div className="header-right">
            <Link to="/purchase" className="cart-link">
              <ShoppingCart className="cart-icon" />
            </Link>
            {user ? (
              <div className="user-menu">
                <Link to="/profile" className="btn-signup">
                  {user.nickname}
                </Link>
                <LogoutButton onLogout={handleLogout} />
              </div>
            ) : (
              <Link to="/login" className="btn-signup">Sign in</Link>
            )}
          </div>
        </div>
      </header>

      {/* 검색 영역 */}
      <div className="search-section">
        <div className="search-content">
          <h2 className="search-title">Find the Perfect AI Developer</h2>
          <p className="search-subtitle">
           AI開発者 {categories.find(c => c.id === selectedCategory)?.count || 0} 人があなたのビジョンを実現する準備ができています
          </p>
          
          <div className="search-bar-wrapper">
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="あなたが探しているAIは何ですか？"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="content-wrapper">
          {/* 사이드바 */}
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* 메인 콘텐츠 */}
          <main className="main-products">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>読み込み中...</p>
              </div>
            ) : (
              <>
                {/* 고정 Top 3 랭킹 ("すべて" 카테고리일 때만 표시) */}
                {selectedCategory === 'all' && topRankingProducts.length > 0 && (
                  <RankingSection topProducts={topRankingProducts} />
                )}

                {/* 나머지 제품 목록 (랭킹 제외) */}
                <ProductList products={regularProducts} />

                {/* 상품이 없을 때 */}
                {products.length === 0 && (
                  <div className="empty-state">
                    <p>該当する商品がありません</p>
                  </div>
                )}

                {/* 페이지네이션 ("すべて" 카테고리일 때만 표시) */}
                {selectedCategory === 'all' && totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      前へ
                    </button>
                    <span className="pagination-info">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      次へ
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainPage;