import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Users, Package } from 'lucide-react';
import { api } from '../../../config/api';
import { API_URL } from '../../../config/constants';
import SuperAdminLayout from './components/SuperAdminLayout';
import { mockTemplates } from './mockData';
import { TEMPLATE_COMPATIBILITY_MAP } from '../../templates/templateCompatibility';
import './TemplateDetail.css';

const USE_MOCK_ON_ERROR = true;

function formatDesc(text) {
  if (!text || typeof text !== 'string') return text || '';
  return text.replace(/[。.]/g, (match, offset, string) => {
    if (offset < string.length - 1) return match + '\n';
    return match;
  });
}

export default function TemplateDetail() {
  const { id } = useParams();
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const language = i18n.language || 'ko';
  const [template, setTemplate] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const allTemplates = mockTemplates;

  const loadDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.superAdmin.templates.getDetail(id);
      const data = response.data?.template || response.data;
      if (!data) throw new Error('No template');
      const productIds = data.product_ids || [];
      setTemplate({ ...data, product_count: data.product_count ?? productIds.length });

      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      } else if (productIds.length > 0) {
        const productPromises = productIds.map((pid) =>
          api.products.getDetail(pid).catch(() => null)
        );
        const results = await Promise.all(productPromises);
        const list = results
          .filter((r) => r?.data?.product)
          .map((r) => r.data.product);
        setProducts(list);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('템플릿 상세 로드 실패:', error);
      if (USE_MOCK_ON_ERROR) {
        const found = mockTemplates.find((item) => String(item.id) === String(id));
        if (found) {
          setTemplate({
            ...found,
            product_count: found.product_count ?? (found.product_ids?.length || 0)
          });
          const productIds = found.product_ids || [];
          if (productIds.length > 0) {
            const productPromises = productIds.map((pid) =>
              api.products.getDetail(pid).catch(() => null)
            );
            const results = await Promise.all(productPromises);
            const list = results
              .filter((r) => r?.data?.product)
              .map((r) => r.data.product);
            setProducts(list);
          } else {
            setProducts([]);
          }
        } else {
          setTemplate(null);
          setProducts([]);
        }
      } else {
        setTemplate(null);
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const calculateCompatibility = (templateItem, product) => {
    const templateId = typeof templateItem.id === 'string' ? parseInt(templateItem.id) : (templateItem.id || 0);
    const currentTemplateId = parseInt(id) || 0;

    let productCategoryId = product.category_id;
    if (typeof productCategoryId === 'string') productCategoryId = parseInt(productCategoryId);
    if (!productCategoryId || isNaN(productCategoryId) || productCategoryId < 1 || productCategoryId > 7) {
      return '△';
    }

    if (templateId === currentTemplateId) {
      const isInCurrentTemplate =
        template &&
        (template.id === currentTemplateId || parseInt(template.id) === currentTemplateId) &&
        products.some((p) => p.id === product.id || parseInt(p.id) === parseInt(product.id));
      if (isInCurrentTemplate) return '⭕';
    }

    if (TEMPLATE_COMPATIBILITY_MAP && TEMPLATE_COMPATIBILITY_MAP[templateId]) {
      const result = TEMPLATE_COMPATIBILITY_MAP[templateId][productCategoryId];
      if (['⭕', '○', '△', '✖'].includes(result)) return result;
    }
    return '△';
  };

  const getLocalizedField = (item, field) => {
    if (!item) return '';
    if (language === 'ja' && item[`${field}_ja`]) return item[`${field}_ja`];
    if (language === 'en' && item[`${field}_en`]) return item[`${field}_en`];
    return item[field] || item[`${field}_ja`] || item[`${field}_en`] || '';
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="template-detail-sa template-detail-sa-main">
          <div className="template-detail-sa-loading">
            {t('profile.superAdmin.templates.messages.loading')}
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!template) {
    return (
      <SuperAdminLayout>
        <div className="template-detail-sa template-detail-sa-main">
          <div className="template-detail-sa-empty">
            <p>{t('profile.superAdmin.templates.detail.notFound')}</p>
            <button
              type="button"
              className="template-detail-sa-back-btn"
              onClick={() => history.push('/profile/super-admin/templates')}
            >
              {t('profile.superAdmin.templates.detail.backToList')}
            </button>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  const description = getLocalizedField(template, 'description') || template.description || '설명이 없습니다.';
  const projectDescription = getLocalizedField(template, 'projectDescription') || template.projectDescription;
  const whySelected = getLocalizedField(template, 'whySelected') || template.whySelected;
  const aiDescriptions =
    (language === 'ja' && template.aiDescriptions_ja) ||
    (language === 'en' && template.aiDescriptions_en) ||
    template.aiDescriptions ||
    [];

  return (
    <SuperAdminLayout>
      <div className="template-detail-sa template-detail-sa-main">
        <button
          type="button"
          className="template-detail-sa-back"
          onClick={() => history.push('/profile/super-admin/templates')}
        >
          <ArrowLeft size={16} />
          {t('templates.detail.backToList')}
        </button>

        {/* 템플릿 헤더 - 공용 /templates/1 과 동일 (액션 버튼만 제외) */}
        <div className="template-detail-sa-template-header">
          <h1 className="template-detail-sa-h1">
            {getLocalizedField(template, 'name') || template.name}
          </h1>
          <div className="template-detail-sa-desc-box">
            <p className="template-detail-sa-desc">{formatDesc(description)}</p>
          </div>
          <div className="template-detail-sa-meta-row">
            <div className="template-detail-sa-meta-item">
              <Users size={16} />
              <span>{t('templates.detail.purchased', { count: template.purchase_count || 0 })}</span>
            </div>
            <div className="template-detail-sa-meta-item">
              <Package size={16} />
              <span>{t('templates.detail.aiProducts', { count: products.length })}</span>
            </div>
          </div>
        </div>

        {/* 프로젝트 설명 - 공용과 동일 인라인 스타일 */}
        {projectDescription && (
          <div
            className="template-detail-sa-section"
            style={{
              marginTop: '24px',
              marginBottom: '40px',
              padding: '28px',
              background: 'linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '16px',
                color: '#1F2937',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '2px'
                }}
              />
              {t('templates.detail.projectDescription')}
            </h2>
            <p
              style={{
                fontSize: '17px',
                color: '#374151',
                lineHeight: '1.9',
                whiteSpace: 'pre-line',
                margin: 0
              }}
            >
              {formatDesc(projectDescription)}
            </p>
          </div>
        )}

        {/* 왜 이 AI로 구성되었는지 - 공용과 동일 */}
        {whySelected && (
          <div
            className="template-detail-sa-section"
            style={{
              marginBottom: '40px',
              padding: '28px',
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '16px',
                color: '#1F2937',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '4px'
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '2px'
                }}
              />
              {t('templates.detail.whySelected')}
            </h2>
            <p
              style={{
                fontSize: '17px',
                color: '#374151',
                lineHeight: '1.9',
                whiteSpace: 'pre-line',
                margin: 0
              }}
            >
              {formatDesc(whySelected)}
            </p>
          </div>
        )}

        {/* 포함된 AI 상품 목록 - 공용과 동일 구조 (products-grid, product-card 등) */}
        {products.length > 0 && (
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
              {t('templates.detail.templateProducts')}
            </h2>
            <div className="products-grid">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="product-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="card-image">
                    <div className="avatar-large">
                      <img
                        src={product.imageUrl ? `${API_URL}/${product.imageUrl}` : ''}
                        alt={product.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.parentElement) {
                            e.target.parentElement.textContent = (product.name || '').substring(0, 2) || 'AI';
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="card-category">
                      {product.category_name || 'その他'}
                    </div>
                    <div className="card-header">
                      <h3 className="card-title">{product.name}</h3>
                    </div>
                    <div className="card-rating">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#FCD34D" stroke="#FCD34D">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="rating-value">
                        {parseFloat(product.rating_average || product.rating || 0).toFixed(1)}
                      </span>
                      <span className="rating-count">
                        ({(product.rating_count || 0).toLocaleString()})
                      </span>
                    </div>
                    <div className="card-footer">
                      <span className="price">¥{(product.price || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 어떤 AI인지 설명 - 공용과 동일 */}
        {aiDescriptions.length > 0 && (
          <div
            style={{
              marginBottom: '60px',
              padding: '28px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
              border: '1px solid #E5E7EB',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '20px',
                color: '#1F2937',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '2px'
                }}
              />
              {t('templates.detail.aiDescriptions')}
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {aiDescriptions.map((desc, index) => (
                <li
                  key={index}
                  style={{
                    padding: '16px',
                    marginBottom: index < aiDescriptions.length - 1 ? '12px' : 0,
                    background: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '17px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    lineHeight: '1.7'
                  }}
                >
                  <span
                    style={{
                      color: 'white',
                      fontWeight: 700,
                      flexShrink: 0,
                      width: '28px',
                      height: '28px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    {index + 1}
                  </span>
                  <span style={{ flex: 1, whiteSpace: 'pre-line' }}>{desc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI 적합성 비교표 - 공용과 동일 */}
        {allTemplates.length > 0 && products.length > 0 && (
          <div className="compatibility-table-section" style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
              {t('templates.detail.compatibilityTable')}
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table
                className="compatibility-table"
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #E5E7EB'
                }}
              >
                <thead>
                  <tr style={{ background: '#F3F4F6' }}>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: 600,
                        borderBottom: '2px solid #E5E7EB'
                      }}
                    >
                      {t('templates.detail.projectType')}
                    </th>
                    {products.map((product) => (
                      <th
                        key={product.id}
                        style={{
                          padding: '12px 16px',
                          textAlign: 'center',
                          fontWeight: 600,
                          borderBottom: '2px solid #E5E7EB',
                          borderRight: '1px solid #E5E7EB'
                        }}
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
                              color:
                                compatibility === '⭕'
                                  ? '#10b981'
                                  : compatibility === '○'
                                  ? '#3b82f6'
                                  : compatibility === '△'
                                  ? '#f59e0b'
                                  : '#ef4444',
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
                <span style={{ marginRight: '16px' }}>
                  <span style={{ color: '#10b981' }}>⭕</span> {t('templates.detail.verySuitable')}
                </span>
                <span style={{ marginRight: '16px' }}>
                  <span style={{ color: '#3b82f6' }}>○</span> {t('templates.detail.suitable')}
                </span>
                <span style={{ marginRight: '16px' }}>
                  <span style={{ color: '#f59e0b' }}>△</span> {t('templates.detail.normal')}
                </span>
                <span>
                  <span style={{ color: '#ef4444' }}>✖</span> {t('templates.detail.unsuitable')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}
