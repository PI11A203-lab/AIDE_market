import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import SellerApply from '../profile/seller-apply/SellerApply';
import './SellerInfo.css';

export default function SellerInfo() {
  const { i18n, t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const initialLoadDoneRef = useRef(false);

  useEffect(() => {
    if (initialLoadDoneRef.current) return;
    initialLoadDoneRef.current = true;

    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }

    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userFromStorage) {
      try {
        setUser(JSON.parse(userFromStorage));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, [i18n]);

  return (
    <div className="seller-info-container">
      <div className="seller-info-content">
        <Link to="/" className="btn-back-to-home">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {t('common.backHome')}
        </Link>

        <h1 className="page-title">{t('sellerInfo.pageTitle')}</h1>
        <p className="page-subtitle">{t('sellerInfo.pageSubtitle')}</p>

        <section className="info-section">
          <h2 className="section-title">{t('sellerInfo.whatIsSeller')}</h2>
          <p className="section-text">
            {t('sellerInfo.whatIsSellerText')}
          </p>
        </section>

        <section className="info-section">
          <h2 className="section-title">{t('sellerInfo.benefits')}</h2>
          <ul className="benefits-list">
            <li>{t('sellerInfo.benefit1')}</li>
            <li>{t('sellerInfo.benefit2')}</li>
            <li>{t('sellerInfo.benefit3')}</li>
            <li>{t('sellerInfo.benefit4')}</li>
            <li>{t('sellerInfo.benefit5')}</li>
            <li>{t('sellerInfo.benefit6')}</li>
          </ul>
        </section>

        <section className="info-section">
          <h2 className="section-title">{t('sellerInfo.requirements')}</h2>
          <div className="requirements-box">
            <h3>{t('sellerInfo.requiredInfo')}</h3>
            <ul>
              <li>{t('sellerInfo.req1')}</li>
              <li>{t('sellerInfo.req2')}</li>
              <li>{t('sellerInfo.req3')}</li>
              <li>{t('sellerInfo.req4')}</li>
              <li>{t('sellerInfo.req5')}</li>
              <li>{t('sellerInfo.req6')}</li>
              <li>{t('sellerInfo.req7')}</li>
              <li>{t('sellerInfo.req8')}</li>
            </ul>
            <h3>{t('sellerInfo.optionalInfo')}</h3>
            <ul>
              <li>{t('sellerInfo.opt1')}</li>
              <li>{t('sellerInfo.opt2')}</li>
            </ul>
          </div>
        </section>

        <section className="info-section">
          <h2 className="section-title">{t('sellerInfo.process')}</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>{t('sellerInfo.step1Title')}</h3>
                <p>{t('sellerInfo.step1Text')}</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>{t('sellerInfo.step2Title')}</h3>
                <p>{t('sellerInfo.step2Text')}</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>{t('sellerInfo.step3Title')}</h3>
                <p>{t('sellerInfo.step3Text')}</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>{t('sellerInfo.step4Title')}</h3>
                <p>{t('sellerInfo.step4Text')}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h2 className="section-title">{t('sellerInfo.validation')}</h2>
          <div className="validation-info">
            <p>{t('sellerInfo.validationText')}</p>
            <ul>
              <li><strong>{t('sellerInfo.val1')}</strong></li>
              <li><strong>{t('sellerInfo.val2')}</strong></li>
              <li><strong>{t('sellerInfo.val3')}</strong></li>
              <li><strong>{t('sellerInfo.val4')}</strong></li>
              <li><strong>{t('sellerInfo.val5')}</strong></li>
              <li><strong>{t('sellerInfo.val6')}</strong></li>
              <li><strong>{t('sellerInfo.val7')}</strong></li>
            </ul>
            <p className="note">
              {t('sellerInfo.validationNote')}
            </p>
          </div>
        </section>

        <div className="action-buttons">
          {user ? (
            <button type="button" className="btn-primary" onClick={() => setShowApplyModal(true)}>
              {t('sellerInfo.applyButton')}
            </button>
          ) : (
            <Link to="/login" className="btn-primary">
              {t('sellerInfo.loginToApply')}
            </Link>
          )}
        </div>

        <Modal
          title={null}
          open={showApplyModal}
          onCancel={() => setShowApplyModal(false)}
          footer={null}
          width={720}
          centered
          destroyOnClose
          maskClosable={false}
          className="seller-info-apply-modal"
        >
          <SellerApply
            isModal
            onSuccess={() => setShowApplyModal(false)}
            onCancel={() => setShowApplyModal(false)}
          />
        </Modal>
      </div>
    </div>
  );
}
