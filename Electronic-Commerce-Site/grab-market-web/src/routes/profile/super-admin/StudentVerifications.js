import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { Modal, Input, message, Image } from 'antd';
import './StudentVerifications.css';
import './Products.css'; // 공통 스타일 사용

const { TextArea } = Input;

export default function StudentVerifications() {
  const { t } = useTranslation();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [filters, setFilters] = useState({ search: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');

  const loadVerifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await api.superAdmin.studentVerifications.getPending(params);
      setVerifications(response.data.verifications || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0
      }));
    } catch (error) {
      console.error('학생 인증 목록 로드 실패:', error);
      message.error(t('profile.superAdmin.studentVerifications.messages.loadFail'));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, t]);

  useEffect(() => {
    loadVerifications();
  }, [loadVerifications]);

  const handleApprove = async (userId) => {
    try {
      await api.superAdmin.studentVerifications.approve(userId);
      message.success(t('profile.superAdmin.studentVerifications.messages.approveSuccess'));
      loadVerifications();
    } catch (error) {
      console.error('학생 인증 승인 실패:', error);
      message.error(error.response?.data?.error || t('profile.superAdmin.studentVerifications.messages.approveFail'));
    }
  };

  const handleReject = async () => {
    if (!selectedUser || !rejectReason.trim()) {
      message.warning(t('profile.superAdmin.studentVerifications.messages.rejectWarning'));
      return;
    }

    try {
      await api.superAdmin.studentVerifications.reject(selectedUser.id, rejectReason);
      message.success(t('profile.superAdmin.studentVerifications.messages.rejectSuccess'));
      setRejectModalVisible(false);
      setRejectReason('');
      setSelectedUser(null);
      loadVerifications();
    } catch (error) {
      console.error('학생 인증 거부 실패:', error);
      message.error(error.response?.data?.error || t('profile.superAdmin.studentVerifications.messages.rejectFail'));
    }
  };

  const openDocumentModal = async (user) => {
    try {
      const response = await api.superAdmin.studentVerifications.getDocument(user.id);
      const docPath = response.data.documentPath;
      // 문서 URL 생성 (백엔드 서버의 파일 경로)
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081';
      setDocumentUrl(`${baseUrl}/${docPath}`);
      setSelectedUser(user);
      setDocumentModalVisible(true);
    } catch (error) {
      console.error('문서 로드 실패:', error);
      message.error(t('profile.superAdmin.studentVerifications.messages.documentLoadFail'));
    }
  };

  const openRejectModal = (user) => {
    setSelectedUser(user);
    setRejectModalVisible(true);
  };

  return (
    <SuperAdminLayout>
      <div className="student-verifications-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">{t('profile.superAdmin.studentVerifications.title')}</h1>
            <p className="page-subtitle">{t('profile.superAdmin.studentVerifications.subtitle')}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">{t('profile.superAdmin.studentVerifications.stats.pending')}</div>
            <div className="stat-value">{pagination.total}</div>
          </div>
        </div>

        <div className="filters">
          <div className="filter-item">
            <label>{t('profile.superAdmin.studentVerifications.filters.search')}</label>
            <input
              type="text"
              placeholder={t('profile.superAdmin.studentVerifications.filters.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        <div className="section">
          <div className="verification-grid">
            {loading ? (
              <div className="loading">{t('profile.superAdmin.studentVerifications.loading')}</div>
            ) : verifications.length > 0 ? (
              verifications.map((verification) => (
                <div key={verification.id} className="verification-card">
                  <div className="verification-header">
                    <div className="user-avatar">
                      {verification.username?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3>{verification.username}</h3>
                      <p style={{ fontSize: '14px', color: '#666' }}>{verification.email}</p>
                    </div>
                  </div>
                  <div className="document-preview">
                    <button
                      className="view-document-btn"
                      onClick={() => openDocumentModal(verification)}
                    >
                      {t('profile.superAdmin.studentVerifications.actions.viewDocument')}
                    </button>
                  </div>
                  <div className="product-details">
                    <div className="detail-row">
                      <span className="detail-label">{t('profile.superAdmin.studentVerifications.card.requestDate')}:</span>
                      <span className="detail-value">
                        {new Date(verification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('profile.superAdmin.studentVerifications.card.status')}:</span>
                      <span className="badge pending">{t('profile.superAdmin.products.filters.pending')}</span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      className="btn btn-approve"
                      onClick={() => handleApprove(verification.id)}
                    >
                      {t('profile.superAdmin.studentVerifications.actions.approve')}
                    </button>
                    <button
                      className="btn btn-reject"
                      onClick={() => openRejectModal(verification)}
                    >
                      {t('profile.superAdmin.studentVerifications.actions.reject')}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">{t('profile.superAdmin.studentVerifications.empty')}</div>
            )}
          </div>
        </div>

        {/* 문서 모달 */}
        <Modal
          title={t('profile.superAdmin.studentVerifications.documentModal.title')}
          open={documentModalVisible}
          onCancel={() => {
            setDocumentModalVisible(false);
            setDocumentUrl('');
            setSelectedUser(null);
          }}
          footer={null}
          width={800}
        >
          {selectedUser && (
            <div>
              <p><strong>{t('profile.superAdmin.studentVerifications.documentModal.user')}:</strong> {selectedUser.username} ({selectedUser.email})</p>
              {documentUrl && (
                <div style={{ marginTop: '16px' }}>
                  <Image src={documentUrl} alt="学生証" style={{ maxWidth: '100%' }} />
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* 거부 모달 */}
        <Modal
          title={t('profile.superAdmin.studentVerifications.rejectModal.title')}
          open={rejectModalVisible}
          onOk={handleReject}
          onCancel={() => {
            setRejectModalVisible(false);
            setRejectReason('');
            setSelectedUser(null);
          }}
          okText={t('profile.superAdmin.studentVerifications.rejectModal.ok')}
          cancelText={t('profile.superAdmin.studentVerifications.rejectModal.cancel')}
        >
          <p>{t('profile.superAdmin.studentVerifications.rejectModal.content')}</p>
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={t('profile.superAdmin.studentVerifications.rejectModal.placeholder')}
          />
        </Modal>
      </div>
    </SuperAdminLayout>
  );
}

