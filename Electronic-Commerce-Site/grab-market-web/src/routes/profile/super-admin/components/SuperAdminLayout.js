import React from 'react';
import SuperAdminSidebar from './SuperAdminSidebar';
import './SuperAdminLayout.css';

export default function SuperAdminLayout({ children }) {
  return (
    <div className="super-admin-container">
      <SuperAdminSidebar />
      <main className="super-admin-main">
        {children}
      </main>
    </div>
  );
}

