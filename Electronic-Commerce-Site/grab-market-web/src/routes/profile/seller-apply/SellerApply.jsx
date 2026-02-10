import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { api } from '../../../config/api';
import './SellerApply.css';

export default function SellerApply({ isModal, onSuccess, onCancel }) {
  const history = useHistory();
  const { i18n, t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const rejectedMessageShownRef = useRef(false);

  const [formData, setFormData] = useState({
    seller_name: '',
    contact_email: '',
    phone: '',
    specialization: '',
    tech_stack: '',
    portfolio_url: '',
    product_description: '',
    motivation: '',
    business_number: '',
    github_url: ''
  });

  const loadApplicationStatus = useCallback(async () => {
    try {
      const response = await api.seller.getApplicationStatus();
      const status = response.data;
      
      if (status.hasApplied) {
        if (status.status === 'approved') {
          message.info(t('sellerApply.alreadyApproved'));
          if (isModal && onSuccess) onSuccess();
          else history.push('/profile');
        } else if (status.status === 'pending') {
          message.warning(t('sellerApply.alreadyPending'));
          if (isModal && onSuccess) onSuccess();
          else history.push('/profile');
        } else if (status.status === 'rejected') {
          if (!rejectedMessageShownRef.current) {
            rejectedMessageShownRef.current = true;
            message.warning(t('sellerApply.rejected', { reason: status.rejectionReason || '없음' }));
          }
        }
      }
    } catch (error) {
      console.error('신청 상태 확인 오류:', error);
    }
  }, [history, t, isModal, onSuccess]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await api.categories.getList();
      const mainCategories = response.data.categories.filter(cat => !cat.parentId);
      setCategories(mainCategories);
    } catch (error) {
      console.error('카테고리 목록 로드 오류:', error);
    }
  }, []);

  const dataLoadDoneRef = useRef(false);
  useEffect(() => {
    if (dataLoadDoneRef.current) return;
    dataLoadDoneRef.current = true;

    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
    loadApplicationStatus();
    loadCategories();
  }, [i18n, loadApplicationStatus, loadCategories]);

  const handleChange = (e) => {
    if (submitError) setSubmitError('');
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    setLoading(true);
    setSubmitError('');
    try {
      await api.seller.apply(formData);
      message.success(t('sellerApply.success'));
      if (isModal && onSuccess) onSuccess();
      else history.push('/profile');
    } catch (error) {
      console.error('신청 오류:', error);
      const errorMessage = error.response?.data?.error || t('sellerApply.error');
      setSubmitError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const descriptionLength = formData.product_description.length;
  const motivationLength = formData.motivation.length;

  return (
    <div className="seller-apply-container">
      <div className="seller-apply-content">
        <h1 className="page-title">{t('sellerApply.pageTitle')}</h1>
        <p className="page-subtitle">{t('sellerApply.pageSubtitle')}</p>

        {submitError && (
          <div className="seller-apply-submit-error" role="alert">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="seller-apply-form">
          {/* 기본 정보 */}
          <section className="form-section">
            <h3 className="section-title">{t('sellerApply.basicInfo')}</h3>
            <div className="form-group">
              <label htmlFor="seller_name">{t('sellerApply.sellerName')} {t('sellerApply.required')}</label>
              <input
                type="text"
                id="seller_name"
                name="seller_name"
                value={formData.seller_name}
                onChange={handleChange}
                required
                placeholder={t('sellerApply.sellerNamePlaceholder')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact_email">{t('sellerApply.contactEmail')} {t('sellerApply.required')}</label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                required
                placeholder={t('sellerApply.contactEmailPlaceholder')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">{t('sellerApply.phone')} {t('sellerApply.required')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="010-?[0-9]{4}-?[0-9]{4}"
                placeholder={t('sellerApply.phonePlaceholder')}
              />
            </div>
          </section>

          {/* AI 개발자 정보 */}
          <section className="form-section">
            <h3 className="section-title">{t('sellerApply.aiDeveloperInfo')}</h3>
            <div className="form-group">
              <label htmlFor="specialization">{t('sellerApply.specialization')} {t('sellerApply.required')}</label>
              <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="">{t('sellerApply.specializationPlaceholder')}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name_ja || cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tech_stack">{t('sellerApply.techStack')} {t('sellerApply.required')}</label>
              <input
                type="text"
                id="tech_stack"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                required
                placeholder={t('sellerApply.techStackPlaceholder')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="portfolio_url">{t('sellerApply.portfolioUrl')} {t('sellerApply.required')}</label>
              <input
                type="url"
                id="portfolio_url"
                name="portfolio_url"
                value={formData.portfolio_url}
                onChange={handleChange}
                required
                placeholder={t('sellerApply.portfolioUrlPlaceholder')}
              />
            </div>
          </section>

          {/* 상품 설명 */}
          <section className="form-section">
            <h3 className="section-title">{t('sellerApply.productDescription')} {t('sellerApply.required')}</h3>
            <div className="form-group">
              <textarea
                id="product_description"
                name="product_description"
                value={formData.product_description}
                onChange={handleChange}
                required
                minLength={100}
                maxLength={500}
                rows={6}
                placeholder={t('sellerApply.productDescriptionPlaceholder')}
              />
              <span className="char-count">
                {descriptionLength}/500
                {descriptionLength < 100 && <span className="warning"> {t('sellerApply.minCharsRequired', { count: 100 })}</span>}
              </span>
            </div>
          </section>

          {/* 신청 동기 */}
          <section className="form-section">
            <h3 className="section-title">{t('sellerApply.motivation')} {t('sellerApply.required')}</h3>
            <div className="form-group">
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                required
                minLength={50}
                maxLength={200}
                rows={4}
                placeholder={t('sellerApply.motivationPlaceholder')}
              />
              <span className="char-count">
                {motivationLength}/200
                {motivationLength < 50 && <span className="warning"> {t('sellerApply.minCharsRequired', { count: 50 })}</span>}
              </span>
            </div>
          </section>

          {/* 선택 정보 */}
          <section className="form-section">
            <h3 className="section-title">{t('sellerApply.optionalInfo')}</h3>
            <div className="form-group">
              <label htmlFor="business_number">{t('sellerApply.businessNumber')}</label>
              <input
                type="text"
                id="business_number"
                name="business_number"
                value={formData.business_number}
                onChange={handleChange}
                placeholder={t('sellerApply.businessNumberPlaceholder')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="github_url">{t('sellerApply.githubUrl')}</label>
              <input
                type="url"
                id="github_url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder={t('sellerApply.githubUrlPlaceholder')}
              />
            </div>
          </section>

          <div className="form-actions">
            <button type="button" onClick={() => (isModal && onCancel ? onCancel() : history.goBack())} className="btn-cancel">
              {t('common.close')}
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? t('common.loading') : t('sellerApply.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
