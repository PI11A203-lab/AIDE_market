import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Search, ShoppingCart, Globe } from 'lucide-react';
import AvailableDevelopers from './components/AvailableDevelopers';
import TeamSidebar from './components/TeamSidebar';
import { API_URL } from '../../config/constants';
import { api } from '../../config/api';
import LogoutButton from '../home/components/LogoutButton';
import '../home/index.css';
import './index.css';
import { useTranslation } from 'react-i18next';

export default function TeamBuilder() {
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [availableDevelopers, setAvailableDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const maxTeamSize = 5;
  const history = useHistory();
  const location = useLocation();
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

  // URL 파라미터를 업데이트하는 함수
  const updateURLParams = (teamIds) => {
    const searchParams = new URLSearchParams(location.search);
    if (teamIds.length > 0) {
      searchParams.set('team', teamIds.join(','));
    } else {
      searchParams.delete('team');
    }
    history.replace({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };

  useEffect(() => {
    // URL 파라미터에서 선택된 팀원 ID들을 읽어오는 함수
    const getSelectedIdsFromURL = () => {
      const searchParams = new URLSearchParams(location.search);
      const teamParam = searchParams.get('team');
      if (teamParam) {
        return teamParam.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
      }
      return [];
    };

    const loadData = async () => {
      try {
        // 사용자 정보 가져오기
        const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userFromStorage) {
          setLoading(false);
          return;
        }

        const userData = JSON.parse(userFromStorage);
        const userId = userData.id;

        // 찜목록 가져오기
        const favoritesResponse = await api.favorites.getByUser(userId);
        const favoritesList = favoritesResponse.data?.favorites || [];
        
        // 찜목록에 있는 상품 ID만 추출 (여러 가능한 필드명 처리)
        const favoriteProductIds = favoritesList
          .map(fav => fav.product_id || fav.product?.id || fav.id)
          .filter(id => id != null);

        if (favoriteProductIds.length === 0) {
          setAvailableDevelopers([]);
          setLoading(false);
          return;
        }

        // 모든 상품 가져오기
        const productsResponse = await axios.get(`${API_URL}/api/products`);
        const allProducts = productsResponse.data?.products || [];
        
        // 찜목록에 있는 상품만 필터링
        const favoriteProducts = allProducts.filter(product => 
          favoriteProductIds.includes(product.id)
        );

        // API 응답을 developer 형식으로 변환
        const developers = favoriteProducts.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category_name || 'その他', // 카테고리 이름 사용
          categoryId: product.category_id, // 카테고리 ID 추가
          price: product.price,
          imageUrl: product.imageUrl,
          stats: {
            technical: 95,
            communication: 90,
            creativity: 88,
            speed: 92,
            reliability: 93,
            innovation: 90
          }
        }));
        
        setAvailableDevelopers(developers);
        
        // URL 파라미터에서 선택된 팀원 복원
        const selectedIds = getSelectedIdsFromURL();
        if (selectedIds.length > 0) {
          const restoredTeam = developers.filter(dev => selectedIds.includes(dev.id));
          setSelectedTeam(restoredTeam);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('エラー発生 : ', error);
        setLoading(false);
      }
    };

    loadData();
  }, [location.search]);

  // 팀에 추가
  const addToTeam = (developer) => {
    if (selectedTeam.length < maxTeamSize && !selectedTeam.find(d => d.id === developer.id)) {
      const newTeam = [...selectedTeam, developer];
      setSelectedTeam(newTeam);
      // URL 파라미터 업데이트
      updateURLParams(newTeam.map(d => d.id));
    }
  };

  // 팀에서 제거
  const removeFromTeam = (developerId) => {
    const newTeam = selectedTeam.filter(d => d.id !== developerId);
    setSelectedTeam(newTeam);
    // URL 파라미터 업데이트
    updateURLParams(newTeam.map(d => d.id));
  };

  // 팀 평균 스탯 계산
  const calculateTeamStats = () => {
    if (selectedTeam.length === 0) {
      return [
        { stat: 'Technical', value: 0 },
        { stat: 'Communication', value: 0 },
        { stat: 'Creativity', value: 0 },
        { stat: 'Speed', value: 0 },
        { stat: 'Reliability', value: 0 },
        { stat: 'Innovation', value: 0 }
      ];
    }

    const avgStats = selectedTeam.reduce((acc, dev) => ({
      technical: acc.technical + dev.stats.technical,
      communication: acc.communication + dev.stats.communication,
      creativity: acc.creativity + dev.stats.creativity,
      speed: acc.speed + dev.stats.speed,
      reliability: acc.reliability + dev.stats.reliability,
      innovation: acc.innovation + dev.stats.innovation
    }), { technical: 0, communication: 0, creativity: 0, speed: 0, reliability: 0, innovation: 0 });

    const teamSize = selectedTeam.length;
    return [
      { stat: 'Technical', value: Math.round(avgStats.technical / teamSize) },
      { stat: 'Communication', value: Math.round(avgStats.communication / teamSize) },
      { stat: 'Creativity', value: Math.round(avgStats.creativity / teamSize) },
      { stat: 'Speed', value: Math.round(avgStats.speed / teamSize) },
      { stat: 'Reliability', value: Math.round(avgStats.reliability / teamSize) },
      { stat: 'Innovation', value: Math.round(avgStats.innovation / teamSize) }
    ];
  };

  // 총 가격 계산
  const calculateTotalPrice = () => {
    return selectedTeam.reduce((sum, dev) => sum + dev.price, 0);
  };

  // 시너지 스코어 계산
  const calculateSynergyScore = () => {
    if (selectedTeam.length === 0) return 0;
    
    const teamStats = calculateTeamStats();
    const avgScore = teamStats.reduce((sum, stat) => sum + stat.value, 0) / teamStats.length;
    
    // 팀 크기 보너스
    const sizeBonus = selectedTeam.length * 3;
    
    // 다양성 보너스 (다른 카테고리)
    const categories = new Set(selectedTeam.map(d => d.category));
    const diversityBonus = categories.size * 5;
    
    return Math.round(avgScore + sizeBonus + diversityBonus);
  };

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

  const teamStats = calculateTeamStats();
  const synergyScore = calculateSynergyScore();
  const totalPrice = calculateTotalPrice();

  if (loading) {
    return (
      <div className="team-builder">
        {/* 헤더 */}
        <header className="header">
          <div className="header-inner">
            <Link to="/" className="logo" style={{ color: '#1A1A1A', textDecoration: 'none' }}>
              <span className="logo-text" style={{ color: '#1A1A1A' }}>{t('header.title')}</span>
            </Link>
            
            <nav className="nav">
              <Link to="/" className="nav-link">{t('home.nav.marketplace')}</Link>
              <Link to="/rankings" className="nav-link">{t('home.nav.rankings')}</Link>
              <Link to="/team" className="nav-link active">{t('home.nav.teams')}</Link>
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
        <main className="team-main">
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">{t('common.loading')}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="team-builder">
      {/* 헤더 */}
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" style={{ color: '#1A1A1A', textDecoration: 'none' }}>
            <span className="logo-text" style={{ color: '#1A1A1A' }}>{t('header.title')}</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">{t('home.nav.marketplace')}</Link>
            <Link to="/rankings" className="nav-link">{t('home.nav.rankings')}</Link>
            <Link to="/team" className="nav-link active">{t('home.nav.teams')}</Link>
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
      
      <main className="team-main">
        <div className="team-intro">
          <h2 className="team-title">{t('teamBuilder.introTitle')}</h2>
          <p className="team-subtitle">
            {t('teamBuilder.introSubtitle', { max: maxTeamSize })}
          </p>
        </div>

        <div className="team-content-grid">
          <AvailableDevelopers
            developers={availableDevelopers}
            selectedTeam={selectedTeam}
            maxTeamSize={maxTeamSize}
            onAddToTeam={addToTeam}
            onRemoveFromTeam={removeFromTeam}
          />

          <TeamSidebar
            selectedTeam={selectedTeam}
            maxTeamSize={maxTeamSize}
            teamStats={teamStats}
            synergyScore={synergyScore}
            totalPrice={totalPrice}
            onRemoveFromTeam={removeFromTeam}
          />
        </div>
      </main>
    </div>
  );
}