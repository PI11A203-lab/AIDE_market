import React, { useMemo, useRef, useState } from 'react';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import DeveloperCard from './DeveloperCard';

// 카테고리 ID 매핑 (숫자 → 문자열)
const CATEGORY_ID_TO_NAME = {
  1: 'フロントエンド',
  2: 'バックエンド',
  3: 'イメージ',
  4: '設計・マネジメント',
  5: 'インフラ',
  6: 'セキュリティ',
  7: 'ドキュメント',
};

// 카테고리 ID → 아이콘 경로 매핑
const CATEGORY_ID_TO_ICON = {
  1: '/images/icons/fe.png',
  2: '/images/icons/be.png',
  3: '/images/icons/design.png',
  4: '/images/icons/mg.png',
  5: '/images/icons/inf.png',
  6: '/images/icons/sec.png',
  7: '/images/icons/doc.png',
};

// 카테고리 순서 정의
const CATEGORY_ORDER = [1, 2, 3, 4, 5, 6, 7];

export default function AvailableDevelopers({ 
  developers, 
  selectedTeam, 
  maxTeamSize, 
  onAddToTeam, 
  onRemoveFromTeam 
}) {
  // 카테고리별로 그룹화
  const developersByCategory = useMemo(() => {
    const grouped = {};
    
    developers.forEach(dev => {
      const categoryId = dev.categoryId || 'other';
      const categoryName = categoryId && categoryId !== 'other' 
        ? (CATEGORY_ID_TO_NAME[categoryId] || dev.category) 
        : (dev.category || 'その他');
      
      if (!grouped[categoryId]) {
        grouped[categoryId] = {
          id: categoryId,
          name: categoryName,
          icon: categoryId && categoryId !== 'other' ? CATEGORY_ID_TO_ICON[categoryId] : null,
          developers: []
        };
      }
      grouped[categoryId].developers.push(dev);
    });
    
    // 카테고리 순서대로 정렬
    const sortedCategories = CATEGORY_ORDER
      .filter(id => grouped[id])
      .map(id => grouped[id])
      .concat(
        Object.keys(grouped)
          .filter(id => id !== 'other' && !CATEGORY_ORDER.includes(parseInt(id)))
          .map(id => grouped[id])
      )
      .concat(grouped['other'] ? [grouped['other']] : []);
    
    return sortedCategories;
  }, [developers]);

  return (
    <div className="available-developers-section">
      <div className="section-card">
        <h3 className="section-title">
          <Users className="section-icon" />
          利用可能なAI開発者
        </h3>
        
        <div className="categories-container">
          {developersByCategory.map(category => (
            <CategorySection
              key={category.id}
              category={category}
              selectedTeam={selectedTeam}
              maxTeamSize={maxTeamSize}
              onAddToTeam={onAddToTeam}
              onRemoveFromTeam={onRemoveFromTeam}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategorySection({ category, selectedTeam, maxTeamSize, onAddToTeam, onRemoveFromTeam }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      // 한 번에 3개씩 스크롤 (카드 너비 280px + gap 1rem = 약 296px)
      const cardWidth = 280;
      const gap = 16;
      const scrollAmount = (cardWidth + gap) * 3; // 3개씩 스크롤
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollButtons, 300);
    }
  };

  React.useEffect(() => {
    // 초기 상태 확인을 위해 약간의 지연
    setTimeout(() => {
      checkScrollButtons();
    }, 100);
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [category.developers]);

  return (
    <div className="category-section">
      <h4 className="category-title">
        {category.name}
      </h4>
      <div className="category-content-wrapper">
        {canScrollLeft && (
          <button 
            className="scroll-button scroll-button-left"
            onClick={() => scroll('left')}
            aria-label="左にスクロール"
          >
            <ChevronLeft className="scroll-icon" />
          </button>
        )}
        <div 
          className="developers-scroll-container"
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
        >
          <div className="developers-horizontal-list">
            {category.developers.map((dev) => {
              const isSelected = selectedTeam.find(d => d.id === dev.id);
              const isFull = selectedTeam.length >= maxTeamSize;
              return (
                <div key={dev.id} className="developer-card-wrapper">
                  <DeveloperCard
                    developer={dev}
                    isSelected={!!isSelected}
                    isFull={isFull}
                    onAdd={onAddToTeam}
                    onRemove={onRemoveFromTeam}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {canScrollRight && (
          <button 
            className="scroll-button scroll-button-right"
            onClick={() => scroll('right')}
            aria-label="右にスクロール"
          >
            <ChevronRight className="scroll-icon" />
          </button>
        )}
      </div>
    </div>
  );
}
