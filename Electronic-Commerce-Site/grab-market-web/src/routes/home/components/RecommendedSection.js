import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../../config/constants';

// 카테고리 ID를 번역 키로 변환
const getCategoryKey = (categoryId) => {
  const categoryMap = {
    1: 'fe',
    2: 'be',
    3: 'design',
    4: 'mg',
    5: 'inf',
    6: 'sec',
    7: 'doc'
  };
  return categoryMap[categoryId] || null;
};

const RecommendedSection = ({ products }) => {
  const { t } = useTranslation();
  const trackRef = useRef(null);
  const autoSlideRef = useRef(null);
  const containerRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const currentIndexRef = useRef(3);
  const [activeIndicator, setActiveIndicator] = useState(0); // 인디케이터 업데이트용 state

  const totalItems = products.length; // 실제 상품 개수 (9개)
  const cloneCount = 3; // 앞뒤 복제 개수
  const indicatorCount = 3; // 인디케이터 개수 (고정)

  // 원본 상품 + 앞뒤 복제본 생성
  const displayProducts = React.useMemo(() => {
    if (products.length === 0) return [];
    
    // 마지막 3개 복제 (앞에)
    const lastThree = products.slice(-3);
    // 처음 3개 복제 (뒤에)
    const firstThree = products.slice(0, 3);
    
    return [...lastThree, ...products, ...firstThree];
  }, [products]);

  // 슬라이드 업데이트
  const updateCarousel = useCallback((index, transition = true) => {
    if (!trackRef.current) return;

    const items = trackRef.current.children;
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth;
    const gap = 20;
    const offset = -(itemWidth + gap) * index;

    if (!transition) {
      trackRef.current.style.transition = 'none';
    } else {
      // 더 부드러운 전환을 위한 설정
      trackRef.current.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    trackRef.current.style.transform = `translateX(${offset}px)`;
  }, []);

  // 다음 슬라이드 (하나씩 밀리기)
  const nextSlide = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const nextIndex = currentIndexRef.current + 1;
    currentIndexRef.current = nextIndex;
    
    // 인디케이터 업데이트
    const realIndex = (nextIndex - cloneCount + totalItems) % totalItems;
    setActiveIndicator(realIndex % indicatorCount);
    
    updateCarousel(nextIndex, true);

    // 마지막 복제본에 도달하면 첫 번째 원본으로 점프 (트랜지션 없이)
    if (nextIndex >= totalItems + cloneCount) {
      setTimeout(() => {
        currentIndexRef.current = cloneCount;
        updateCarousel(cloneCount, false);
        isTransitioningRef.current = false;
        // 인디케이터도 첫 번째로 리셋
        setActiveIndicator(0);
      }, 600); // 전환 시간과 동일하게
    } else {
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 600); // 전환 시간과 동일하게
    }
  }, [totalItems, cloneCount, indicatorCount, updateCarousel]);

  // 자동 슬라이드 초기화
  useEffect(() => {
    if (products.length === 0) return;

    // 초기 위치 설정 (트랜지션 없이)
    currentIndexRef.current = cloneCount;
    updateCarousel(cloneCount, false);
    setActiveIndicator(0); // 초기 인디케이터 설정

    autoSlideRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [products.length, updateCarousel, nextSlide]);

  // 인디케이터 클릭
  const handleIndicatorClick = useCallback((indicatorIndex) => {
    if (isTransitioningRef.current) return;
    
    // 현재 실제 인덱스 계산
    const currentRealIndex = (currentIndexRef.current - cloneCount + totalItems) % totalItems;
    
    // 인디케이터에 해당하는 다음 상품 인덱스 찾기
    // 현재 인덱스 이후에서 같은 인디케이터를 가진 상품 찾기
    let targetProductIndex = currentRealIndex;
    for (let i = 0; i < totalItems; i++) {
      const checkIndex = (currentRealIndex + i + 1) % totalItems;
      if (checkIndex % indicatorCount === indicatorIndex) {
        targetProductIndex = checkIndex;
        break;
      }
    }
    
    const targetIndex = cloneCount + targetProductIndex;
    
    currentIndexRef.current = targetIndex;
    setActiveIndicator(indicatorIndex); // 인디케이터 업데이트
    updateCarousel(targetIndex, true);
    
    // 자동 슬라이드 타이머 리셋
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
    autoSlideRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  }, [cloneCount, totalItems, indicatorCount, updateCarousel, nextSlide]);

  // 마우스 hover 시 자동 슬라이드 멈춤
  const handleMouseEnter = useCallback(() => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    autoSlideRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  }, [nextSlide]);

  // 윈도우 리사이즈 시 재계산
  useEffect(() => {
    const handleResize = () => {
      updateCarousel(currentIndexRef.current, false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCarousel]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="featured-card recommended-card">
      <div className="featured-header">
        <div>
          <h2 className="featured-title">{t('home.recommended.title')}</h2>
          <p className="featured-subtitle">{t('home.recommended.subtitle')}</p>
        </div>
      </div>
      <div 
        className="recommended-slider-container"
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="recommended-carousel">
          <div className="recommended-track" ref={trackRef}>
            {displayProducts.map((product, index) => {
              const isClone = index < cloneCount || index >= cloneCount + totalItems;
              return (
                <Link
                  key={`${product.id}-${index}`}
                  to={`/products/${product.id}`}
                  className={`recommended-item ${isClone ? 'clone' : ''}`}
                >
                  <div className="recommended-avatar">
                    <img
                      src={`${API_URL}/${product.imageUrl}`}
                      alt={product.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.textContent = product.name.substring(0, 2);
                      }}
                    />
                  </div>
                  <div className="recommended-info">
                    <div className="recommended-name">{product.name}</div>
                    <div className="recommended-category">
                      {(() => {
                        const categoryKey = getCategoryKey(product.category_id);
                        return categoryKey 
                          ? t(`home.tabs.${categoryKey}`)
                          : (product.category_name || t('purchase.productCard.categoryFallback'));
                      })()}
                    </div>
                    <div className="recommended-rating">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#FCD34D" stroke="#FCD34D">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span>{parseFloat(product.rating_average || 0).toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="recommended-price">¥{product.price.toLocaleString()}</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 인디케이터 (3개 고정) */}
        <div className="slider-indicators">
          {Array.from({ length: indicatorCount }).map((_, index) => (
            <button
              key={index}
              className={`indicator ${activeIndicator === index ? 'active' : ''}`}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedSection;
