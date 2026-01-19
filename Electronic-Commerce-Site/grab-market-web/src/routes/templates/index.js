import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Globe, Code, Smartphone, BarChart3, FileText, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../config/api';
import LogoutButton from '../home/components/LogoutButton';
import { TEMPLATE_DETAILS_MAP } from './templateData';
import TemplateIllustration from './components/TemplateIllustration';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);

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

  // 타이핑 애니메이션
  useEffect(() => {
    const typingTexts = {
      ko: [
        '비즈니스 분석부터 시작해보세요',
        '마케팅 이미지를 만들어보세요',
        '머신러닝 프로젝트를 구축해보세요'
      ],
      ja: [
        'ビジネス分析から始めてみませんか？',
        'マーケティング画像を作成しましょう',
        '機械学習プロジェクトを構築しましょう'
      ],
      en: [
        'Start with business analysis',
        'Create marketing images',
        'Build a machine learning project'
      ]
    };

    const texts = typingTexts[language] || typingTexts.ko;
    if (texts.length === 0) return;

    setTypingText(texts[0]);
    setTypingIndex(0);

    const interval = setInterval(() => {
      setTypingIndex((prev) => {
        const nextIndex = (prev + 1) % texts.length;
        setTypingText(texts[nextIndex]);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [language]);

  // 자동 슬라이드
  useEffect(() => {
    const recommendedTemplates = [...templates]
      .sort((a, b) => (b.purchase_count || 0) - (a.purchase_count || 0))
      .slice(0, 3);
    
    if (recommendedTemplates.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recommendedTemplates.length);
    }, 4000); // 4초마다 자동 슬라이드

    return () => clearInterval(interval);
  }, [templates]);

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
          
          {/* 타이핑 애니메이션 */}
          <div className="typing-container">
            <div className={`typing-text ${typingText ? 'fade-in' : ''}`} key={typingIndex}>
              {typingText}
            </div>
          </div>
        </div>

        {/* 추천 템플릿 섹션 */}
        {(() => {
          // 구매량이 높은 템플릿 3개 추천
          const recommendedTemplates = [...templates]
            .sort((a, b) => (b.purchase_count || 0) - (a.purchase_count || 0))
            .slice(0, 3);

          if (recommendedTemplates.length === 0) return null;

          return (
            <div className="templates-featured-section">
              <h2 className="templates-featured-title">{t('templates.featured.title')}</h2>
              <div className="templates-featured-carousel">
                <div className="templates-featured-carousel-track">
                  {recommendedTemplates.map((template, index) => {
                  const categoryInfo = TEMPLATE_CATEGORIES[template.category] || TEMPLATE_CATEGORIES.web;
                  
                  // 카테고리 이름 다국어 처리
                  let categoryName = categoryInfo.name;
                  if (language === 'ja') {
                    const categoryNamesJa = {
                      'web': 'ウェブ開発',
                      'app': 'アプリ開発',
                      'data': 'データ分析',
                      'document': 'ドキュメント',
                      'image': '画像生成'
                    };
                    categoryName = categoryNamesJa[template.category] || categoryInfo.name;
                  } else if (language === 'en') {
                    const categoryNamesEn = {
                      'web': 'Web Development',
                      'app': 'App Development',
                      'data': 'Data Analysis',
                      'document': 'Documents',
                      'image': 'Image Generation'
                    };
                    categoryName = categoryNamesEn[template.category] || categoryInfo.name;
                  }
                  
                  // 카테고리별 배경 클래스
                  let categoryClass;
                  if (template.id === 9) {
                    // 機械学習プロジェクト는 초록색
                    categoryClass = 'ml';
                  } else if (template.category === 'data') {
                    categoryClass = 'business';
                  } else if (template.category === 'image') {
                    categoryClass = 'marketing';
                  } else if (template.category === 'app') {
                    categoryClass = 'ml';
                  } else {
                    categoryClass = template.category;
                  }
                  
                  return (
                    <div
                      key={template.id}
                      className={`slide ${categoryClass} ${currentSlide === index ? 'active' : ''}`}
                    >
                      <div className="slide-bg"></div>
                      <div className="decorations">
                        <div className="decoration-circle top"></div>
                        <div className="decoration-circle bottom"></div>
                      </div>
                      <div className="slide-content">
                        <div className="slide-text">
                          <span className="category-badge">{categoryName}</span>
                          <h2 className="slide-title">{getLocalizedField(template, 'name') || template.name}</h2>
                          <p className="slide-description" dangerouslySetInnerHTML={{
                            __html: (() => {
                              const desc = getLocalizedField(template, 'description') || template.description || '설명이 없습니다.';
                              // 첫 번째 마침표(。 또는 .) 뒤에 줄바꿈 추가
                              const firstPeriodIndex = desc.indexOf('。');
                              if (firstPeriodIndex !== -1 && firstPeriodIndex < desc.length - 1) {
                                return desc.substring(0, firstPeriodIndex + 1) + '<br/>' + desc.substring(firstPeriodIndex + 1);
                              }
                              const firstDotIndex = desc.indexOf('.');
                              if (firstDotIndex !== -1 && firstDotIndex < desc.length - 1 && desc[firstDotIndex + 1] === ' ') {
                                return desc.substring(0, firstDotIndex + 1) + '<br/>' + desc.substring(firstDotIndex + 2);
                              }
                              return desc;
                            })()
                          }}></p>
                          <Link to={`/templates/${template.id}`} className="cta-button">
                            {language === 'ja' ? '詳しく見る' : language === 'en' ? 'Learn More' : '자세히 보기'}
                          </Link>
                        </div>
                        <div className="slide-visual">
                          <div className="dashboard-mockup">
                            <TemplateIllustration 
                              templateId={template.id} 
                              category={template.category}
                              color={categoryInfo.color}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
              <div className="indicators">
                {recommendedTemplates.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          );
        })()}

        {/* 3단계 설명 카드 */}
        <div className="info-card">
          <div className="info-step">
            <div className="info-icon">📋</div>
            <div className="info-title">{language === 'ja' ? 'テンプレート選択' : language === 'en' ? 'Template Selection' : '템플릿 선택'}</div>
            <div className="info-desc" dangerouslySetInnerHTML={{
              __html: language === 'ja' ? 'プロジェクトに合った<br/>テンプレートを選んでください' : 
                       language === 'en' ? 'Choose a template<br/>that fits your project' : 
                       '프로젝트에 맞는<br/>템플릿을 고르세요'
            }} />
          </div>
          
          <div className="arrow">→</div>
          
          <div className="info-step">
            <div className="info-icon">👥</div>
            <div className="info-title">{language === 'ja' ? 'チーム構成' : language === 'en' ? 'Team Formation' : '팀 구성'}</div>
            <div className="info-desc" dangerouslySetInnerHTML={{
              __html: language === 'ja' ? '専門AI開発者が<br/>自動的に構成されます' : 
                       language === 'en' ? 'Professional AI developers<br/>are automatically formed' : 
                       '전문 AI 개발자들이<br/>자동으로 구성됩니다'
            }} />
          </div>
          
          <div className="arrow">→</div>
          
          <div className="info-step">
            <div className="info-icon">🚀</div>
            <div className="info-title">{language === 'ja' ? 'すぐに始める' : language === 'en' ? 'Start Immediately' : '바로 시작'}</div>
            <div className="info-desc" dangerouslySetInnerHTML={{
              __html: language === 'ja' ? '構成されたチームで<br/>すぐに作業を開始' : 
                       language === 'en' ? 'Start working immediately<br/>with the formed team' : 
                       '구성된 팀으로<br/>즉시 작업 시작'
            }} />
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="templates-categories-section">
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
