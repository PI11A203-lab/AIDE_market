import React from 'react';
import { ShoppingBag, Star, Users, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TabNavigation({ activeTab, onTabChange }) {
  const { t } = useTranslation();
  return (
    <div className="profile-tabs">
      <button
        onClick={() => onTabChange('purchases')}
        className={`tab-button ${activeTab === 'purchases' ? 'active' : ''}`}
      >
        <ShoppingBag className="tab-icon" />
        {t('profile.tabs.purchases')}
      </button>
      <button
        onClick={() => onTabChange('reviews')}
        className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
      >
        <Star className="tab-icon" />
        {t('profile.tabs.reviews')}
      </button>
      <button
        onClick={() => onTabChange('teams')}
        className={`tab-button ${activeTab === 'teams' ? 'active' : ''}`}
      >
        <Users className="tab-icon" />
        {t('profile.tabs.teams')}
      </button>
      <button
        onClick={() => onTabChange('favorites')}
        className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
      >
        <Heart className="tab-icon" />
        {t('profile.tabs.favorites')}
      </button>
    </div>
  );
}

