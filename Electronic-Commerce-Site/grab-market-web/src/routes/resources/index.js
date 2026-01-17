import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Search, ShoppingCart, Globe, BookOpen, HelpCircle, FileText, BarChart3, Download, ArrowRight, ChevronRight } from 'lucide-react';
import LogoutButton from '../home/components/LogoutButton';
import { useTranslation } from 'react-i18next';
import '../home/index.css';
import './index.css';

function ResourcesPage() {
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('');
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

  // 필터링된 리소스 데이터
  const allResources = [
    {
      id: 1,
      category: 'guide',
      title: t('resources.items.guide1.title'),
      description: t('resources.items.guide1.description'),
      content: t('resources.items.guide1.content'),
      icon: BookOpen,
      link: '#',
      tags: ['시작하기', '튜토리얼', '초보자']
    },
    {
      id: 2,
      category: 'guide',
      title: t('resources.items.guide2.title'),
      description: t('resources.items.guide2.description'),
      content: t('resources.items.guide2.content'),
      icon: BookOpen,
      link: '#',
      tags: ['팀 빌딩', '시너지', '최적화']
    },
    {
      id: 3,
      category: 'category',
      title: t('resources.items.category1.title'),
      description: t('resources.items.category1.description'),
      content: t('resources.items.category1.content'),
      icon: FileText,
      link: '#',
      tags: ['프론트엔드', 'React', 'Web']
    },
    {
      id: 4,
      category: 'category',
      title: t('resources.items.category2.title'),
      description: t('resources.items.category2.description'),
      content: t('resources.items.category2.content'),
      icon: FileText,
      link: '#',
      tags: ['백엔드', 'API', 'Node.js']
    },
    {
      id: 5,
      category: 'category',
      title: t('resources.items.category3.title'),
      description: t('resources.items.category3.description'),
      content: t('resources.items.category3.content'),
      icon: FileText,
      link: '#',
      tags: ['디자인', 'UI/UX', 'Figma']
    },
    {
      id: 6,
      category: 'faq',
      title: t('resources.items.faq1.title'),
      description: t('resources.items.faq1.description'),
      content: t('resources.items.faq1.content'),
      icon: HelpCircle,
      link: '#',
      tags: ['FAQ', '도움말', '지원']
    },
    {
      id: 7,
      category: 'faq',
      title: t('resources.items.faq2.title'),
      description: t('resources.items.faq2.description'),
      content: t('resources.items.faq2.content'),
      icon: HelpCircle,
      link: '#',
      tags: ['결제', '구매', '가이드']
    },
    {
      id: 8,
      category: 'template',
      title: t('resources.items.template1.title'),
      description: t('resources.items.template1.description'),
      content: t('resources.items.template1.content'),
      icon: Download,
      link: '#',
      tags: ['템플릿', '스타터', '다운로드']
    },
    {
      id: 9,
      category: 'template',
      title: t('resources.items.template2.title'),
      description: t('resources.items.template2.description'),
      content: t('resources.items.template2.content'),
      icon: Download,
      link: '#',
      tags: ['코드', '스니펫', '예제']
    },
    {
      id: 10,
      category: 'stats',
      title: t('resources.items.stats1.title'),
      description: t('resources.items.stats1.description'),
      content: t('resources.items.stats1.content'),
      icon: BarChart3,
      link: '#',
      tags: ['트렌드', '통계', '분석']
    },
    {
      id: 11,
      category: 'stats',
      title: t('resources.items.stats2.title'),
      description: t('resources.items.stats2.description'),
      content: t('resources.items.stats2.content'),
      icon: BarChart3,
      link: '#',
      tags: ['사례', '성공', '스토리']
    },
    {
      id: 12,
      category: 'guide',
      title: t('resources.items.guide3.title'),
      description: t('resources.items.guide3.description'),
      content: t('resources.items.guide3.content'),
      icon: BookOpen,
      link: '#',
      tags: ['평가', '선택', '가이드']
    }
  ];

  const categories = [
    { id: 'all', label: t('resources.categories.all'), icon: FileText },
    { id: 'guide', label: t('resources.categories.guide'), icon: BookOpen },
    { id: 'category', label: t('resources.categories.category'), icon: FileText },
    { id: 'faq', label: t('resources.categories.faq'), icon: HelpCircle },
    { id: 'template', label: t('resources.categories.template'), icon: Download },
    { id: 'stats', label: t('resources.categories.stats'), icon: BarChart3 }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredResources = allResources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = searchText === '' || 
      resource.title.toLowerCase().includes(searchText.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchText.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="resources-page-container">
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
            <Link to="/resources" className="nav-link active">{t('home.nav.resources')}</Link>
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
      <main className="resources-main">
        {/* 페이지 헤더 */}
        <div className="resources-header">
          <h1 className="resources-page-title">{t('resources.pageTitle')}</h1>
          <p className="resources-page-subtitle">{t('resources.pageSubtitle')}</p>
        </div>

        {/* 카테고리 필터 */}
        <div className="resources-categories">
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

        {/* 리소스 그리드 */}
        <div className="resources-grid">
          {filteredResources.map((resource) => {
            const Icon = resource.icon;
            return (
              <div
                key={resource.id}
                className="resource-card"
                onClick={() => {
                  setSelectedResource(resource);
                  setIsModalOpen(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="resource-card-icon">
                  <Icon width={24} height={24} />
                </div>
                <div className="resource-card-content">
                  <h3 className="resource-card-title">{resource.title}</h3>
                  <p className="resource-card-description">{resource.description}</p>
                  <div className="resource-card-tags">
                    {resource.tags.map((tag, index) => (
                      <span key={index} className="resource-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="resource-card-arrow">
                  <ChevronRight width={20} height={20} />
                </div>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="resources-empty">
            <p>{t('resources.empty')}</p>
          </div>
        )}
      </main>

      {/* 리소스 상세 모달 */}
      {isModalOpen && selectedResource && (
        <div className="resource-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="resource-modal" onClick={(e) => e.stopPropagation()}>
            <div className="resource-modal-header">
              <div className="resource-modal-title-section">
                {selectedResource.icon && (
                  <div className="resource-modal-icon">
                    <selectedResource.icon width={32} height={32} />
                  </div>
                )}
                <div>
                  <h2 className="resource-modal-title">{selectedResource.title}</h2>
                  <div className="resource-modal-tags">
                    {selectedResource.tags.map((tag, index) => (
                      <span key={index} className="resource-modal-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                className="resource-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="resource-modal-content">
              <div className="resource-modal-description">
                {selectedResource.description}
              </div>
              {selectedResource.content && (
                <div className="resource-modal-body">
                  {selectedResource.content.split('\n').map((line, index) => {
                    // 볼드 텍스트 처리 함수
                    const processBold = (text) => {
                      const parts = text.split(/(\*\*.*?\*\*)/g);
                      return parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={i}>{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      });
                    };

                    // 마크다운 스타일 간단 변환
                    if (line.startsWith('## ')) {
                      return <h3 key={index} className="content-h3">{processBold(line.replace('## ', ''))}</h3>;
                    }
                    if (line.startsWith('### ')) {
                      return <h4 key={index} className="content-h4">{processBold(line.replace('### ', ''))}</h4>;
                    }
                    if (line.startsWith('#### ')) {
                      return <h5 key={index} className="content-h5">{processBold(line.replace('#### ', ''))}</h5>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={index} className="content-li">{processBold(line.replace('- ', ''))}</li>;
                    }
                    // 번호 목록: 원본 번호 유지
                    const numberedMatch = line.match(/^(\d+)\. (.+)$/);
                    if (numberedMatch) {
                      return (
                        <li key={index} className="content-li content-ordered">
                          <span className="list-number">{numberedMatch[1]}.</span> {processBold(numberedMatch[2])}
                        </li>
                      );
                    }
                    if (line.startsWith('```')) {
                      return null; // 코드 블록은 나중에 처리
                    }
                    if (line.trim() === '') {
                      return <br key={index} />;
                    }
                    if (line.includes('```')) {
                      const codeMatch = line.match(/```(\w+)?\n?([\s\S]*?)```/);
                      if (codeMatch) {
                        return (
                          <pre key={index} className="content-code">
                            <code>{codeMatch[2]}</code>
                          </pre>
                        );
                      }
                    }
                    if (line.includes('`') && !line.includes('```')) {
                      const parts = line.split(/(`[^`]+`)/g);
                      return (
                        <p key={index} className="content-p">
                          {parts.map((part, i) => {
                            if (part.startsWith('`') && part.endsWith('`')) {
                              return <code key={i} className="content-inline-code">{part.slice(1, -1)}</code>;
                            }
                            return <span key={i}>{processBold(part)}</span>;
                          })}
                        </p>
                      );
                    }
                    return <p key={index} className="content-p">{processBold(line)}</p>;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourcesPage;
