import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Globe, Code, Smartphone, BarChart3, FileText, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../config/api';
import LogoutButton from '../home/components/LogoutButton';
import { TEMPLATE_DETAILS_MAP } from './templateData';
import './index.css';

// 템플릿 카테고리 정의
const TEMPLATE_CATEGORIES = {
  web: { name: '웹개발', icon: Code, color: '#667eea' },
  app: { name: '어플개발', icon: Smartphone, color: '#f093fb' },
  data: { name: '데이터 분석', icon: BarChart3, color: '#4facfe' },
  document: { name: '문서', icon: FileText, color: '#43e97b' },
  image: { name: '이미지생성', icon: ImageIcon, color: '#fa709a' }
};

// 템플릿 아이콘 매핑 함수
const getTemplateIcon = (category) => {
  return TEMPLATE_CATEGORIES[category]?.icon || Code;
};

// 예시 템플릿 목 데이터 (카테고리별 구조) - TEMPLATE_DETAILS_MAP에서 가져옴
const mockTemplates = Object.keys(TEMPLATE_DETAILS_MAP).map(id => {
  const template = TEMPLATE_DETAILS_MAP[id];
  return {
    id: parseInt(id),
    category: template.category,
    name: template.name,
    name_ja: template.name_ja,
    name_en: template.name_en,
    description: template.description,
    description_ja: template.description_ja,
    description_en: template.description_en,
    product_count: template.productLimit || 0,
    created_at: '2024-01-01T00:00:00.000Z'
  };
});

function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const languageOptions = [
    { value: 'ko', label: '한국어' },
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' },
  ];

  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      
      // TEMPLATE_DETAILS_MAP의 모든 템플릿을 기본으로 사용
      let finalTemplates = [...mockTemplates];
      
      try {
        const response = await api.templates.getList({ limit: 100 });
        const apiTemplates = response.data.templates || [];
        
        // API에서 가져온 템플릿이 있으면 병합
        if (apiTemplates && apiTemplates.length > 0) {
          // API 템플릿을 ID별로 매핑
          const apiTemplateMap = {};
          apiTemplates.forEach(template => {
            apiTemplateMap[template.id] = template;
          });
          
          // mockTemplates의 각 템플릿에 API 데이터 병합
          finalTemplates = mockTemplates.map(template => {
            const apiTemplate = apiTemplateMap[template.id];
            if (apiTemplate) {
              // API 데이터가 있으면 병합 (다국어 필드는 TEMPLATE_DETAILS_MAP 우선)
              return {
                ...template,
                purchase_count: apiTemplate.purchase_count || template.purchase_count,
                product_count: apiTemplate.product_count || template.product_count,
                created_at: apiTemplate.created_at || template.created_at,
                updated_at: apiTemplate.updated_at || template.updated_at
              };
            }
            return template;
          });
        }
      } catch (apiError) {
        // API 호출 실패 시 무시하고 mockTemplates 사용
        console.log('템플릿 API 호출 실패, 목 데이터 사용:', apiError);
      }
      
      setTemplates(finalTemplates);
    } catch (error) {
      console.error('템플릿 목록 로드 실패:', error);
      // 에러 발생 시에도 목 데이터 사용
      setTemplates(mockTemplates);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

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

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
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

  // 다국어 필드 선택 헬퍼 함수
  const getLocalizedField = (template, field) => {
    if (!template) return '';
    if (language === 'ja' && template[`${field}_ja`]) {
      return template[`${field}_ja`];
    }
    if (language === 'en' && template[`${field}_en`]) {
      return template[`${field}_en`];
    }
    return template[field] || '';
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div>로딩 중...</div>
        </div>
      </div>
    );
  }

  // 카테고리 필터 설정
  const categories = [
    { id: 'all', label: t('templates.categories.all'), icon: FileText },
    { id: 'web', label: t('templates.categories.web'), icon: TEMPLATE_CATEGORIES.web.icon },
    { id: 'app', label: t('templates.categories.app'), icon: TEMPLATE_CATEGORIES.app.icon },
    { id: 'data', label: t('templates.categories.data'), icon: TEMPLATE_CATEGORIES.data.icon },
    { id: 'document', label: t('templates.categories.document'), icon: TEMPLATE_CATEGORIES.document.icon },
    { id: 'image', label: t('templates.categories.image'), icon: TEMPLATE_CATEGORIES.image.icon }
  ];

  // 필터링된 템플릿
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="templates-page-container">
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
            <Link to="/team" className="nav-link">{t('home.nav.teams')}</Link>
            <Link to="/resources" className="nav-link">{t('home.nav.resources')}</Link>
          </nav>

          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9CA3AF', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder={t('home.searchPlaceholder')}
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

      <main className="templates-main">
        {/* 페이지 헤더 */}
        <div className="templates-header">
          <h1 className="templates-page-title">{t('templates.pageTitle')}</h1>
          <p className="templates-page-subtitle">{t('templates.pageSubtitle')}</p>
        </div>

        {/* 카테고리 필터 */}
        <div className="templates-categories">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className={`category-filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon width={18} height={18} />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="templates-empty">
            <p>{t('templates.empty')}</p>
          </div>
        ) : (
          <div className="templates-grid">
            {filteredTemplates.map((template) => {
              const TemplateIcon = getTemplateIcon(template.category);
              
              return (
                <Link
                  key={template.id}
                  to={`/templates/${template.id}`}
                  className="template-card"
                >
                  <div className="template-card-icon">
                    <TemplateIcon width={24} height={24} />
                  </div>
                  <div className="template-card-content">
                    <h3 className="template-card-title">{getLocalizedField(template, 'name') || template.name}</h3>
                    <p className="template-card-description">{getLocalizedField(template, 'description') || template.description || '설명이 없습니다.'}</p>
                    <div className="template-card-meta">
                      <span>{t('templates.productCount', { count: template.product_count || 0 })}</span>
                    </div>
                  </div>
                  <div className="template-card-arrow">
                    <ChevronRight width={20} height={20} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default TemplatesPage;
