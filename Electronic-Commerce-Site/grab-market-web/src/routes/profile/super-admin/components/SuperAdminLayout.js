import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import SuperAdminSidebar from './SuperAdminSidebar';
import './SuperAdminLayout.css';

const SIDEBAR_STORAGE_KEY = 'superAdminSidebarOpen';

export default function SuperAdminLayout({ children }) {
  const { t, i18n } = useTranslation();

  // 메인에서 선택한 언어(localStorage)를 적용해 전 페이지 동기화
  useEffect(() => {
    const syncLanguage = () => {
      const saved = localStorage.getItem('appLanguage');
      if (saved && ['ko', 'ja', 'en'].includes(saved) && saved !== i18n.language) {
        i18n.changeLanguage(saved);
      }
    };
    syncLanguage();
    // 다른 탭 또는 메인에서 언어 변경 시 동기화
    const onStorage = (e) => {
      if (e.key === 'appLanguage' && e.newValue && ['ko', 'ja', 'en'].includes(e.newValue)) {
        i18n.changeLanguage(e.newValue);
      }
    };
    // 탭 전환 후 다시 보일 때 localStorage 기준으로 동기화
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') syncLanguage();
    };
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [i18n]);

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

