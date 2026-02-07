import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { api } from '../../../config/api';
import { mockSellerApplications } from './mockData';
import SuperAdminLayout from './components/SuperAdminLayout';
import './SellerApplications.css';

const USE_MOCK_ON_ERROR = true;

export default function SellerApplications() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');

  /** 카테고리(필터)에 맞게 목록 필터링: all | pending | approved | rejected */
  const filterByStatus = useCallback((list, status) => {
    if (!list || !list.length) return [];
    if (status === 'all') return list;
    if (status === 'pending') {
      return list.filter((app) => app.role !== 'admin' && app.role !== 'seller' && !app.seller_rejected_at);
    }
    if (status === 'approved') {
      return list.filter((app) => app.role === 'admin' || app.role === 'seller');
    }
    if (status === 'rejected') {
      return list.filter((app) => app.seller_rejected_at != null);
    }
    return list;
  }, []);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      if (USE_MOCK_ON_ERROR) {
        const filtered = filterByStatus(mockSellerApplications, filter);
        setApplications(filtered);
        return;
      }
      const response = await api.superAdmin.sellerApplications.getList({ status: filter });
      const data = response.data || [];
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('신청 목록 로드 오류:', error);
      message.error(t('profile.superAdmin.sellerApplications.messages.loadFail'));
      if (USE_MOCK_ON_ERROR) {
        const filtered = filterByStatus(mockSellerApplications, filter);
        setApplications(filtered);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, filterByStatus]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

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
      return <span className="badge badge-approved">{t('profile.superAdmin.sellerApplications.status.approved')}</span>;
    } else if (app.seller_rejected_at) {
      return <span className="badge badge-rejected">{t('profile.superAdmin.sellerApplications.status.rejected')}</span>;
    } else {
      return <span className="badge badge-pending">{t('profile.superAdmin.sellerApplications.status.pending')}</span>;
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
    <SuperAdminLayout>
      <div className="seller-applications-container">
        <div className="seller-applications-content">
          <h1 className="page-title">{t('profile.superAdmin.sellerApplications.title')}</h1>

          {/* 필터 */}
          <div className="filter-bar">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('profile.superAdmin.sellerApplications.filters.all')}
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              {t('profile.superAdmin.sellerApplications.filters.pending')}
            </button>
            <button
              className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              {t('profile.superAdmin.sellerApplications.filters.approved')}
            </button>
            <button
              className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              {t('profile.superAdmin.sellerApplications.filters.rejected')}
            </button>
          </div>

          {/* 테이블 */}
          {loading ? (
            <div className="loading">{t('profile.superAdmin.sellerApplications.messages.loading')}</div>
          ) : applications.length === 0 ? (
            <div className="empty-state">{t('profile.superAdmin.sellerApplications.messages.empty')}</div>
          ) : (
            <div className="table-container">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>{t('profile.superAdmin.sellerApplications.table.id')}</th>
                    <th>{t('profile.superAdmin.sellerApplications.table.applicant')}</th>
                    <th>{t('profile.superAdmin.sellerApplications.table.sellerName')}</th>
                    <th>{t('profile.superAdmin.sellerApplications.table.email')}</th>
                    <th>{t('profile.superAdmin.sellerApplications.table.specialization')}</th>
                    <th>{t('profile.superAdmin.sellerApplications.table.requestDate')}</th>
                    <th>{t('profile.superAdmin.sellerApplications.table.status')}</th>
                    <th>{t('profile.superAdmin.sellerApplications.table.action')}</th>
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
                            {t('profile.superAdmin.sellerApplications.table.viewDetail')}
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
    </SuperAdminLayout>
  );
}
