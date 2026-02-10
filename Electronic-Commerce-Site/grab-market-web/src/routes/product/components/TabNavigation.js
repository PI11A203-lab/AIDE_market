import React from 'react';
import OverviewTab from './OverviewTab';
import ProjectsTab from './ProjectsTab';
import ReviewsTab from './ReviewsTab';
import { useTranslation } from 'react-i18next';

export default function TabNavigation({ activeTab, onTabChange, developer }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => onTabChange('overview')}
          className={`flex-1 py-[18px] px-6 text-[15px] font-semibold transition-all border-b-2 ${
            activeTab === 'overview' 
              ? 'text-gray-900 border-gray-900' 
              : 'text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {t('product.tabs.overview')}
        </button>
        <button
          onClick={() => onTabChange('projects')}
          className={`flex-1 py-[18px] px-6 text-[15px] font-semibold transition-all border-b-2 ${
            activeTab === 'projects' 
              ? 'text-gray-900 border-gray-900' 
              : 'text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {t('product.tabs.projects')}
        </button>
        <button
          onClick={() => onTabChange('reviews')}
          className={`flex-1 py-[18px] px-6 text-[15px] font-semibold transition-all border-b-2 ${
            activeTab === 'reviews' 
              ? 'text-gray-900 border-gray-900' 
              : 'text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {t('product.tabs.reviews', { count: developer.reviewCount })}
        </button>
      </div>
      <div className="p-8">
        {activeTab === 'overview' && <OverviewTab hexagonStats={developer.hexagonStats} />}
        {activeTab === 'projects' && (
          <ProjectsTab projects={developer.projects} developer={developer} />
        )}
        {activeTab === 'reviews' && (
          <ReviewsTab 
            reviews={developer.reviews} 
            productId={developer.id}
            onReviewUpdate={developer.onReviewUpdate}
            onHelpfulUpdate={developer.onHelpfulUpdate}
          />
        )}
      </div>
    </div>
  );
}

