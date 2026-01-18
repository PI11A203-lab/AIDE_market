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
  const [templateTeams, setTemplateTeams] = useState([]); // 템플릿 팀 구성 목록
  const [selectedTemplateTeamIds, setSelectedTemplateTeamIds] = useState(new Set()); // 선택된 템플릿 팀 ID들
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const maxTeamSize = 10;
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

        // 모든 상품 가져오기 (템플릿 팀 로드를 위해 먼저 가져옴)
        const productsResponse = await axios.get(`${API_URL}/api/products`);
        const allProducts = productsResponse.data?.products || [];
        
        if (favoriteProductIds.length === 0) {
          setAvailableDevelopers([]);
        } else {
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
          
          // localStorage에서 템플릿 팀 정보 복원
          let restoredTemplateTeamIds = new Set();
          let templateTeamsInfo = [];
          try {
            const savedTemplateTeamIds = localStorage.getItem('selectedTemplateTeamIds');
            const savedTemplateTeamsInfo = localStorage.getItem('templateTeamsInfo');
            if (savedTemplateTeamIds) {
              restoredTemplateTeamIds = new Set(JSON.parse(savedTemplateTeamIds));
            }
            if (savedTemplateTeamsInfo) {
              templateTeamsInfo = JSON.parse(savedTemplateTeamsInfo);
            }
          } catch (error) {
            console.error('템플릿 팀 정보 복원 실패:', error);
          }
          
          if (selectedIds.length > 0) {
            const restoredTeam = [];
            
            // 템플릿 팀 멤버 먼저 복원
            templateTeamsInfo.forEach(templateTeam => {
              const templateMemberIds = templateTeam.memberIds || [];
              templateMemberIds.forEach(memberId => {
                if (selectedIds.includes(memberId)) {
                  const dev = developers.find(d => d.id === memberId);
                  if (dev) {
                    restoredTeam.push({
                      ...dev,
                      templateTeamId: templateTeam.id,
                      templateTeamName: templateTeam.name
                    });
                  }
                }
              });
            });
            
            // 나머지 개별 상품 복원 (템플릿 팀에 속하지 않은 것들)
            const templateMemberIds = templateTeamsInfo.flatMap(t => t.memberIds || []);
            const individualIds = selectedIds.filter(id => !templateMemberIds.includes(id));
            individualIds.forEach(id => {
              const dev = developers.find(d => d.id === id);
              if (dev && !restoredTeam.find(r => r.id === id)) {
                restoredTeam.push(dev);
              }
            });
            
            setSelectedTeam(restoredTeam);
            setSelectedTemplateTeamIds(restoredTemplateTeamIds);
          } else {
            setSelectedTemplateTeamIds(restoredTemplateTeamIds);
          }
        }
        
        // 템플릿 팀 구성 로드 (항상 실행)
        await loadTemplateTeams(userId, allProducts);
        
        setLoading(false);
      } catch (error) {
        console.error('エラー発生 : ', error);
        setLoading(false);
      }
    };

    loadData();
  }, [location.search]);

  // 템플릿 팀 구성 로드 함수
  const loadTemplateTeams = async (userId, allProducts) => {
    try {
      // 사용자의 팀 구성 목록 가져오기
      const teamsResponse = await api.teamCompositions.getByUser(userId, { limit: 100 });
      const teams = teamsResponse.data?.teamCompositions || teamsResponse.data?.teams || [];
      
      // 템플릿에서 생성된 팀만 필터링 (이름에 "템플릿" 또는 "テンプレート" 또는 "template" 포함)
      const templateTeamCompositions = teams.filter(team => {
        const name = (team.name || '').toLowerCase();
        return name.includes('템플릿') || name.includes('テンプレート') || name.includes('template');
      });
      
      // 각 템플릿 팀의 멤버 정보 가져오기
      const templateTeamsWithMembers = await Promise.all(
        templateTeamCompositions.map(async (team) => {
          try {
            const membersResponse = await api.teamMembers.getByTeam(team.id);
            const members = membersResponse.data?.teamMembers || membersResponse.data?.members || [];
            
            // 멤버 정보와 상품 정보 결합
            const membersWithProducts = members.map(member => {
              const product = allProducts.find(p => p.id === member.product_id);
              if (product) {
                return {
                  id: product.id,
                  name: product.name,
                  category: product.category_name || 'その他',
                  categoryId: product.category_id,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  position: member.position
                };
              }
              return null;
            }).filter(Boolean);
            
            return {
              id: team.id,
              name: team.name,
              synergyScore: team.total_synergy_score || 0,
              members: membersWithProducts,
              createdAt: team.created_at
            };
          } catch (error) {
            console.error(`팀 ${team.id}의 멤버 정보 로드 실패:`, error);
            return null;
          }
        })
      );
      
      // null 값 제거
      const validTeams = templateTeamsWithMembers.filter(Boolean);
      setTemplateTeams(validTeams);
    } catch (error) {
      console.error('템플릿 팀 구성 로드 실패:', error);
      setTemplateTeams([]);
    }
  };

  // 팀에 추가
  const addToTeam = (developer) => {
    if (selectedTeam.length < maxTeamSize && !selectedTeam.find(d => d.id === developer.id)) {
      const newTeam = [...selectedTeam, developer];
      setSelectedTeam(newTeam);
      // URL 파라미터 업데이트
      updateURLParams(newTeam.map(d => d.id));
    }
  };

  // 템플릿 팀 전체를 AIチーム에 추가
  const addTemplateTeamToSelectedTeam = (templateTeam) => {
    console.log('템플릿 팀 추가 시작:', templateTeam);
    
    // 템플릿 팀 ID를 숫자로 변환 (타입 일치를 위해)
    const templateTeamId = typeof templateTeam.id === 'string' ? parseInt(templateTeam.id) : templateTeam.id;
    
    // 템플릿 팀이 이미 추가되어 있는지 확인
    if (selectedTemplateTeamIds.has(templateTeamId)) {
      console.log('템플릿 팀이 이미 추가되어 있습니다:', templateTeamId);
      return;
    }

    // 템플릿 팀 멤버 확인
    if (!templateTeam.members || templateTeam.members.length === 0) {
      console.error('템플릿 팀 멤버가 없습니다:', templateTeam);
      return;
    }

    console.log('템플릿 팀 멤버 수:', templateTeam.members.length);

    // 최대 팀 크기 확인
    const remainingSlots = maxTeamSize - selectedTeam.length;
    if (remainingSlots <= 0) {
      console.log('팀 크기가 최대치에 도달했습니다.');
      return;
    }

    // 템플릿 팀의 멤버를 developer 형식으로 변환 (템플릿 팀 ID 포함)
    // 템플릿 팀의 모든 멤버를 추가하되, 남은 슬롯을 초과하지 않도록 함
    const membersToAdd = templateTeam.members.slice(0, Math.min(templateTeam.members.length, remainingSlots));
    
    const developersToAdd = membersToAdd
      .filter(member => {
        // 이미 추가된 멤버는 제외
        const alreadyExists = selectedTeam.find(d => d.id === member.id);
        if (alreadyExists) {
          console.log('멤버가 이미 추가되어 있습니다:', member.name);
        }
        return !alreadyExists;
      })
      .map(member => {
        const developer = {
          id: member.id,
          name: member.name,
          category: member.category,
          categoryId: member.categoryId,
          price: member.price,
          imageUrl: member.imageUrl,
          templateTeamId: templateTeamId, // 템플릿 팀 ID 추가 (숫자로 통일)
          templateTeamName: templateTeam.name, // 템플릿 팀 이름 추가
          stats: {
            technical: 95,
            communication: 90,
            creativity: 88,
            speed: 92,
            reliability: 93,
            innovation: 90
          }
        };
        console.log(`멤버 ${member.name} 변환:`, {
          id: developer.id,
          templateTeamId: developer.templateTeamId,
          templateTeamName: developer.templateTeamName
        });
        return developer;
      });

    if (developersToAdd.length === 0) {
      return;
    }

    console.log('템플릿 팀 추가:', {
      templateTeamId,
      templateTeamName: templateTeam.name,
      membersCount: developersToAdd.length,
      members: developersToAdd.map(m => m.name),
      developersToAdd: developersToAdd // 전체 객체 확인
    });

    console.log('현재 selectedTeam:', selectedTeam);
    console.log('현재 selectedTemplateTeamIds:', Array.from(selectedTemplateTeamIds));

    const newTeam = [...selectedTeam, ...developersToAdd];
    const newTemplateTeamIds = new Set([...selectedTemplateTeamIds, templateTeamId]);
    
    console.log('새로운 newTeam:', newTeam);
    console.log('새로운 newTemplateTeamIds:', Array.from(newTemplateTeamIds));
    
    setSelectedTeam(newTeam);
    setSelectedTemplateTeamIds(newTemplateTeamIds);
    
    // localStorage에 템플릿 팀 정보 저장 (페이지 새로고침 시 복원용)
    try {
      const templateTeamsInfo = Array.from(newTemplateTeamIds).map(id => {
        const teamMembers = newTeam.filter(dev => dev.templateTeamId === id);
        return {
          id: id,
          name: teamMembers[0]?.templateTeamName || 'Template Team',
          memberIds: teamMembers.map(m => m.id)
        };
      });
      localStorage.setItem('selectedTemplateTeamIds', JSON.stringify(Array.from(newTemplateTeamIds)));
      localStorage.setItem('templateTeamsInfo', JSON.stringify(templateTeamsInfo));
    } catch (error) {
      console.error('템플릿 팀 정보 저장 실패:', error);
    }
    
    // URL 파라미터 업데이트
    updateURLParams(newTeam.map(d => d.id));
  };

  // 템플릿 팀 전체를 AIチーム에서 제거
  const removeTemplateTeamFromSelectedTeam = (templateTeamId) => {
    const templateTeamIdNum = typeof templateTeamId === 'string' ? parseInt(templateTeamId) : templateTeamId;
    const newTeam = selectedTeam.filter(dev => dev.templateTeamId !== templateTeamIdNum);
    setSelectedTeam(newTeam);
    // 선택된 템플릿 팀 ID에서 제거
    const newSet = new Set(selectedTemplateTeamIds);
    newSet.delete(templateTeamIdNum);
    setSelectedTemplateTeamIds(newSet);
    
    // localStorage 업데이트
    try {
      const templateTeamsInfo = Array.from(newSet).map(id => {
        const teamMembers = newTeam.filter(dev => dev.templateTeamId === id);
        return {
          id: id,
          name: teamMembers[0]?.templateTeamName || 'Template Team',
          memberIds: teamMembers.map(m => m.id)
        };
      });
      localStorage.setItem('selectedTemplateTeamIds', JSON.stringify(Array.from(newSet)));
      localStorage.setItem('templateTeamsInfo', JSON.stringify(templateTeamsInfo));
    } catch (error) {
      console.error('템플릿 팀 정보 업데이트 실패:', error);
    }
    
    // URL 파라미터 업데이트
    updateURLParams(newTeam.map(d => d.id));
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
              <Link to="/templates" className="nav-link">{t('home.nav.templates')}</Link>
              <Link to="/team" className="nav-link active">{t('home.nav.teams')}</Link>
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
            <Link to="/templates" className="nav-link">{t('home.nav.templates')}</Link>
            <Link to="/team" className="nav-link active">{t('home.nav.teams')}</Link>
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
      
      <main className="team-main">
        <div className="team-intro">
          <h2 className="team-title">{t('teamBuilder.introTitle')}</h2>
          <p className="team-subtitle">
            {t('teamBuilder.introSubtitle', { max: maxTeamSize })}
          </p>
        </div>

        <div className="team-content-grid">
          <div className="team-left-section">
            <AvailableDevelopers
              developers={availableDevelopers}
              selectedTeam={selectedTeam}
              maxTeamSize={maxTeamSize}
              onAddToTeam={addToTeam}
              onRemoveFromTeam={removeFromTeam}
            />

            {/* 템플릿 팀 섹션 */}
            {templateTeams.length > 0 && (
              <div className="template-teams-section" style={{ marginTop: '2rem' }}>
                <div className="section-card">
                  <h3 className="section-title">
                    <span>{t('teamBuilder.templateTeams') || '템플릿 팀'}</span>
                  </h3>
                  
                  <div className="template-teams-list">
                    {templateTeams.map((team) => (
                      <div key={team.id} className="template-team-card" style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        marginBottom: '1rem',
                        background: '#ffffff'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1A1A1A', margin: 0 }}>
                            {team.name}
                          </h4>
                          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                            {t('synergy.label')}: {team.synergyScore}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                          {team.members.map((member) => (
                            <div key={member.id} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem',
                              background: '#F3F4F6',
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem'
                            }}>
                              {member.imageUrl ? (
                                <img 
                                  src={`${API_URL}/${member.imageUrl}`}
                                  alt={member.name}
                                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) {
                                      e.target.nextSibling.textContent = member.name.substring(0, 2);
                                    }
                                  }}
                                />
                              ) : (
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: '#9CA3AF',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  fontWeight: '600'
                                }}>
                                  {member.name.substring(0, 2)}
                                </div>
                              )}
                              <span style={{ color: '#1A1A1A' }}>{member.name}</span>
                              <span style={{ color: '#6B7280' }}>¥{member.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => addTemplateTeamToSelectedTeam(team)}
                          disabled={selectedTeam.length >= maxTeamSize || selectedTemplateTeamIds.has(typeof team.id === 'string' ? parseInt(team.id) : team.id)}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            background: selectedTeam.length >= maxTeamSize || selectedTemplateTeamIds.has(typeof team.id === 'string' ? parseInt(team.id) : team.id)
                              ? '#E5E7EB'
                              : '#1A1A1A',
                            color: selectedTeam.length >= maxTeamSize || selectedTemplateTeamIds.has(typeof team.id === 'string' ? parseInt(team.id) : team.id)
                              ? '#9CA3AF'
                              : '#ffffff',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: selectedTeam.length >= maxTeamSize || selectedTemplateTeamIds.has(typeof team.id === 'string' ? parseInt(team.id) : team.id)
                              ? 'not-allowed'
                              : 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.background = '#374151';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.background = '#1A1A1A';
                            }
                          }}
                        >
                          {t('teamBuilder.addTemplateTeam')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <TeamSidebar
            selectedTeam={selectedTeam}
            maxTeamSize={maxTeamSize}
            teamStats={teamStats}
            synergyScore={synergyScore}
            totalPrice={totalPrice}
            onRemoveFromTeam={removeFromTeam}
            onRemoveTemplateTeam={removeTemplateTeamFromSelectedTeam}
            selectedTemplateTeamIds={selectedTemplateTeamIds}
          />
        </div>
      </main>
    </div>
  );
}