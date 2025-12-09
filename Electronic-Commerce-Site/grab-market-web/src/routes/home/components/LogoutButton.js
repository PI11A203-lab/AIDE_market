import React from 'react';
import { LogOut } from 'lucide-react';
import '../index.css';
import { useTranslation } from 'react-i18next';

const LogoutButton = ({ onLogout }) => {
  const { t } = useTranslation();
  return (
    <button onClick={onLogout} className="btn-logout" title={t('common.logout')} aria-label={t('common.logout')}>
      <LogOut className="logout-icon" />
    </button>
  );
};

export default LogoutButton;

