import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message, Modal } from 'antd';
import { api } from '../../../config/api';
import './SellerApplicationDetail.css';

export default function SellerApplicationDetail() {
  const history = useHistory();
  const { userId } = useParams();
  const { i18n } = useTranslation();
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
      message.error('상세 정보를 불러오는 중 오류가 발생했습니다.');
      history.push('/profile/super-admin/seller-applications');
    } finally {
      setLoading(false);
    }
  }, [userId, history]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
    loadDetail();
  }, [i18n, loadDetail]);

  const handleApprove = async () => {
    if (!window.confirm('이 신청을 승인하시겠습니까?')) return;

    try {
      await api.superAdmin.sellerApplications.approve(userId);
      message.success('승인이 완료되었습니다.');
      loadDetail();
    } catch (error) {
      console.error('승인 오류:', error);
      message.error(error.response?.data?.error || '승인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      message.warning('반려 사유를 입력해주세요.');
      return;
    }

    try {
      await api.superAdmin.sellerApplications.reject(userId, rejectionReason);
      message.success('반려 처리가 완료되었습니다.');
      setShowRejectModal(false);
      setRejectionReason('');
      loadDetail();
    } catch (error) {
      console.error('반려 오류:', error);
      message.error(error.response?.data?.error || '반려 처리 중 오류가 발생했습니다.');
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

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!user || !application) {
    return <div className="error">데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="seller-application-detail-container">
      <div className="seller-application-detail-content">
        <button onClick={() => history.goBack()} className="btn-back">
          ← 목록으로
        </button>

        <h1 className="page-title">판매자 신청 상세</h1>

        {/* 자동 검증 결과 */}
        {validation && (
          <section className="validation-section">
            <h2 className="section-title">자동 검증 결과</h2>
            <div className="validation-summary">
              <div className={`score-badge score-${validation.recommendation}`}>
                {validation.totalScore}점 / 100점
              </div>
              <div className={`recommendation recommendation-${validation.recommendation}`}>
                {validation.message}
              </div>
            </div>
            <div className="validation-checks">
              {validation.checks.map((check, idx) => (
                <div key={idx} className="check-item">
                  <strong>{check.category}</strong>: {check.message} ({check.score}점)
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 신청자 정보 */}
        <section className="info-section">
          <h2 className="section-title">신청자 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>아이디:</label>
              <span>{user.username}</span>
            </div>
            <div className="info-item">
              <label>이메일:</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>가입일:</label>
              <span>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
        </section>

        {/* 판매자 신청 정보 */}
        <section className="info-section">
          <h2 className="section-title">판매자 신청 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>판매자명:</label>
              <span>{application.seller_name || '-'}</span>
            </div>
            <div className="info-item">
              <label>정산 이메일:</label>
              <span>{application.contact_email || '-'}</span>
            </div>
            <div className="info-item">
              <label>연락처:</label>
              <span>{application.phone || '-'}</span>
            </div>
            <div className="info-item">
              <label>전문분야:</label>
              <span>{application.specialization || '-'}</span>
            </div>
            <div className="info-item">
              <label>기술 스택:</label>
              <span>{application.tech_stack || '-'}</span>
            </div>
            <div className="info-item">
              <label>포트폴리오:</label>
              <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer">
                {application.portfolio_url || '-'}
              </a>
            </div>
            {application.github_url && (
              <div className="info-item">
                <label>GitHub:</label>
                <a href={application.github_url} target="_blank" rel="noopener noreferrer">
                  {application.github_url}
                </a>
              </div>
            )}
            {application.business_number && (
              <div className="info-item">
                <label>사업자등록번호:</label>
                <span>{application.business_number}</span>
              </div>
            )}
          </div>

          <div className="text-content">
            <h3>상품 설명</h3>
            <p>{application.product_description || '-'}</p>
          </div>

          <div className="text-content">
            <h3>신청 동기</h3>
            <p>{application.motivation || '-'}</p>
          </div>
        </section>

        {/* 승인/반려 버튼 */}
        {status === 'pending' && (
          <div className="action-buttons">
            <button onClick={handleApprove} className="btn-approve">
              승인
            </button>
            <button onClick={() => setShowRejectModal(true)} className="btn-reject">
              반려
            </button>
          </div>
        )}

        {/* 반려 모달 */}
        <Modal
          title="반려 사유 입력"
          open={showRejectModal}
          onOk={handleReject}
          onCancel={() => {
            setShowRejectModal(false);
            setRejectionReason('');
          }}
          okText="반려 확인"
          cancelText="취소"
        >
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="반려 사유를 입력하세요"
            rows={4}
            style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
          />
        </Modal>
      </div>
    </div>
  );
}
