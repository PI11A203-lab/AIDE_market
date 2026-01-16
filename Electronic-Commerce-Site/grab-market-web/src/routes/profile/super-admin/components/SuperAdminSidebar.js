import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Package, GraduationCap, Globe, Lock, X, UserCheck } from 'lucide-react';
import './SuperAdminSidebar.css';

export default function SuperAdminSidebar({ isOpen = true, onClose }) {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      path: '/profile/super-admin',
      label: t('profile.superAdmin.sidebar.dashboard'),
      icon: Shield,
      exact: true
    },
    {
      path: '/profile/super-admin/products',
      label: t('profile.superAdmin.sidebar.products'),
      icon: Package
    },
    {
      path: '/profile/super-admin/student-verifications',
      label: t('profile.superAdmin.sidebar.studentVerifications'),
      icon: GraduationCap
    },
    {
      path: '/profile/super-admin/seller-applications',
      label: '판매자 신청 관리',
      icon: UserCheck
    },
    {
      path: '/profile/super-admin/ip-management',
      label: t('profile.superAdmin.sidebar.ipManagement'),
      icon: Globe
    },
    {
      path: '/profile/super-admin/security',
      label: t('profile.superAdmin.sidebar.security'),
      icon: Lock
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className={`super-admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-title">
          <Shield size={20} />
          <span>{t('profile.superAdmin.layout.title')}</span>
        </div>
        <button 
          className="sidebar-close-button"
          onClick={onClose}
          aria-label={t('profile.superAdmin.layout.closeMenu')}
        >
          <X size={20} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${active ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

