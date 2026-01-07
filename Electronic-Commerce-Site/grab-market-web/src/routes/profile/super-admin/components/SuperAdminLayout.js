import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Menu, X } from 'lucide-react';
import SuperAdminSidebar from './SuperAdminSidebar';
import './SuperAdminLayout.css';

const SIDEBAR_STORAGE_KEY = 'superAdminSidebarOpen';

export default function SuperAdminLayout({ children }) {
  const { t } = useTranslation();
  
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
              aria-label="메뉴 토글"
            >
              {sidebarOpen ? (
                <X size={22} strokeWidth={2.5} />
              ) : (
                <Menu size={22} strokeWidth={2.5} />
              )}
            </button>
            
            {/* 로고 */}
            <div className="super-admin-header-logo">
              <span>サイト管理者</span>
            </div>

            {/* 홈 버튼 */}
            <Link to="/" className="super-admin-home-link">
              <Home size={18} />
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

