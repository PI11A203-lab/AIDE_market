import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import {
  mockDashboardStats,
  mockRecentProducts,
  mockStudentVerifications,
  mockProducts,
  mockSellerApplications
} from './mockData';
import './SuperAdminDashboard.css';

const USE_MOCK_ON_ERROR = true;

export default function SuperAdminDashboard() {
  const { t } = useTranslation();
  const history = useHistory();
  const [stats, setStats] = useState({
    pendingProducts: 0,
    pendingStudents: 0,
    pendingSellerApplications: 0,
    todayAccess: 0,
    securityEvents: 0,
    pendingProductsChange: 0,
    pendingStudentsChange: 0,
    pendingSellerApplicationsChange: 0,
    todayAccessChange: 0,
    securityEventsChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 통계 데이터 로드
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const [productsRes, studentsRes, sellerApplicationsRes, ipStatsTodayRes, ipStatsYesterdayRes, securityEventsTodayRes, securityEventsYesterdayRes] = await Promise.all([
        api.superAdmin.products.getPending({ limit: 1 }).catch(() => ({ data: { totalCount: 0 } })),
        api.superAdmin.studentVerifications.getPending({ limit: 1 }).catch(() => ({ data: { totalCount: 0 } })),
        api.superAdmin.sellerApplications.getList({ status: 'pending' }).catch(() => ({ data: [] })),
        // 오늘 날짜의 IP 로그 통계 가져오기
        api.superAdmin.ip.getStats({ 
          dateFrom: today,
          dateTo: today
        }).catch(() => ({ data: { todayAccess: 0 } })),
        // 어제 날짜의 IP 로그 통계 가져오기
        api.superAdmin.ip.getStats({ 
          dateFrom: yesterdayStr,
          dateTo: yesterdayStr
        }).catch(() => ({ data: { todayAccess: 0 } })),
        // 오늘 날짜의 보안 이벤트 가져오기
        api.superAdmin.security.getEvents({ 
          limit: 1,
          dateFrom: today,
          dateTo: today
        }).catch(() => ({ data: { totalCount: 0 } })),
        // 어제 날짜의 보안 이벤트 가져오기
        api.superAdmin.security.getEvents({ 
          limit: 1,
          dateFrom: yesterdayStr,
          dateTo: yesterdayStr
        }).catch(() => ({ data: { totalCount: 0 } }))
      ]);

      // 최근 상품 목록 (API가 비어있으면 Mock 사용)
      const recentProductsData = productsRes.data?.products || [];
      const useProductsMock = recentProductsData.length === 0 && USE_MOCK_ON_ERROR;
      const displayProducts = useProductsMock ? mockProducts : recentProductsData;
      
      // 최근 활동 (간단한 목록) - Mock 사용 시 학생인증 1건 + 상품 2건
      let activities = displayProducts.slice(0, 3).map(p => ({
        time: t('profile.superAdmin.dashboard.recent'),
        type: t('profile.superAdmin.dashboard.productRequest'),
        detail: p.nameKey ? t(p.nameKey) : p.name,
        status: t('profile.superAdmin.dashboard.pending')
      }));
      if (useProductsMock && mockStudentVerifications.length > 0) {
        activities = [
          {
            time: t('profile.superAdmin.dashboard.recent'),
            type: t('profile.superAdmin.dashboard.studentRequest'),
            detail: `${mockStudentVerifications[0].username} (${mockStudentVerifications[0].email})`,
            status: t('profile.superAdmin.dashboard.pending')
          },
          ...activities
        ].slice(0, 3);
      }

      let todayAccess = ipStatsTodayRes.data?.todayAccess ?? ipStatsTodayRes.data?.totalAccess ?? 0;
      const yesterdayAccess = ipStatsYesterdayRes.data?.todayAccess ?? ipStatsYesterdayRes.data?.totalAccess ?? 0;
      let todaySecurityEvents = securityEventsTodayRes.data?.totalCount ?? 0;
      const yesterdaySecurityEvents = securityEventsYesterdayRes.data?.totalCount ?? 0;

      // 오늘의 접속·세큐리티: API가 0이면 임시 데이터(mockDashboardStats)로 표시
      if (todayAccess === 0 && USE_MOCK_ON_ERROR) {
        todayAccess = mockDashboardStats.todayAccess;
      }
      if (todaySecurityEvents === 0 && USE_MOCK_ON_ERROR) {
        todaySecurityEvents = mockDashboardStats.securityEvents;
      }

      // 변화량 계산 (오늘 - 어제). Mock 사용 시 mockDashboardStats 값 사용
      const accessChange = (todayAccess === mockDashboardStats.todayAccess && USE_MOCK_ON_ERROR)
        ? mockDashboardStats.todayAccessChange
        : todayAccess - yesterdayAccess;
      const securityEventsChange = (todaySecurityEvents === mockDashboardStats.securityEvents && USE_MOCK_ON_ERROR)
        ? mockDashboardStats.securityEventsChange
        : todaySecurityEvents - yesterdaySecurityEvents;
      
      // API가 0이면 Mock 데이터 숫자 표시 (학생인증·상품·판매자신청 페이지와 동기화)
      const rawPendingProducts = productsRes.data?.totalCount ?? recentProductsData.length;
      const rawPendingStudents = studentsRes.data?.totalCount ?? 0;
      const rawSellerApps = Array.isArray(sellerApplicationsRes.data) ? sellerApplicationsRes.data.length : 0;
      const pendingProducts = rawPendingProducts === 0 && USE_MOCK_ON_ERROR ? mockProducts.length : rawPendingProducts;
      const pendingStudents = rawPendingStudents === 0 && USE_MOCK_ON_ERROR ? mockStudentVerifications.length : rawPendingStudents;
      const pendingSellerApplications = rawSellerApps === 0 && USE_MOCK_ON_ERROR ? mockSellerApplications.length : rawSellerApps;

      setStats({
        pendingProducts,
        pendingStudents,
        pendingSellerApplications,
        todayAccess,
        securityEvents: todaySecurityEvents,
        pendingProductsChange: 0, // 실제로는 이전 데이터와 비교 필요
        pendingStudentsChange: 0, // 실제로는 이전 데이터와 비교 필요
        pendingSellerApplicationsChange: 0, // 실제로는 이전 데이터와 비교 필요
        todayAccessChange: accessChange,
        securityEventsChange: securityEventsChange
      });
      setRecentProducts(displayProducts.slice(0, 3));
      setRecentActivities(activities);
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
      if (USE_MOCK_ON_ERROR) {
        const activities = [
          ...mockRecentProducts.slice(0, 3).map(p => ({
            time: t('profile.superAdmin.dashboard.recent'),
            type: t('profile.superAdmin.dashboard.productRequest'),
            detail: p.nameKey ? t(p.nameKey) : p.name,
            status: t('profile.superAdmin.dashboard.pending')
          }))
        ];
        setStats(mockDashboardStats);
        setRecentProducts(mockRecentProducts);
        setRecentActivities(activities);
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="loading-container">{t('profile.superAdmin.dashboard.loading')}</div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">{t('profile.superAdmin.dashboard.title')}</h1>
            <p className="page-subtitle">{t('profile.superAdmin.dashboard.subtitle')}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div 
            className="stat-card clickable" 
            onClick={() => history.push('/profile/super-admin/products')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-label">{t('profile.superAdmin.dashboard.stats.pendingProducts')}</div>
            <div className="stat-value">{stats.pendingProducts}</div>
            <div className={stats.pendingProductsChange !== 0 ? "stat-change" : "stat-change"} style={{ color: stats.pendingProductsChange > 0 ? '#10b981' : stats.pendingProductsChange < 0 ? '#ef4444' : '#666' }}>
              {stats.pendingProductsChange > 0 ? `+${stats.pendingProductsChange} ${t('profile.superAdmin.dashboard.today')}` : 
               stats.pendingProductsChange < 0 ? `${stats.pendingProductsChange} ${t('profile.superAdmin.dashboard.today')}` : 
               t('profile.superAdmin.dashboard.stats.noNewRequest')}
            </div>
          </div>
          <div 
            className="stat-card clickable" 
            onClick={() => history.push('/profile/super-admin/student-verifications')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-label">{t('profile.superAdmin.dashboard.stats.pendingStudents')}</div>
            <div className="stat-value">{stats.pendingStudents}</div>
            <div className={stats.pendingStudentsChange !== 0 ? "stat-change" : "stat-change"} style={{ color: stats.pendingStudentsChange > 0 ? '#10b981' : stats.pendingStudentsChange < 0 ? '#ef4444' : '#666' }}>
              {stats.pendingStudentsChange > 0 ? `+${stats.pendingStudentsChange} ${t('profile.superAdmin.dashboard.today')}` : 
               stats.pendingStudentsChange < 0 ? `${stats.pendingStudentsChange} ${t('profile.superAdmin.dashboard.today')}` : 
               t('profile.superAdmin.dashboard.stats.noNewRequest')}
            </div>
          </div>
          <div 
            className="stat-card clickable" 
            onClick={() => history.push('/profile/super-admin/ip-management')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-label">{t('profile.superAdmin.dashboard.stats.todayAccess')}</div>
            <div className="stat-value">{stats.todayAccess.toLocaleString()}</div>
            <div className={stats.todayAccessChange !== 0 ? "stat-change" : "stat-change"} style={{ color: stats.todayAccessChange > 0 ? '#10b981' : stats.todayAccessChange < 0 ? '#ef4444' : '#666' }}>
              {stats.todayAccessChange > 0 ? `+${stats.todayAccessChange.toLocaleString()}` : 
               stats.todayAccessChange < 0 ? `${stats.todayAccessChange.toLocaleString()}` : 
               t('profile.superAdmin.dashboard.stats.noChange')}
            </div>
          </div>
          <div 
            className="stat-card clickable" 
            onClick={() => history.push('/profile/super-admin/seller-applications')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-label">{t('profile.superAdmin.dashboard.stats.pendingSellerApplications')}</div>
            <div className="stat-value">{stats.pendingSellerApplications}</div>
            <div className={stats.pendingSellerApplicationsChange !== 0 ? "stat-change" : "stat-change"} style={{ color: stats.pendingSellerApplicationsChange > 0 ? '#10b981' : stats.pendingSellerApplicationsChange < 0 ? '#ef4444' : '#666' }}>
              {stats.pendingSellerApplicationsChange > 0 ? `+${stats.pendingSellerApplicationsChange} ${t('profile.superAdmin.dashboard.today')}` : 
               stats.pendingSellerApplicationsChange < 0 ? `${stats.pendingSellerApplicationsChange} ${t('profile.superAdmin.dashboard.today')}` : 
               t('profile.superAdmin.dashboard.stats.noNewRequest')}
            </div>
          </div>
          <div 
            className="stat-card clickable" 
            onClick={() => history.push('/profile/super-admin/security')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-label">{t('profile.superAdmin.dashboard.stats.securityEvents')}</div>
            <div className="stat-value">{stats.securityEvents}</div>
            <div className={stats.securityEventsChange !== 0 ? "stat-change" : "stat-change"} style={{ color: stats.securityEventsChange > 0 ? '#ef4444' : stats.securityEventsChange < 0 ? '#ef4444' : '#666' }}>
              {stats.securityEventsChange > 0 ? t('profile.superAdmin.dashboard.stats.attention') : 
               stats.securityEventsChange < 0 ? `-${Math.abs(stats.securityEventsChange)}` : 
               t('profile.superAdmin.dashboard.stats.normal')}
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">{t('profile.superAdmin.dashboard.sections.pendingProducts')}</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>{t('profile.superAdmin.dashboard.table.productName')}</th>
                <th>{t('profile.superAdmin.dashboard.table.category')}</th>
                <th>{t('profile.superAdmin.dashboard.table.price')}</th>
                <th>{t('profile.superAdmin.dashboard.table.applicant')}</th>
                <th>{t('profile.superAdmin.dashboard.table.requestDate')}</th>
                <th>{t('profile.superAdmin.dashboard.table.status')}</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.nameKey ? t(product.nameKey) : product.name}</td>
                    <td>{product.categoryKey ? t(product.categoryKey) : product.category?.name || '-'}</td>
                    <td>¥{product.price?.toLocaleString() || '0'}</td>
                    <td>{product.creator?.username || '-'}</td>
                    <td>{new Date(product.approval_requested_at || product.createdAt).toLocaleDateString()}</td>
                    <td><span className="badge pending">{t('profile.superAdmin.dashboard.pending')}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    {t('profile.superAdmin.dashboard.empty.noPendingProducts')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">{t('profile.superAdmin.dashboard.sections.recentActivity')}</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>{t('profile.superAdmin.dashboard.table.time')}</th>
                <th>{t('profile.superAdmin.dashboard.table.event')}</th>
                <th>{t('profile.superAdmin.dashboard.table.detail')}</th>
                <th>{t('profile.superAdmin.dashboard.table.status')}</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.time}</td>
                    <td>{activity.type}</td>
                    <td>{activity.detail}</td>
                    <td><span className="badge pending">{activity.status}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                    {t('profile.superAdmin.dashboard.empty.noRecentActivity')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
}

