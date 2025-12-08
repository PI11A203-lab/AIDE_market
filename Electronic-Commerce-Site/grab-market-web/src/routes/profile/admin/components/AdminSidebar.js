import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, MessageSquare, ShoppingCart } from 'lucide-react';
import './AdminSidebar.css';

export default function AdminSidebar({ isOpen = true }) {
  const location = useLocation();

  const menuItems = [
    {
      path: '/profile',
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      path: '/profile/products',
      label: 'Products',
      icon: Package
    },
    {
      path: '/profile/reviews',
      label: 'Reviews',
      icon: MessageSquare
    },
    {
      path: '/profile/orders',
      label: 'Orders',
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

