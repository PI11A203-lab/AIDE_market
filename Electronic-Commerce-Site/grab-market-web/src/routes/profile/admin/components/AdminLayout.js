import React, { useState, useEffect } from 'react';
import ProfileHeader from '../../components/ProfileHeader';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

export default function AdminLayout({ children }) {
  // 모바일에서는 기본적으로 닫힘, 데스크톱에서는 열림
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth > 768;
  });

  useEffect(() => {
    const handleResize = () => {
      // 데스크톱으로 전환 시 사이드바 자동 열기
      if (window.innerWidth > 768 && !sidebarOpen) {
        setSidebarOpen(true);
      }
      // 모바일로 전환 시 사이드바 닫기
      if (window.innerWidth <= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <ProfileHeader onMenuClick={toggleSidebar} showMenuButton={true} />
      {sidebarOpen && (
        <div 
          className="admin-sidebar-backdrop"
          onClick={toggleSidebar}
        />
      )}
      <div className="admin-layout-content">
        <AdminSidebar isOpen={sidebarOpen} />
        <main className={`admin-main-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

