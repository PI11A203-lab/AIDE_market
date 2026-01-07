import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Package, GraduationCap, Globe, Lock, X } from 'lucide-react';
import './SuperAdminSidebar.css';

export default function SuperAdminSidebar({ isOpen = true, onClose }) {
  const location = useLocation();

  const menuItems = [
    {
      path: '/profile/super-admin',
      label: 'ダッシュボード',
      icon: Shield,
      exact: true
    },
    {
      path: '/profile/super-admin/products',
      label: '商品承認管理',
      icon: Package
    },
    {
      path: '/profile/super-admin/student-verifications',
      label: '学生認証管理',
      icon: GraduationCap
    },
    {
      path: '/profile/super-admin/ip-management',
      label: 'IP管理',
      icon: Globe
    },
    {
      path: '/profile/super-admin/security',
      label: 'セキュリティ',
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
          <span>サイト管理者</span>
        </div>
        <button 
          className="sidebar-close-button"
          onClick={onClose}
          aria-label="메뉴 닫기"
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

