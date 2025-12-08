import React, { useState, useEffect, useRef } from 'react';

const CategorySidebar = ({ categories, selectedCategory, onCategoryChange, sortBy, onSortChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    { value: 'download', label: 'Most Downloaded' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Recently Added' },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Most Downloaded';

  const handleSortChange = (value) => {
    onSortChange(value);
    setDropdownOpen(false);
  };

  // 카테고리 필터 탭 (MainPageModern.html 스타일)
  const filterTabs = [
    { id: 'all', name: 'All Developers' },
    { id: 'fe', name: 'Frontend' },
    { id: 'be', name: 'Backend' },
    { id: 'design', name: 'Design' },
    { id: 'mg', name: 'AI/ML' },
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
