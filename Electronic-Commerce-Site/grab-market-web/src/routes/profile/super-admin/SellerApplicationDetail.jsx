import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message, Modal } from 'antd';
import { api } from '../../../config/api';
import SuperAdminLayout from './components/SuperAdminLayout';
import './SellerApplicationDetail.css';

export default function SellerApplicationDetail() {
  const history = useHistory();
  const { userId } = useParams();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  const [validation, setValidation] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadDetail = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.superAdmin.sellerApplications.getDetail(userId);
      setUser(response.data.user);
      setApplication(response.data.application);
      setValidation(response.data.validation);
    } catch (error) {
      console.error('상세 정보 로드 오류:', error);
      message.error(t('profile.superAdmin.sellerApplications.detail.messages.loadFail'));
      history.push('/profile/super-admin/seller-applications');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, history]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const handleApprove = async () => {
    if (!window.confirm(t('profile.superAdmin.sellerApplications.detail.messages.approveConfirm'))) return;

    try {
      await api.superAdmin.sellerApplications.approve(userId);
      message.success(t('profile.superAdmin.sellerApplications.detail.messages.approveSuccess'));
      loadDetail();
    } catch (error) {
      console.error('승인 오류:', error);
      message.error(error.response?.data?.error || t('profile.superAdmin.sellerApplications.detail.messages.approveFail'));
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      message.warning(t('profile.superAdmin.sellerApplications.detail.messages.rejectWarning'));
      return;
    }

    try {
      await api.superAdmin.sellerApplications.reject(userId, rejectionReason);
      message.success(t('profile.superAdmin.sellerApplications.detail.messages.rejectSuccess'));
      setShowRejectModal(false);
      setRejectionReason('');
      loadDetail();
    } catch (error) {
      console.error('반려 오류:', error);
      message.error(error.response?.data?.error || t('profile.superAdmin.sellerApplications.detail.messages.rejectFail'));
    }
  };

  const getStatus = () => {
    if (!user) return null;
    if (user.role === 'admin') return 'approved';
    if (user.seller_rejected_at) return 'rejected';
    if (user.seller_requested_at) return 'pending';
    return null;
  };

  const status = getStatus();

  // validation 메시지 번역 함수
  const translateValidationMessage = (message) => {
    if (!message) return '';
    // 하드코딩된 메시지 매핑
    if (message.includes('승인 권장') || message.includes('Approval Recommended') || message.includes('承認推奨')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.messages.approved');
    }
    if (message.includes('검토 필요') || message.includes('Review Required') || message.includes('要検討')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.messages.review');
    }
    if (message.includes('승인 불가') || message.includes('Approval Not Recommended') || message.includes('承認不可')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.messages.rejected');
    }
    return message;
  };

  // check category 번역 함수
  const translateCategory = (category) => {
    if (!category) return '';
    
    // 정확한 매칭을 위해 공백 제거 및 정규화
    const normalized = category.trim();
    
    // 하드코딩된 카테고리 매핑 (정확한 매칭 우선)
    if (normalized === '필수 정보' || normalized === 'Required Information' || normalized === '必須情報') {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.requiredInfo');
    }
    if (normalized === '이메일' || normalized === 'Email' || normalized === 'メール') {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.email');
    }
    if (normalized === '전화번호' || normalized === 'Phone' || normalized === '電話番号') {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.phone');
    }
    if (normalized === '기술 스택' || normalized === 'Tech Stack' || normalized === '技術スタック') {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.techStack');
    }
    if (normalized === '포트폴리오' || normalized === 'Portfolio' || normalized === 'ポートフォリオ') {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.portfolio');
    }
    if (normalized === 'GitHub' || normalized.includes('GitHub')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.github');
    }
    if (normalized === '사업자등록번호' || normalized === 'Business Number' || normalized === '事業者登録番号') {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.businessNumber');
    }
    if (normalized === '텍스트 품질' || normalized === 'Text Quality' || normalized === 'テキスト品質') {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.textQuality');
    }
    if (normalized === '전문분야' || normalized === 'Specialization' || normalized === '専門分野') {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.specialization');
    }
    
    // 부분 매칭 (fallback)
    if (category.includes('필수 정보') || category.includes('Required Information') || category.includes('必須情報')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.requiredInfo');
    }
    if (category.includes('이메일') || category.includes('Email') || category.includes('メール')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.email');
    }
    if (category.includes('전화번호') || category.includes('Phone') || category.includes('電話番号')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.phone');
    }
    if (category.includes('기술 스택') || category.includes('Tech Stack') || category.includes('技術スタック')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.techStack');
    }
    if (category.includes('포트폴리오') || category.includes('Portfolio') || category.includes('ポートフォリオ')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.portfolio');
    }
    if (category.includes('GitHub')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.github');
    }
    if (category.includes('사업자등록번호') || category.includes('Business Number') || category.includes('事業者登録番号')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.businessNumber');
    }
    if (category.includes('텍스트 품질') || category.includes('Text Quality') || category.includes('テキスト品質')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.textQuality');
    }
    if (category.includes('전문분야') || category.includes('Specialization') || category.includes('専門分野')) {
      return t('profile.superAdmin.sellerApplications.detail.validation.categories.specialization');
    }
    
    return category;
  };

  // check message 번역 함수 - 카테고리와 메시지를 분리해서 번역
  const translateCheckMessage = (message) => {
    if (!message) return '';
    
    // 메시지에서 카테고리와 메시지 부분 분리 (예: "必須情報: 8/8 항목 완료")
    const colonIndex = message.indexOf(':');
    if (colonIndex === -1) {
      return message;
    }
    
    // 카테고리 부분 추출 및 번역
    const categoryPart = message.substring(0, colonIndex).trim();
    const messagePart = message.substring(colonIndex + 1).trim();
    
    const translatedCategory = translateCategory(categoryPart);
    
    // 메시지 부분 번역
    let translatedMessage = messagePart;
    
    // 이모지 제거 (번역에 방해되지 않도록)
    const cleanMessage = messagePart.replace(/[✅❌⚠]/g, '').trim();
    
    // 한국어 메시지 패턴 매칭
    if (cleanMessage.includes('항목 완료') || cleanMessage.includes('項目完了') || cleanMessage.includes('items completed')) {
      const match = cleanMessage.match(/(\d+)\/(\d+)\s*(?:항목|項目|items?)\s*(?:완료|完了|completed)/);
      if (match) {
        if (i18n.language === 'ja') {
          translatedMessage = `✅ ${match[1]}/${match[2]}項目完了`;
        } else if (i18n.language === 'en') {
          translatedMessage = `✅ ${match[1]}/${match[2]} items completed`;
        } else {
          translatedMessage = `✅ ${match[1]}/${match[2]} 항목 완료`;
        }
      }
    } else if (cleanMessage.includes('유효한 형식') || cleanMessage.includes('有効な形式') || cleanMessage.includes('Valid format')) {
      if (i18n.language === 'ja') {
        translatedMessage = '✅ 有効な形式';
      } else if (i18n.language === 'en') {
        translatedMessage = '✅ Valid format';
      } else {
        translatedMessage = '✅ 유효한 형식';
      }
    } else if (cleanMessage.includes('접근 가능') || cleanMessage.includes('アクセス可能') || cleanMessage.includes('Accessible')) {
      if (i18n.language === 'ja') {
        translatedMessage = '✅ アクセス可能';
      } else if (i18n.language === 'en') {
        translatedMessage = '✅ Accessible';
      } else {
        translatedMessage = '✅ 접근 가능';
      }
    } else if (cleanMessage.includes('입력 부족') || cleanMessage.includes('入力不足') || cleanMessage.includes('Insufficient input')) {
      if (i18n.language === 'ja') {
        translatedMessage = '❌ 入力不足';
      } else if (i18n.language === 'en') {
        translatedMessage = '❌ Insufficient input';
      } else {
        translatedMessage = '❌ 입력 부족';
      }
    } else if (cleanMessage.includes('유효한 카테고리') || cleanMessage.includes('有効なカテゴリ') || cleanMessage.includes('Valid category')) {
      if (i18n.language === 'ja') {
        translatedMessage = '✅ 有効なカテゴリ';
      } else if (i18n.language === 'en') {
        translatedMessage = '✅ Valid category';
      } else {
        translatedMessage = '✅ 유효한 카테고리';
      }
    } else if (cleanMessage.includes('상품 설명:') || cleanMessage.includes('商品説明:') || cleanMessage.includes('Product Description:')) {
      // 텍스트 품질 메시지
      const descMatch = cleanMessage.match(/(?:상품 설명|商品説明|Product Description):\s*(\d+)(?:자|文字|chars?)/);
      const motivMatch = cleanMessage.match(/(?:신청 동기|申請動機|Application Motivation):\s*(\d+)(?:자|文字|chars?)/);
      if (descMatch && motivMatch) {
        if (i18n.language === 'ja') {
          translatedMessage = `商品説明: ${descMatch[1]}文字、申請動機: ${motivMatch[1]}文字`;
        } else if (i18n.language === 'en') {
          translatedMessage = `Product Description: ${descMatch[1]} chars, Application Motivation: ${motivMatch[1]} chars`;
        } else {
          translatedMessage = `상품 설명: ${descMatch[1]}자, 신청 동기: ${motivMatch[1]}자`;
        }
      }
    } else {
      // 번역되지 않은 경우 원본 메시지 유지 (이모지 포함)
      translatedMessage = messagePart;
    }
    
    return `${translatedCategory}: ${translatedMessage}`;
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="loading">{t('profile.superAdmin.sellerApplications.detail.messages.loading')}</div>
      </SuperAdminLayout>
    );
  }

  if (!user || !application) {
    return (
      <SuperAdminLayout>
        <div className="error">{t('profile.superAdmin.sellerApplications.detail.messages.dataLoadFail')}</div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="seller-application-detail-container">
        <div className="seller-application-detail-content">
          <button onClick={() => history.goBack()} className="btn-back">
            {t('profile.superAdmin.sellerApplications.detail.backToList')}
          </button>

          <h1 className="page-title">{t('profile.superAdmin.sellerApplications.detail.title')}</h1>

        {/* 자동 검증 결과 */}
        {validation && (
          <section className="validation-section">
            <h2 className="section-title">{t('profile.superAdmin.sellerApplications.detail.validation.title')}</h2>
            <div className="validation-summary">
              <div className={`score-badge score-${validation.recommendation}`}>
                {validation.totalScore}{i18n.language === 'ja' ? '点' : i18n.language === 'en' ? ' points' : '점'} / 100{i18n.language === 'ja' ? '点' : i18n.language === 'en' ? ' points' : '점'}
              </div>
              <div className={`recommendation recommendation-${validation.recommendation}`}>
                {translateValidationMessage(validation.message)}
              </div>
            </div>
            <div className="validation-checks">
              {validation.checks.map((check, idx) => {
                // check.message에 카테고리가 포함되어 있을 수 있으므로 전체를 번역
                const fullMessage = check.category ? `${check.category}: ${check.message}` : check.message;
                const translatedFullMessage = translateCheckMessage(fullMessage);
                const scoreUnit = i18n.language === 'ja' ? '点' : i18n.language === 'en' ? 'points' : '점';
                
                return (
                  <div key={idx} className="check-item">
                    {translatedFullMessage} ({check.score}{scoreUnit})
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 신청자 정보 */}
        <section className="info-section">
          <h2 className="section-title">{t('profile.superAdmin.sellerApplications.detail.applicantInfo.title')}</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('profile.superAdmin.sellerApplications.detail.applicantInfo.username')}</label>
              <span>{user.username}</span>
            </div>
            <div className="info-item">
              <label>{t('profile.superAdmin.sellerApplications.detail.applicantInfo.email')}</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>{t('profile.superAdmin.sellerApplications.detail.applicantInfo.joinDate')}</label>
              <span>{new Date(user.createdAt).toLocaleDateString(i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'en' ? 'en-US' : 'ko-KR')}</span>
            </div>
          </div>
        </section>

        {/* 판매자 신청 정보 */}
        <section className="info-section">
          <h2 className="section-title">{t('profile.superAdmin.sellerApplications.detail.applicationInfo.title')}</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('profile.superAdmin.sellerApplications.detail.applicationInfo.sellerName')}</label>
              <span>{application.seller_name || '-'}</span>
            </div>
            <div className="info-item">
              <label>{t('profile.superAdmin.sellerApplications.detail.applicationInfo.contactEmail')}</label>
              <span>{application.contact_email || '-'}</span>
            </div>
            <div className="info-item">
              <label>{t('profile.superAdmin.sellerApplications.detail.applicationInfo.phone')}</label>
              <span>{application.phone || '-'}</span>
            </div>
            <div className="info-item">
              <label>{t('profile.superAdmin.sellerApplications.detail.applicationInfo.specialization')}</label>
              <span>{application.specialization || '-'}</span>
            </div>
            <div className="info-item">
              <label>{t('profile.superAdmin.sellerApplications.detail.applicationInfo.techStack')}</label>
              <span>{application.tech_stack || '-'}</span>
            </div>
            <div className="info-item">
              <label>{t('profile.superAdmin.sellerApplications.detail.applicationInfo.portfolio')}</label>
              <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer">
                {application.portfolio_url || '-'}
              </a>
            </div>
            {application.github_url && (
              <div className="info-item">
                <label>{t('profile.superAdmin.sellerApplications.detail.applicationInfo.github')}</label>
                <a href={application.github_url} target="_blank" rel="noopener noreferrer">
                  {application.github_url}
                </a>
              </div>
            )}
            {application.business_number && (
              <div className="info-item">
                <label>{t('profile.superAdmin.sellerApplications.detail.applicationInfo.businessNumber')}</label>
                <span>{application.business_number}</span>
              </div>
            )}
          </div>

          <div className="text-content">
            <h3>{t('profile.superAdmin.sellerApplications.detail.applicationInfo.productDescription')}</h3>
            <p>{application.product_description || '-'}</p>
          </div>

          <div className="text-content">
            <h3>{t('profile.superAdmin.sellerApplications.detail.applicationInfo.motivation')}</h3>
            <p>{application.motivation || '-'}</p>
          </div>
        </section>

        {/* 승인/반려 버튼 */}
        {status === 'pending' && (
          <div className="action-buttons">
            <button onClick={handleApprove} className="btn-approve">
              {t('profile.superAdmin.sellerApplications.detail.actions.approve')}
            </button>
            <button onClick={() => setShowRejectModal(true)} className="btn-reject">
              {t('profile.superAdmin.sellerApplications.detail.actions.reject')}
            </button>
          </div>
        )}

        {/* 반려 모달 */}
        <Modal
          title={t('profile.superAdmin.sellerApplications.detail.rejectModal.title')}
          open={showRejectModal}
          onOk={handleReject}
          onCancel={() => {
            setShowRejectModal(false);
            setRejectionReason('');
          }}
          okText={t('profile.superAdmin.sellerApplications.detail.rejectModal.ok')}
          cancelText={t('profile.superAdmin.sellerApplications.detail.rejectModal.cancel')}
        >
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder={t('profile.superAdmin.sellerApplications.detail.rejectModal.placeholder')}
            rows={4}
            style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
          />
        </Modal>
      </div>
    </div>
    </SuperAdminLayout>
  );
}
