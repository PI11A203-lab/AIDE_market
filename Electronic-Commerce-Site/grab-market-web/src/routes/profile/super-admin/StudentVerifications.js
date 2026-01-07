import React, { useState, useEffect, useCallback } from 'react';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { Modal, Input, message, Image } from 'antd';
import './StudentVerifications.css';
import './Products.css'; // 공통 스타일 사용

const { TextArea } = Input;

export default function StudentVerifications() {
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
      message.error('학생 인증 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    loadVerifications();
  }, [loadVerifications]);

  const handleApprove = async (userId) => {
    try {
      await api.superAdmin.studentVerifications.approve(userId);
      message.success('학생 인증이 승인되었습니다.');
      loadVerifications();
    } catch (error) {
      console.error('학생 인증 승인 실패:', error);
      message.error(error.response?.data?.error || '학생 인증 승인에 실패했습니다.');
    }
  };

  const handleReject = async () => {
    if (!selectedUser || !rejectReason.trim()) {
      message.warning('거부 사유를 입력해주세요.');
      return;
    }

    try {
      await api.superAdmin.studentVerifications.reject(selectedUser.id, rejectReason);
      message.success('학생 인증이 거부되었습니다.');
      setRejectModalVisible(false);
      setRejectReason('');
      setSelectedUser(null);
      loadVerifications();
    } catch (error) {
      console.error('학생 인증 거부 실패:', error);
      message.error(error.response?.data?.error || '학생 인증 거부에 실패했습니다.');
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
      message.error('문서를 불러오는데 실패했습니다.');
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
            <h1 className="page-title">学生認証管理</h1>
            <p className="page-subtitle">学生認証申請の承認・却下</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">承認待ち</div>
            <div className="stat-value">{pagination.total}</div>
          </div>
        </div>

        <div className="filters">
          <div className="filter-item">
            <label>検索</label>
            <input
              type="text"
              placeholder="名前またはメールで検索..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        <div className="section">
          <div className="verification-grid">
            {loading ? (
              <div className="loading">読み込み中...</div>
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
                      📄 学生証画像を表示
                    </button>
                  </div>
                  <div className="product-details">
                    <div className="detail-row">
                      <span className="detail-label">申請日:</span>
                      <span className="detail-value">
                        {new Date(verification.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">ステータス:</span>
                      <span className="badge pending">承認待ち</span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      className="btn btn-approve"
                      onClick={() => handleApprove(verification.id)}
                    >
                      ✓ 承認
                    </button>
                    <button
                      className="btn btn-reject"
                      onClick={() => openRejectModal(verification)}
                    >
                      × 却下
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">承認待ちの申請はありません</div>
            )}
          </div>
        </div>

        {/* 문서 모달 */}
        <Modal
          title="認証文書"
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
              <p><strong>ユーザー:</strong> {selectedUser.username} ({selectedUser.email})</p>
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
          title="学生認証却下"
          open={rejectModalVisible}
          onOk={handleReject}
          onCancel={() => {
            setRejectModalVisible(false);
            setRejectReason('');
            setSelectedUser(null);
          }}
          okText="却下"
          cancelText="キャンセル"
        >
          <p>学生認証を却下する理由を入力してください。</p>
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="却下理由..."
          />
        </Modal>
      </div>
    </SuperAdminLayout>
  );
}

