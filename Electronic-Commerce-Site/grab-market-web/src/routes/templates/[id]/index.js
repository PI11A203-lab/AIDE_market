import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { Search, ShoppingCart, Globe, ArrowLeft, Users, Package, Code, Smartphone, BarChart3, FileText, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { api } from '../../../config/api';
import { API_URL } from '../../../config/constants';
import axios from 'axios';
import LogoutButton from '../../home/components/LogoutButton';
import ProductList from '../../home/components/ProductList';
import { TEMPLATE_DETAILS_MAP } from '../templateData';
import { TEMPLATE_COMPATIBILITY_MAP } from '../templateCompatibility';
import './index.css';

// 템플릿 카테고리 정의
const TEMPLATE_CATEGORIES = {
  web: { name: '웹개발', icon: Code, color: '#667eea' },
  app: { name: '어플개발', icon: Smartphone, color: '#f093fb' },
  data: { name: '데이터 분석', icon: BarChart3, color: '#4facfe' },
  document: { name: '문서', icon: FileText, color: '#43e97b' },
  image: { name: '이미지생성', icon: ImageIcon, color: '#fa709a' }
};

// 템플릿 아이콘 매핑 함수
const getTemplateIcon = (category) => {
  return TEMPLATE_CATEGORIES[category]?.icon || Code;
};

function TemplateDetailPage() {
  const { id } = useParams();
  const history = useHistory();
  const [template, setTemplate] = useState(null);
  const [products, setProducts] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const languageOptions = [
    { value: 'ko', label: '한국어' },
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' },
  ];


  useEffect(() => {
    loadTemplateDetail();
    loadAllTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // i18n 언어 변경 이벤트 구독
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userFromStorage) {
        try {
          setUser(JSON.parse(userFromStorage));
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      } else {
        setUser(null);
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  // 언어 드롭다운 외부 클릭 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  };

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
    setLanguage(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', value);
    }
    setLangOpen(false);
  };

  const currentLangLabel =
    languageOptions.find((opt) => opt.value === language)?.label || 'Language';

  // 다국어 필드 선택 헬퍼 함수
  const getLocalizedField = (template, field) => {
    if (!template) return '';
    if (language === 'ja' && template[`${field}_ja`]) {
      return template[`${field}_ja`];
    }
    if (language === 'en' && template[`${field}_en`]) {
      return template[`${field}_en`];
    }
    return template[field] || '';
  };

  // 실제 상품 데이터를 가져와서 템플릿에 매핑
  const loadProductsForTemplate = useCallback(async (templateId) => {
    try {
      // 전체 상품 목록 가져오기
      const response = await axios.get(`${API_URL}/api/products`, { 
        params: { limit: 100, sort: 'download' } 
      });
      const allProducts = response.data.products || response.data || [];
      
      // 템플릿 상세 정보 가져오기
      const templateDetail = TEMPLATE_DETAILS_MAP[templateId];
      if (!templateDetail) {
        return null;
      }

      const categoryIds = templateDetail.categoryIds || [];
      const matchedProducts = allProducts.filter(p => categoryIds.includes(p.category_id));
      
      // 템플릿별로 적절한 상품 개수로 제한
      const limitedProducts = matchedProducts.slice(0, templateDetail.productLimit || 5);

      return {
        ...templateDetail,
        id: templateId,
        products: limitedProducts
      };
    } catch (error) {
      console.error('상품 데이터 로드 실패:', error);
      return null;
    }
  }, []);

  const loadTemplateDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.templates.getDetail(id);
      const apiTemplate = response.data.template;
      
      // API 템플릿에 TEMPLATE_DETAILS_MAP의 다국어 필드 병합
      const templateDetails = TEMPLATE_DETAILS_MAP[parseInt(id)] || {};
      const mergedTemplate = {
        ...apiTemplate,
        name_ja: templateDetails.name_ja || apiTemplate.name_ja,
        name_en: templateDetails.name_en || apiTemplate.name_en,
        description_ja: templateDetails.description_ja || apiTemplate.description_ja,
        description_en: templateDetails.description_en || apiTemplate.description_en,
        projectDescription_ja: templateDetails.projectDescription_ja || apiTemplate.projectDescription_ja,
        projectDescription_en: templateDetails.projectDescription_en || apiTemplate.projectDescription_en,
        whySelected_ja: templateDetails.whySelected_ja || apiTemplate.whySelected_ja,
        whySelected_en: templateDetails.whySelected_en || apiTemplate.whySelected_en,
        aiDescriptions_ja: templateDetails.aiDescriptions_ja || apiTemplate.aiDescriptions_ja,
        aiDescriptions_en: templateDetails.aiDescriptions_en || apiTemplate.aiDescriptions_en,
        // TEMPLATE_DETAILS_MAP의 다른 필드도 병합
        projectDescription: templateDetails.projectDescription || apiTemplate.projectDescription,
        whySelected: templateDetails.whySelected || apiTemplate.whySelected,
        aiDescriptions: templateDetails.aiDescriptions || apiTemplate.aiDescriptions,
        category: templateDetails.category || apiTemplate.category
      };
      
      setTemplate(mergedTemplate);
      setProducts(mergedTemplate.products || []);
    } catch (error) {
      console.error('템플릿 상세 로드 실패:', error);
      // API가 없을 때 실제 상품 데이터를 가져와서 템플릿 구성
      const templateData = await loadProductsForTemplate(parseInt(id));
      if (templateData) {
        setTemplate(templateData);
        setProducts(templateData.products || []);
      } else {
        setTemplate(null);
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [id, loadProductsForTemplate]);

  const loadAllTemplates = useCallback(async () => {
    try {
      const response = await api.templates.getList({ limit: 100 });
      const apiTemplates = response.data.templates || [];
      if (apiTemplates.length > 0) {
        // API 템플릿에 TEMPLATE_DETAILS_MAP의 다국어 필드 병합
        const mergedTemplates = apiTemplates.map(template => {
          const details = TEMPLATE_DETAILS_MAP[template.id] || {};
          return {
            ...template,
            name_ja: details.name_ja || template.name_ja,
            name_en: details.name_en || template.name_en,
            name: details.name || template.name
          };
        });
        setAllTemplates(mergedTemplates);
      } else {
        // 목 템플릿 목록 (템플릿 상세 데이터에서 가져오기)
        const mockTemplates = Object.keys(TEMPLATE_DETAILS_MAP).map(id => {
          const details = TEMPLATE_DETAILS_MAP[id];
          return {
            id: parseInt(id),
            name: details.name,
            name_ja: details.name_ja,
            name_en: details.name_en
          };
        });
        setAllTemplates(mockTemplates);
      }
    } catch (error) {
      console.error('템플릿 목록 로드 실패:', error);
      // 목 템플릿 목록 (템플릿 상세 데이터에서 가져오기)
      const mockTemplates = Object.keys(TEMPLATE_DETAILS_MAP).map(id => {
        const details = TEMPLATE_DETAILS_MAP[id];
        return {
          id: parseInt(id),
          name: details.name,
          name_ja: details.name_ja,
          name_en: details.name_en
        };
      });
      setAllTemplates(mockTemplates);
    }
  }, []);

  // 템플릿 구성 그대로 장바구니에 추가
  const handleAddToCart = async () => {
    if (!user) {
      message.warning('로그인이 필요합니다.');
      history.push('/login');
      return;
    }

    try {
      const userId = user.id;
      const addedProducts = [];
      const failedProducts = [];
      
      // 각 상품을 순차적으로 장바구니에 추가
      for (const product of products) {
        try {
          // 이미 구매한 상품인지 확인 (구매한 상품은 장바구니에 추가하지 않음)
          if (product.is_purchased === 1 || product.is_purchased === true) {
            failedProducts.push(product.name);
            continue;
          }
          
          await api.carts.addItem({
            user_id: userId,
            product_id: product.id,
            quantity: 1
          });
          addedProducts.push(product.name);
        } catch (error) {
          console.error(`상품 ${product.name} (ID: ${product.id}) 장바구니 추가 실패:`, error);
          // 400 에러는 이미 장바구니에 있는 상품일 수 있음
          if (error.response?.status !== 400) {
            failedProducts.push(product.name);
          } else {
            // 이미 장바구니에 있는 상품도 성공으로 처리
            addedProducts.push(product.name);
          }
        }
      }

      if (addedProducts.length > 0) {
        if (failedProducts.length > 0) {
          message.warning(`${addedProducts.length}개 상품이 장바구니에 추가되었습니다. ${failedProducts.length}개 상품은 추가할 수 없습니다.`);
        } else {
          message.success(`${addedProducts.length}개 상품이 장바구니에 추가되었습니다.`);
        }
      } else {
        if (failedProducts.length > 0) {
          message.error('모든 상품을 장바구니에 추가할 수 없습니다. (이미 구매했거나 장바구니에 있는 상품일 수 있습니다)');
        }
      }
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      message.error('장바구니 추가 중 오류가 발생했습니다.');
    }
  };

  // 템플릿 구성 그대로 구매
  const handleBuyNow = () => {
    if (!user) {
      message.warning('로그인이 필요합니다.');
      history.push('/login');
      return;
    }

    // 템플릿의 모든 상품을 구매 페이지로 전달
    const templateProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category_name || p.category,
      price: p.price,
      avatar: p.name?.substring(0, 2) || 'AI',
      imageUrl: p.imageUrl || p.image_url || null,
      is_purchased: p.is_purchased === 1 || p.is_purchased === true,
      tags: p.tags || []
    }));

    // state로 상품 정보 전달
    history.push({
      pathname: '/purchase',
      state: {
        templateProducts: templateProducts,
        templateId: id,
        templateName: template?.name || TEMPLATE_DETAILS_MAP[parseInt(id)]?.name || 'Template'
      }
    });
  };

  // 템플릿을 팀으로 구성 추가
  const handleAddToTeam = async () => {
    if (!user) {
      message.warning('로그인이 필요합니다.');
      history.push('/login');
      return;
    }

    if (!products || products.length === 0) {
      message.warning('추가할 상품이 없습니다.');
      return;
    }

    try {
      const userId = user.id;
      
      // 템플릿 이름 가져오기 (다국어 지원)
      const templateName = getLocalizedField(template, 'name') || template.name || 'Template';
      
      // 팀 구성 생성
      const teamCompositionResponse = await api.teamCompositions.create({
        user_id: userId,
        name: `${templateName} 템플릿`,
        total_synergy_score: 85
      });

      const teamId = teamCompositionResponse.data?.teamComposition?.id || 
                     teamCompositionResponse.data?.id;
      
      if (!teamId) {
        throw new Error('팀 ID를 가져올 수 없습니다.');
      }

      // 각 상품을 팀 멤버로 추가 (순차적으로 처리하여 에러 추적 가능)
      const addedMembers = [];
      const failedMembers = [];
      
      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        try {
          // category_id 확인 및 변환
          let categoryId = product.category_id || product.categoryId;
          if (typeof categoryId === 'string') {
            categoryId = parseInt(categoryId);
          }
          
          if (!categoryId || isNaN(categoryId) || categoryId < 1 || categoryId > 7) {
            // category_id가 없거나 유효하지 않으면 기본값 사용
            categoryId = 1; // frontend
          }

          // 요청 데이터 확인
          const memberData = {
            team_id: teamId,
            product_id: product.id,
            category_id: categoryId,
            position: index + 1  // 팀 페이지와 동일하게 숫자로 설정
          };

          console.log(`팀 멤버 추가 시도:`, memberData);

          const response = await api.teamMembers.create(memberData);
          console.log(`팀 멤버 추가 성공:`, response.data);
          
          addedMembers.push(product.name || `상품 ${product.id}`);
        } catch (error) {
          console.error(`상품 ${product.name || product.id} (ID: ${product.id}) 팀 멤버 추가 실패:`, error);
          console.error('에러 상세:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          failedMembers.push(product.name || `상품 ${product.id}`);
        }
      }

      if (addedMembers.length > 0) {
        if (failedMembers.length > 0) {
          message.warning(`${addedMembers.length}개 상품이 팀에 추가되었습니다. ${failedMembers.length}개 상품은 추가할 수 없습니다.`);
        } else {
          message.success(`${addedMembers.length}개 상품이 팀에 추가되었습니다.`);
        }
        // 팀 페이지로 이동
        setTimeout(() => {
          history.push('/team');
        }, 1000);
      } else {
        message.error('팀에 추가할 수 있는 상품이 없습니다.');
        // 팀 구성이 생성되었지만 멤버가 없으면 삭제
        try {
          await api.teamCompositions.delete(teamId);
        } catch (deleteError) {
          console.error('빈 팀 구성 삭제 실패:', deleteError);
        }
      }
    } catch (error) {
      console.error('팀 구성 추가 실패:', error);
      const errorMessage = error.response?.data?.error || error.message || '팀 구성 추가에 실패했습니다.';
      message.error(errorMessage);
    }
  };

  // 적합성 점수 계산 (템플릿별 명시적 매핑 사용)
  const calculateCompatibility = (templateItem, product) => {
    const templateId = typeof templateItem.id === 'string' ? parseInt(templateItem.id) : (templateItem.id || 0);
    const currentTemplateId = parseInt(id) || 0;
    
    // 상품 카테고리 ID 추출 (다양한 형식 지원)
    let productCategoryId = product.category_id;
    if (typeof productCategoryId === 'string') {
      productCategoryId = parseInt(productCategoryId);
    }
    if (!productCategoryId || isNaN(productCategoryId) || productCategoryId < 1 || productCategoryId > 7) {
      // category_id가 없거나 유효하지 않으면 기본값
      return '△';
    }
    
    // 현재 템플릿 행이고, 현재 템플릿에 포함된 상품인지 확인
    // (비교표에서 현재 페이지의 템플릿 행에서만 "매우 적합" 표시)
    if (templateId === currentTemplateId) {
      const isInCurrentTemplate = template && 
        (template.id === currentTemplateId || parseInt(template.id) === currentTemplateId) && 
        products.some(p => p.id === product.id || parseInt(p.id) === parseInt(product.id));
      
      if (isInCurrentTemplate) {
        return '⭕'; // 현재 템플릿에 포함된 상품 - 매우 적합
      }
    }
    
    // 템플릿별 적합성 매핑에서 가져오기
    if (TEMPLATE_COMPATIBILITY_MAP && TEMPLATE_COMPATIBILITY_MAP[templateId]) {
      const templateCompatibility = TEMPLATE_COMPATIBILITY_MAP[templateId];
      if (templateCompatibility && templateCompatibility[productCategoryId]) {
        const result = templateCompatibility[productCategoryId];
        // 결과가 유효한 기호인지 확인
        if (['⭕', '○', '△', '✖'].includes(result)) {
          return result;
        }
      }
    }
    
    // 매핑이 없으면 기본값 (보통)
    return '△';
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: '#6B7280', fontSize: '18px' }}>템플릿을 찾을 수 없습니다.</p>
          <Link to="/templates" style={{ color: '#667eea', textDecoration: 'underline', marginTop: '16px', display: 'inline-block' }}>
            템플릿 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="page-container">
      {/* 헤더 */}
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" style={{ color: '#1A1A1A', textDecoration: 'none' }}>
            <span className="logo-text" style={{ color: '#1A1A1A' }}>{t('header.title')}</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">{t('home.nav.marketplace')}</Link>
            <Link to="/rankings" className="nav-link">{t('home.nav.rankings')}</Link>
            <Link to="/templates" className="nav-link">{t('home.nav.templates')}</Link>
            <Link to="/team" className="nav-link">{t('home.nav.teams')}</Link>
            <Link to="/resources" className="nav-link">{t('home.nav.resources')}</Link>
          </nav>

          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9CA3AF', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder={t('home.searchPlaceholder')}
                style={{
                  width: '200px',
                  height: '40px',
                  padding: '0 16px 0 40px',
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#1A1A1A',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.background = '#E5E7EB';
                }}
                onBlur={(e) => {
                  e.target.style.background = '#F3F4F6';
                }}
              />
            </div>
            <div className="custom-dropdown" ref={langRef} style={{ minWidth: '160px' }}>
              <button
                className={`dropdown-button ${langOpen ? 'active' : ''}`}
                onClick={() => setLangOpen((v) => !v)}
              >
                <span className="dropdown-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Globe width={16} height={16} />
                  {currentLangLabel}
                </span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={`dropdown-menu ${langOpen ? 'show' : ''}`}>
                {languageOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={`dropdown-item ${language === opt.value ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(opt.value)}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
            <Link to="/purchase" className="icon-btn">
              <ShoppingCart width={20} height={20} />
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="btn-primary">
                  {user.nickname}
                </Link>
                <LogoutButton onLogout={handleLogout} />
              </>
            ) : (
              <Link to="/login" className="btn-primary">{t('common.login')}</Link>
            )}
          </div>
        </div>
      </header>

      <main className="main" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
        <button
          onClick={() => history.push('/templates')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '24px',
            padding: 0
          }}
        >
          <ArrowLeft size={16} />
          {t('templates.detail.backToList')}
        </button>

        {/* 템플릿 헤더 */}
        <div className="template-header" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '24px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '12px', 
              background: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {React.createElement(getTemplateIcon(template?.category || TEMPLATE_DETAILS_MAP[parseInt(id)]?.category), {
                size: 40,
                color: TEMPLATE_CATEGORIES[template?.category || TEMPLATE_DETAILS_MAP[parseInt(id)]?.category]?.color || '#667eea'
              })}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
                {getLocalizedField(template, 'name') || template.name}
              </h1>
              <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '16px' }}>
                {getLocalizedField(template, 'description') || template.description || '설명이 없습니다.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', color: '#9CA3AF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} />
                  <span>{t('templates.detail.purchased', { count: template.purchase_count || 0 })}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Package size={16} />
                  <span>{t('templates.detail.aiProducts', { count: products.length })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={handleBuyNow}
              style={{
                padding: '12px 24px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#5568d3'}
              onMouseLeave={(e) => e.target.style.background = '#667eea'}
            >
              {t('templates.detail.buyNow')} (¥{totalPrice.toLocaleString()})
            </button>
            <button
              onClick={handleAddToCart}
              style={{
                padding: '12px 24px',
                background: 'white',
                color: '#667eea',
                border: '1px solid #667eea',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#F3F4F6';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
              }}
            >
              {t('templates.detail.addToCart')}
            </button>
            <button
              onClick={handleAddToTeam}
              style={{
                padding: '12px 24px',
                background: 'white',
                color: '#10b981',
                border: '1px solid #10b981',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#F0FDF4';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
              }}
            >
              <Users size={16} />
              {t('templates.detail.addToTeam')}
            </button>
          </div>
        </div>

        {/* 프로젝트 설명 섹션 */}
        {(getLocalizedField(template, 'projectDescription') || template.projectDescription) && (
          <div style={{ marginBottom: '40px', padding: '24px', background: '#F9FAFB', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>{t('templates.detail.projectDescription')}</h2>
            <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>
              {getLocalizedField(template, 'projectDescription') || template.projectDescription}
            </p>
          </div>
        )}

        {/* 왜 이 AI로 구성되었는지 */}
        {(getLocalizedField(template, 'whySelected') || template.whySelected) && (
          <div style={{ marginBottom: '40px', padding: '24px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>{t('templates.detail.whySelected')}</h2>
            <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>
              {getLocalizedField(template, 'whySelected') || template.whySelected}
            </p>
          </div>
        )}

        {/* 포함된 AI 상품 목록 */}
        {products.length > 0 && (
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
              {t('templates.detail.templateProducts')}
            </h2>
            <ProductList products={products} />
          </div>
        )}

        {/* 어떤 AI인지 설명 */}
        {((template.aiDescriptions_ja && language === 'ja') || (template.aiDescriptions_en && language === 'en') || (template.aiDescriptions && template.aiDescriptions.length > 0)) && (
          <div style={{ marginBottom: '60px', padding: '24px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>{t('templates.detail.aiDescriptions')}</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {((language === 'ja' && template.aiDescriptions_ja) || (language === 'en' && template.aiDescriptions_en) || template.aiDescriptions || []).map((desc, index) => {
                const descriptions = (language === 'ja' && template.aiDescriptions_ja) || (language === 'en' && template.aiDescriptions_en) || template.aiDescriptions || [];
                return (
                <li 
                  key={index}
                  style={{ 
                    padding: '12px 0',
                    borderBottom: index < descriptions.length - 1 ? '1px solid #E5E7EB' : 'none',
                    fontSize: '16px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <span style={{ color: '#667eea', fontWeight: 600, flexShrink: 0 }}>{index + 1}.</span>
                  <span>{desc}</span>
                </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* AI 적합성 비교표 */}
        {allTemplates.length > 0 && products.length > 0 && (
          <div className="compatibility-table-section" style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
              {t('templates.detail.compatibilityTable')}
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="compatibility-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                <thead>
                  <tr style={{ background: '#F3F4F6' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid #E5E7EB' }}>
                      {t('templates.detail.projectType')}
                    </th>
                    {products.map((product) => (
                      <th 
                        key={product.id}
                        style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, borderBottom: '2px solid #E5E7EB', borderRight: '1px solid #E5E7EB' }}
                      >
                        <Link 
                          to={`/products/${product.id}`}
                          style={{ color: '#667eea', textDecoration: 'none', fontSize: '12px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {product.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allTemplates.map((templateItem) => (
                    <tr key={templateItem.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                        {getLocalizedField(templateItem, 'name') || templateItem.name}
                      </td>
                      {products.map((product) => {
                        const compatibility = calculateCompatibility(templateItem, product);
                        return (
                          <td 
                            key={`${templateItem.id}-${product.id}`}
                            style={{ 
                              padding: '12px 16px', 
                              textAlign: 'center',
                              fontSize: '20px',
                              fontWeight: 'bold',
                              color: compatibility === '⭕' ? '#10b981' : 
                                      compatibility === '○' ? '#3b82f6' : 
                                      compatibility === '△' ? '#f59e0b' : '#ef4444',
                              borderRight: '1px solid #E5E7EB'
                            }}
                          >
                            {compatibility}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '16px', fontSize: '14px', color: '#6B7280' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ marginRight: '16px' }}><span style={{ color: '#10b981' }}>⭕</span> {t('templates.detail.verySuitable')}</span>
                <span style={{ marginRight: '16px' }}><span style={{ color: '#3b82f6' }}>○</span> {t('templates.detail.suitable')}</span>
                <span style={{ marginRight: '16px' }}><span style={{ color: '#f59e0b' }}>△</span> {t('templates.detail.normal')}</span>
                <span><span style={{ color: '#ef4444' }}>✖</span> {t('templates.detail.unsuitable')}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TemplateDetailPage;
