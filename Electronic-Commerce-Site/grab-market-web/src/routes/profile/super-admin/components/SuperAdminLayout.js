import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown } from 'lucide-react';
import SuperAdminSidebar from './SuperAdminSidebar';
import './SuperAdminLayout.css';

const SIDEBAR_STORAGE_KEY = 'superAdminSidebarOpen';

const LANGUAGE_OPTIONS = [
  { value: 'ko', label: '한국어' },
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
];

export default function SuperAdminLayout({ children }) {
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  // localStorage에서 저장된 언어 로드 및 동기화
  useEffect(() => {
    const saved = localStorage.getItem('appLanguage');
    if (saved && ['ko', 'ja', 'en'].includes(saved) && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, [i18n]);

  // 언어 전환기 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
    setLangOpen(false);
  };

  const currentLang = LANGUAGE_OPTIONS.find((opt) => opt.value === i18n.language) || LANGUAGE_OPTIONS[2];
  
  // localStorage에서 초기 상태 가져오기 (기본값: false - 닫힌 상태)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return saved !== null ? saved === 'true' : false;
  });

  // 사이드바 상태를 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, sidebarOpen.toString());
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="super-admin-container">
      {/* Overlay - 사이드바가 열려있을 때만 표시 */}
      {sidebarOpen && (
        <div 
          className="super-admin-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* 사이드바 - overlay 방식 */}
      <SuperAdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* 메인 컨텐츠 - 항상 전체 너비 */}
      <div className="super-admin-content-wrapper">
        <header className="super-admin-header">
          <div className="super-admin-header-content">
            {/* 햄버거 메뉴 버튼 */}
            <button
              className="super-admin-menu-button"
              onClick={toggleSidebar}
              aria-label={t('profile.superAdmin.layout.menuToggle')}
            >
              {sidebarOpen ? (
                <X size={22} strokeWidth={2.5} />
              ) : (
                <Menu size={22} strokeWidth={2.5} />
              )}
            </button>
            
            {/* 로고 */}
            <div className="super-admin-header-logo">
              <span>{t('profile.superAdmin.layout.title')}</span>
            </div>

            {/* 3개국어 전환기 */}
            <div className="super-admin-lang-dropdown" ref={langRef}>
              <button
                type="button"
                className={`super-admin-lang-button ${langOpen ? 'active' : ''}`}
                onClick={() => setLangOpen((v) => !v)}
                aria-label={t('profile.superAdmin.layout.language')}
                aria-expanded={langOpen}
              >
                <span>{currentLang.label}</span>
                <ChevronDown size={16} strokeWidth={2} />
              </button>
              <div className={`super-admin-lang-menu ${langOpen ? 'show' : ''}`}>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`super-admin-lang-item ${i18n.language === opt.value ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 홈 버튼 */}
            <Link to="/" className="super-admin-home-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              <span>{t('common.backHome')}</span>
            </Link>
          </div>
        </header>
        <main 
          className="super-admin-main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

