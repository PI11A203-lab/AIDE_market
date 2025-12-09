import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, MessageSquare, ShoppingCart } from 'lucide-react';
import './AdminSidebar.css';
import { useTranslation } from 'react-i18next';

export default function AdminSidebar({ isOpen = true }) {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      path: '/profile',
      label: t('profile.admin.sidebar.dashboard'),
      icon: LayoutDashboard,
      exact: true
    },
    {
      path: '/profile/products',
      label: t('profile.admin.sidebar.products'),
      icon: Package
    },
    {
      path: '/profile/reviews',
      label: t('profile.admin.sidebar.reviews'),
      icon: MessageSquare
    },
    {
      path: '/profile/orders',
      label: t('profile.admin.sidebar.orders'),
      icon: ShoppingCart
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="admin-sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar-item ${active ? 'active' : ''}`}
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

