import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const CategorySidebar = ({ categories, selectedCategory, onCategoryChange, sortBy, onSortChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 정렬 옵션
  const sortOptions = [
    { value: 'download', label: t('home.sort.download') },
    { value: 'rating', label: t('home.sort.rating') },
    { value: 'price', label: t('home.sort.price') },
    { value: 'priceDesc', label: t('home.sort.priceDesc') },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Most Downloaded';

  const handleSortChange = (value) => {
    onSortChange(value);
    setDropdownOpen(false);
  };

  // 카테고리 필터 탭 - categories prop이 있으면 사용, 없으면 기본값 사용
  const filterTabs = categories && categories.length > 0 
    ? categories.map(cat => ({ id: cat.id, name: cat.name }))
    : [
        { id: 'all', name: t('home.tabs.all') },
        { id: 'fe', name: t('home.tabs.fe') },
        { id: 'be', name: t('home.tabs.be') },
        { id: 'design', name: t('home.tabs.design') },
        { id: 'mg', name: t('home.tabs.mg') },
      ];

  return (
    <>
      {/* 필터 섹션 */}
      <div className="filter-section">
        <div className="filter-tabs">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              className={`filter-tab ${selectedCategory === tab.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <div className="custom-dropdown" ref={dropdownRef}>
          <button 
            className={`dropdown-button ${dropdownOpen ? 'active' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="dropdown-label">{currentSortLabel}</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className={`dropdown-item ${sortBy === option.value ? 'active' : ''}`}
                onClick={() => handleSortChange(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySidebar;
