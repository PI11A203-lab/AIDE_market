import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { api } from '../../../config/api';
import './SellerApplications.css';

export default function SellerApplications() {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.superAdmin.sellerApplications.getList({ status: filter });
      setApplications(response.data || []);
    } catch (error) {
      console.error('신청 목록 로드 오류:', error);
      message.error('신청 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
    loadApplications();
  }, [i18n, loadApplications]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (app) => {
    if (app.role === 'admin') {
      return <span className="badge badge-approved">✅ 승인됨</span>;
    } else if (app.seller_rejected_at) {
      return <span className="badge badge-rejected">❌ 반려됨</span>;
    } else {
      return <span className="badge badge-pending">⏳ 대기중</span>;
    }
  };

  const getApplicationData = (app) => {
    try {
      return typeof app.seller_application_data === 'string'
        ? JSON.parse(app.seller_application_data)
        : app.seller_application_data || {};
    } catch {
      return {};
    }
  };

  return (
    <div className="seller-applications-container">
      <div className="seller-applications-content">
        <h1 className="page-title">판매자 신청 관리</h1>

        {/* 필터 */}
        <div className="filter-bar">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            대기중
          </button>
          <button
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            승인됨
          </button>
          <button
            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            반려됨
          </button>
        </div>

        {/* 테이블 */}
        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : applications.length === 0 ? (
          <div className="empty-state">신청 내역이 없습니다.</div>
        ) : (
          <div className="table-container">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>신청자</th>
                  <th>판매자명</th>
                  <th>이메일</th>
                  <th>전문분야</th>
                  <th>신청일</th>
                  <th>상태</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const appData = getApplicationData(app);
                  return (
                    <tr key={app.user_id}>
                      <td>{app.user_id}</td>
                      <td>{app.username}</td>
                      <td>{appData.seller_name || '-'}</td>
                      <td>{appData.contact_email || '-'}</td>
                      <td>{appData.specialization || '-'}</td>
                      <td>{formatDate(app.seller_requested_at)}</td>
                      <td>{getStatusBadge(app)}</td>
                      <td>
                        <Link
                          to={`/profile/super-admin/seller-applications/${app.user_id}`}
                          className="btn-view"
                        >
                          상세보기
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
